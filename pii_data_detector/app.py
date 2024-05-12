from flask import Flask
from flask_restful import Api, Resource, reqparse

import os
import re
import bisect

import torch
import numpy as np
import pandas as pd
from datasets import Dataset
from spacy.lang.en import English
from transformers.models.deberta_v2 import DebertaV2ForTokenClassification, DebertaV2TokenizerFast
from transformers.tokenization_utils_base import PreTrainedTokenizerBase
from transformers.trainer import Trainer
from transformers.training_args import TrainingArguments
from transformers.data.data_collator import DataCollatorForTokenClassification

app = Flask(__name__)
api = Api(app)

nlp = English()
en_tokenizer = English().tokenizer

INFERENCE_MAX_LENGTH = 3072
CONF_THRESH = 0.90  # threshold for "O" class
URL_THRESH = 0.1  # threshold for URL
AMP = True
MODEL_PATH = './model/'


def find_span(target: list[str], document: list[str]) -> list[list[int]]:
    idx = 0
    spans = []
    span = []

    for i, token in enumerate(document):
        if token != target[idx]:
            idx = 0
            span = []
            continue
        span.append(i)
        idx += 1
        if idx == len(target):
            spans.append(span)
            span = []
            idx = 0
            continue

    return spans


def spacy_to_hf(data: dict, idx: int) -> slice:
    """
    Given an index of spacy token, return corresponding indices in deberta's output.
    We use this to find indice of URL tokens later.
    """
    str_range = np.where(np.array(data["token_map"]) == idx)[0]
    start_idx = bisect.bisect_left(
        [off[1] for off in data["offset_mapping"]], str_range.min())
    end_idx = start_idx
    while end_idx < len(data["offset_mapping"]):
        if str_range.max() > data["offset_mapping"][end_idx][1]:
            end_idx += 1
            continue
        break
    token_range = slice(start_idx, end_idx+1)
    return token_range


class CustomTokenizer:
    def __init__(self, tokenizer: PreTrainedTokenizerBase, max_length: int) -> None:
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __call__(self, example: dict) -> dict:
        text = []
        token_map = []

        for idx, (t, ws) in enumerate(zip(example["tokens"], example["trailing_whitespace"])):
            text.append(t)
            token_map.extend([idx]*len(t))
            if ws:
                text.append(" ")
                token_map.append(-1)

        tokenized = self.tokenizer(
            "".join(text),
            return_offsets_mapping=True,
            truncation=True,
            max_length=self.max_length,
        )

        return {**tokenized, "token_map": token_map, }


def tokenize_with_spacy(text, tokenizer=en_tokenizer):
    tokenized_text = tokenizer(text)
    tokens = [token.text for token in tokenized_text]
    trailing_whitespace = [bool(token.whitespace_) for token in tokenized_text]
    return tokens, trailing_whitespace


pii_get_args = reqparse.RequestParser()
pii_get_args.add_argument(
    "text", type=str, help="Text that will be used to detect PII")


