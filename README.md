# PII Data Detector

The Personally Identifiable Information (PII) Data Detector is an individual machine learning project developed as part of the CSC532 Machine Learning course. The goal of this project is to detect personally identifiable information (PII) in student writing. In the web application, users can input text into the text editor. The application will then highlight words considered as PII and suggest removing those words. Additionally, users can save the text for later viewing.

## Technology Stacks

<b>Programming Languages:</b>
- Python
- TypeScript
- Go

<b>AI/Data Science Tools:</b>
- PEFT
- Spacy
- Transformers
- Gemma
- Faker
- Numpy
- Pandas
- Matplotlib
- Seaborn

<b>Development Tools:</b>
- <b>Web Application:</b> NextJS
- <b>Backend APIs:</b> Go Fiber, Flask
- <b>Database:</b> PostgreSQL
- <b>Database ORM:</b> Prisma
- <b>3rd Party API:</b> Firebase Authentication
- <b>Container Management:</b> Docker
- <b>Hosting:</b> Google Cloud Run
- <b>CI/CD:</b> GitHub Action

## Screenshot

![PIIDataDetector_Screenshot](https://github.com/jedipw/PIIDataDetector/assets/82791342/3f3d4407-c9e6-419a-b89e-331e39f3bad0)

## First Time Setup
### PII Data Detector
1. Download `model.safetensors` from https://drive.google.com/file/d/19gw8qc6TlHQb5Ag2Ke_e2vEPfVGCRrW3/view?usp=sharing and place it in `/pii_data_detector/model`.
1. In the terminal, navigate to the `/pii_data_detector` directory.
2. Run `pip install -r requirements.txt` in the terminal.
3. Run `python main.py` in the terminal to start the server.

### Backend
1. In the terminal, navigate to the `/backend` directory.
2. Create `.env` in that directory. (See the example in `.env.example`)
3. Run `go run github.com/steebchen/prisma-client-go db push` in the terminal.
4. Run `go run server.go` in the terminal to start the server.

### Frontend
1. In the terminal, navigate to the `/frontend` directory.
2. Create `.env.local` in that directory. (See the example in `.env.example`)
3. Run `npm i` in the terminal.
4. Run `npm run dev` in the terminal to start the server.

**Note 1:** You may be required to install additional packages/libraries.<br>
**Note 2:** You must run all three servers in order for the web application to be fully functional.<br>
**Note 3:** It is mandatory to set up the PostgreSQL database first before running.<br>

## More Information
For more information, please refer to the "Wiki" section at https://github.com/jedipw/PIIDataDetector/wiki.
