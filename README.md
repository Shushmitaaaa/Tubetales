# 🎬 AI-Powered YouTube Summarizer


An intelligent web application that leverages the power of **LLaMA 3 (70B)** hosted on **Groq** to generate accurate and concise summaries of YouTube videos in seconds. Built using **Flask**, **JavaScript**, and the **YouTube Transcript API**, this project is optimized for speed, clarity, and professional deployment.



##  Live Demo

Try the live app here : [https://tubetales-1.onrender.com/](https://tubetales-1.onrender.com)


##  Screenshots

![homee](https://github.com/user-attachments/assets/a6aa1153-7b77-437c-bfa5-ad9fea521062)

![summarizer](https://github.com/user-attachments/assets/3d21bc78-35e4-4130-85ed-0b7ce9e28b06)

![summarizer1](https://github.com/user-attachments/assets/9200fe45-b518-4b16-87be-391f19e77fe0)


## Obtaining API Key

Groq API Key:
* Go to Groq Cloud
* Sign up for an account
* Navigate to API settings
* Generate a new API key

##  Tech Stack
   
 Frontend:   HTML, CSS, JavaScript     
 Backend :    Python, Flask, Flask-CORS    
 LLM     :   LLaMA 3 (70B) on Groq     
 Transcript:  youtube-transcript-api    
 Deployment: Render (free tier)        


## Local Setup Instructions

### 1.Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Create `.env` File

```env
GROQ_API_KEY=your_groq_api_key_here
```

> You can get your API key from [Groq Console](https://console.groq.com)

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**requirements.txt** should include:

```txt
flask
flask-cors
python-dotenv
youtube-transcript-api
requests
```

### 4.Run the Application

```bash
python app.py
```

Access it at `http://localhost:5000`


##  Deployment on Render

###  Environment Variables

* `GROQ_API_KEY` → Your Groq API Key

### Build & Start Commands

* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `gunicorn app:app`

> Don't forget to include `gunicorn` in your `requirements.txt`.



##  How It Works

* You paste a YouTube video URL
* The backend extracts the video transcript using `youtube-transcript-api`
* The transcript is sent to **LLaMA 3 (70B)** hosted on **Groq**
* The LLM responds with a clear, structured summary
* The frontend renders the summary, allowing you to copy or download it


##  Use Cases

*  Quick content consumption
*  Research & note-taking
*  Competitive exam prep
*  Content repurposing
*  Learning on the go