class PII(Resource):
    def get(self):
        try: 
            args = pii_get_args.parse_args()
            text = args["text"]
            if text is None:
                return {"message": "Text is required"}, 400
            tokens, trailing_whitespace = tokenize_with_spacy(text)
            data = [{
                'document': 0,
                'full_text': text,
                'tokens': tokens,
                'trailing_whitespace': trailing_whitespace,
            }]

            ds = Dataset.from_dict({
                "full_text": [x["full_text"] for x in data],
                "document": [x["document"] for x in data],
                "tokens": [x["tokens"] for x in data],
                "trailing_whitespace": [x["trailing_whitespace"] for x in data],
            })

            tokenizer = DebertaV2TokenizerFast.from_pretrained(MODEL_PATH)
            ds = ds.map(CustomTokenizer(tokenizer=tokenizer,
                        max_length=INFERENCE_MAX_LENGTH), num_proc=os.cpu_count())

            model = DebertaV2ForTokenClassification.from_pretrained(MODEL_PATH)

            collator = DataCollatorForTokenClassification(tokenizer)
            args = TrainingArguments(
                ".", per_device_eval_batch_size=1, report_to="none")
            trainer = Trainer(
                model=model, args=args, data_collator=collator, tokenizer=tokenizer,
            )

            predictions = trainer.predict(ds).predictions

            pred_softmax = torch.softmax(
                torch.from_numpy(predictions), dim=2).numpy()
            id2label = model.config.id2label
            o_index = model.config.label2id["O"]
            preds = predictions.argmax(-1)
            preds_without_o = pred_softmax.copy()
            preds_without_o[:, :, o_index] = 0
            preds_without_o = preds_without_o.argmax(-1)
            o_preds = pred_softmax[:, :, o_index]
            preds_final = np.where(o_preds < CONF_THRESH, preds_without_o, preds)

            processed = []
            pairs = set()

            # Iterate over document
            for p, token_map, offsets, tokens, doc in zip(
                preds_final, ds["token_map"], ds["offset_mapping"], ds["tokens"], ds["document"]
            ):
                # Iterate over sequence
                for token_pred, (start_idx, end_idx) in zip(p, offsets):
                    label_pred = id2label[token_pred]

                    if start_idx + end_idx == 0:
                        # [CLS] token i.e. BOS
                        continue

                    if token_map[start_idx] == -1:
                        start_idx += 1

                    # ignore "\n\n"
                    while start_idx < len(token_map) and tokens[token_map[start_idx]].isspace():
                        start_idx += 1

                    if start_idx >= len(token_map):
                        break

                    token_id = token_map[start_idx]
                    pair = (doc, token_id)

                    # ignore certain labels and whitespace
                    if label_pred in ("O", "B-EMAIL", "B-URL_PERSONAL", "B-PHONE_NUM", "I-PHONE_NUM") or token_id == -1:
                        continue

                    if pair in pairs:
                        continue

                    processed.append(
                        {"document": doc, "token": token_id,
                            "label": label_pred, "token_str": tokens[token_id]}
                    )
                    pairs.add(pair)

            url_whitelist = [
                "wikipedia.org",
                "coursera.org",
                "google.com",
                ".gov",
            ]
            url_whitelist_regex = re.compile("|".join(url_whitelist))

            for row_idx, _data in enumerate(ds):
                for token_idx, token in enumerate(_data["tokens"]):
                    if not nlp.tokenizer.url_match(token):
                        continue
                    print(f"Found URL: {token}")
                    if url_whitelist_regex.search(token) is not None:
                        print("The above is in the whitelist")
                        continue
                    input_idxs = spacy_to_hf(_data, token_idx)
                    probs = pred_softmax[row_idx, input_idxs,
                                        model.config.label2id["B-URL_PERSONAL"]]
                    if probs.mean() > URL_THRESH:
                        print("The above is PII")
                        processed.append(
                            {
                                "document": _data["document"],
                                "token": token_idx,
                                "label": "B-URL_PERSONAL",
                                "token_str": token
                            }
                        )
                        pairs.add((_data["document"], token_idx))
                    else:
                        print("The above is not PII")

            email_regex = re.compile(r'[\w.+-]+@[\w-]+\.[\w.-]+')
            phone_num_regex = re.compile(
                r"(\(\d{3}\)\d{3}\-\d{4}\w*|\d{3}\.\d{3}\.\d{4})\s")
            emails = []
            phone_nums = []

            for _data in ds:
                # email
                for token_idx, token in enumerate(_data["tokens"]):
                    if re.fullmatch(email_regex, token) is not None:
                        emails.append(
                            {"document": _data["document"], "token": token_idx,
                                "label": "B-EMAIL", "token_str": token}
                        )
                # phone number
                matches = phone_num_regex.findall(_data["full_text"])
                if not matches:
                    continue
                for match in matches:
                    target = [t.text for t in nlp.tokenizer(match)]
                    matched_spans = find_span(target, _data["tokens"])
                for matched_span in matched_spans:
                    for intermediate, token_idx in enumerate(matched_span):
                        prefix = "I" if intermediate else "B"
                        phone_nums.append(
                            {"document": _data["document"], "token": token_idx, "label": f"{prefix}-PHONE_NUM", "token_str": _data["tokens"][token_idx]}
                        )

            df = pd.DataFrame(processed + emails + phone_nums)
            df["row_id"] = list(range(len(df)))

            return { "data": data[0], "prediction": df.to_dict()}
        except Exception as e:
            print(f"An error occured: {e}")


api.add_resource(PII, "/pii")

if __name__ == "__main__":
    app.run(debug=True)
