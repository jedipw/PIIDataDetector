import requests

BASE = "http://127.0.0.1:5000/"

response = requests.post(BASE + "pii", {"text": "Hello. My name is Pawin Nakvisai."})
print(response.json())