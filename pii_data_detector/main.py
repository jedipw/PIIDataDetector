from flask import Flask
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api(app)

pii_get_args = reqparse.RequestParser()
pii_get_args.add_argument("text", type=str, help="Text that will be used to detect PII")

class PII(Resource):
    def get(self):
        args = pii_get_args.parse_args()
        return args
    
api.add_resource(PII, "/pii")

if __name__ == "__main__":
    app.run(debug=True)