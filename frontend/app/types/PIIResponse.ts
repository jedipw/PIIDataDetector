export default interface PIIResponse {
    data: {
        document: number;
        full_text: string;
        tokens: string[];
        trailing_whitespace: boolean[];
    };
    prediction: {
        document: {
            [key: string]: number;
        };
        token: {
            [key: string]: number;
        };
        label: {
            [key: string]: string;
        };
        token_str: {
            [key: string]: string;
        };
        row_id: {
            [key: string]: number;
        };
    };
}