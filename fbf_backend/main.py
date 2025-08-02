from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # for dev 
    # allow_origins=["https://your-frontend.com"],  
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)

class Question(BaseModel):
    query: str

@app.post("/ask")
def ask_question(data: Question):
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [{
            "parts": [{
                "text": data.query
            }]
        }]
    }

    try:
        response = requests.post(f"{url}?key={GEMINI_API_KEY}", json=payload, headers=headers)
        print("Status:", response.status_code)
        print("Response:", response.text)

        res_json = response.json()
        return {"answer": res_json['candidates'][0]['content']['parts'][0]['text']}
    except Exception as e:
        print("Error:", e)
        return {"answer": "Could not process your request."}
