import os
from flask import Flask, request, jsonify,render_template
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi
from flask_cors import CORS
import re
import requests

load_dotenv()

# Configure Illama API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# models = genai.list_models()
# for model in models:
#     print(model.name, "=>", model.supported_generation_methods)


app = Flask(__name__)
CORS(app)  


PROMPT = """
You are a YouTube video summarizer. Summarize the transcript below into a clean, concise bullet-point summary within 250 words. Use clear, structured formatting.

Transcript:
"""

@app.route('/')
def index():
    return render_template('index.html') 


def extract_transcript_details(youtube_video_url):
  try:
        
        match = re.search(r"(?:v=|youtu\.be/)([a-zA-Z0-9_-]{11})", youtube_video_url)
        if not match:
            raise ValueError("Invalid YouTube URL format")
        
        video_id = match.group(1)

        transcript_text = YouTubeTranscriptApi.get_transcript(video_id)

        transcript = " ".join([i["text"] for i in transcript_text])
        if len(transcript) > 5000:
            transcript = transcript[:5000] + "..."
        return transcript

  except Exception as e:
        raise e
# Summary
def generate_llama_summary(transcript,prompt):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama3-70b-8192",
        "messages": [
            {"role": "system", "content": "You are a YouTube video summarizer."},
            {"role": "user", "content": PROMPT + transcript}
        ],
        "temperature": 0.7
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        raise Exception(f"Groq API Error: {response.status_code} {response.text}")

    return response.json()["choices"][0]["message"]["content"]
   

@app.route('/api/summarize', methods=['POST'])
def summarize_video():
    data = request.get_json()
    video_url = data.get("url")

    if not video_url:
        return jsonify({"error": "No YouTube URL provided"}), 400

    try:
        transcript = extract_transcript_details(video_url)
        summary = generate_llama_summary(transcript, PROMPT)
        return jsonify({"summary": summary}), 200

    except Exception as e:
        print("Error:", str(e)) 
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
