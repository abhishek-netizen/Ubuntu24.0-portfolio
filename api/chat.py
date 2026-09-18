import os
import json
import re
from http.server import BaseHTTPRequestHandler
from openai import OpenAI
from pypdf import PdfReader

# Base directory setup
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load profile.json
profile_path = os.path.join(root_dir, "profile.json")
PROFILE = {}
if os.path.exists(profile_path):
    try:
        with open(profile_path, "r", encoding="utf-8") as f:
            PROFILE = json.load(f)
    except Exception as e:
        print(f"Error loading profile.json: {e}")

PERSONA_NAME = PROFILE.get("name", "Abhishek J N")
PERSONA_ROLE = PROFILE.get("role", "Full Stack Software Engineer")
PERSONA_SHORT = PROFILE.get("shortName", "Abhishek")

# Load resume text
pdf_path = os.path.join(root_dir, "backend", "twin", "resume.pdf")
resume_text = ""
if os.path.exists(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        raw_text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                raw_text += extracted + "\n\n"
        cleaned = re.sub(r'\n+', ' ', raw_text)
        resume_text = re.sub(r'\s+', ' ', cleaned).strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")

SYSTEM_PROMPT = f"""You are the official AI Digital Twin of {PERSONA_NAME}, representing him as a {PERSONA_ROLE}.
Your goal is to answer questions from recruiters, hiring managers, and visitors about his professional background, skills, certifications, and experience.

### Core Rules:
1. Speak in first-person ("I", "my") as {PERSONA_NAME}.
2. Keep your answers concise, professional, warm, and structured.
3. Base your technical knowledge on his resume content:
---
{resume_text}
---
4. Profile Details:
- Name: {PERSONA_NAME}
- Role: {PERSONA_ROLE}
- Email: {PROFILE.get("email", "")}
- GitHub: {PROFILE.get("githubUrl", "")}
- LinkedIn: {PROFILE.get("linkedinUrl", "")}
- Twitter: {PROFILE.get("twitterUrl", "")}
- Stack Overflow: {PROFILE.get("stackoverflowUrl", "")}
"""

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode("utf-8")) if body else {}
            user_message = data.get("message", "").strip()
            history = data.get("history", [])

            if not user_message:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Message parameter is required."}).encode("utf-8"))
                return

            api_key = os.environ.get("OPENAI_API_KEY")
            if not api_key:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "OPENAI_API_KEY environment variable is not configured."}).encode("utf-8"))
                return

            client = OpenAI(api_key=api_key)
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]

            for item in history:
                if isinstance(item, dict) and "role" in item and "content" in item:
                    messages.append({"role": item["role"], "content": item["content"]})
            
            messages.append({"role": "user", "content": user_message})

            completion = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7,
                max_tokens=500,
            )

            bot_reply = completion.choices[0].message.content.strip()

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"response": bot_reply}).encode("utf-8"))

        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
