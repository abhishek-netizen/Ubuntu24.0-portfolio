import os
import json
# pyrefly: ignore [missing-import]
import gradio as gr
from dotenv import load_dotenv
from openai import OpenAI
from pypdf import PdfReader

# Load .env from backend directory or workspace root
backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(backend_dir, ".env"))
load_dotenv()

import re

# Load centralized profile config (if available)
profile_path = os.path.join(backend_dir, "..", "profile.json")
if not os.path.exists(profile_path):
    profile_path = os.path.join(backend_dir, "profile.json")

PROFILE = {}
if os.path.exists(profile_path):
    try:
        with open(profile_path, "r", encoding="utf-8") as f:
            PROFILE = json.load(f)
        print(f"👤 Successfully loaded profile config for '{PROFILE.get('name', 'Digital Twin')}'")
    except Exception as e:
        print(f"⚠️ Could not load profile.json: {e}")

PERSONA_NAME = PROFILE.get("name", "Abhishek J N")
PERSONA_ROLE = PROFILE.get("role", "Full Stack Software Engineer")
PERSONA_SHORT = PROFILE.get("shortName", "Abhishek")

# Read and extract text from twin/resume.pdf with layout normalization
pdf_path = os.path.join(backend_dir, "twin", "resume.pdf")
resume_text = ""
if os.path.exists(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        raw_text = ""
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                raw_text += extracted + "\n\n"
        # Normalize whitespace and PDF layout line breaks
        cleaned = re.sub(r'\n+', ' ', raw_text)
        resume_text = re.sub(r'\s+', ' ', cleaned).strip()
        print(f"📄 Successfully loaded resume.pdf ({len(resume_text)} characters extracted & normalized).")
    except Exception as e:
        print(f"⚠️ Error reading PDF file '{pdf_path}': {e}")

RESUME = resume_text

STRUCTURED_RESUME_KNOWLEDGE = """
NAME: Abhishek J N
TITLE: Full Stack Software Engineer
LOCATION: Bengaluru, India
PHONE: 8660151380
EMAIL: sayhello.jn.7@gmail.com
LINKS: GitHub, LinkedIn, Stack Overflow, Medium, Personal Website

PROFESSIONAL SUMMARY:
Results-driven Full Stack Software Engineer currently contributing to digital transformation initiatives at Deloitte India, assigned to the Eli Lilly client project in Bangalore. Owns end-to-end development of high-impact applications, leading both frontend (React.js) and backend (Node.js, Python) components while architecting and deploying scalable APIs on AWS (Lambda, API Gateway, AWS SAM, Postgres, S3, AWS Glue, CloudFormation). Expertise in Redux, React Query, OpenAI/ChatGPT API integration, and CI/CD pipelines.

WORK EXPERIENCE & PROJECTS:

1. Deloitte India (Eli Lilly Client Engagement) | Bengaluru, India
   Role: Full Stack Software Engineer (June 2025 - Present)
   Tech Stack: React.js, Node.js, Python, SQLAlchemy, Sequelize, TypeScript, AWS (Lambda, API Gateway, S3, Glue, CloudWatch, CloudTrail, CloudFormation, Textract), OpenAI API, RDS, DynamoDB, Azure AD SSO.
   
   Project 2: CSA-Launchpad
   - Implemented Single Sign-On (SSO) authentication integrated with Azure AD groups.
   - Developed authentication flows, secure redirects, session handling, and cookie-based auth.
   - Managed user session persistence using DynamoDB across Dev, QA, and Production environments.
   - Implemented Role-Based Access Control (RBAC) using distribution list (DL) mappings.
   - Configured S3 object lifecycle and TTL policies for secure document retention.
   - Built AI-powered document processing workflows using AWS Textract and OpenAI APIs to extract, classify, and validate documents.
   - Designed paginated RESTful APIs using Node.js and React.js for handling large datasets.
   - Developed pixel-perfect React.js UI components based on Figma designs.

   Project 1: GT-Connect
   - Led end-to-end full-stack development for Eli Lilly's GT-Connect project using React.js, Node.js, Python, and AWS.
   - Refactored task-processor from AWS Lambda to AWS Glue Jobs, enabling handling of compute-intensive tasks with improved scalability and cost efficiency.
   - Implemented long-polling and efficient data-fetching mechanisms in React.js for large datasets.
   - Enabled secure file uploads to Amazon S3 using pre-signed URLs.
   - Configured Dependabot alerts and vulnerability security checks.
   - Optimised Middleware queries using composite keys and targeted PostgreSQL indexes to eliminate database bottlenecks.

2. Turtil | Hyderabad, India
   Role: Full Stack Software Engineer (February 2023 - May 2025)
   Tech Stack: Python, TypeScript, Boto3, FastAPI, Flask, Terraform, AWS Serverless (API Gateway, Lambda, DynamoDB, RDS, EC2, CloudWatch), Node.js, Express, REST APIs, Cognito.
   - Developed scalable web applications, reducing page load time by 30%.
   - Architected RESTful APIs to handle high-traffic requests efficiently.
   - Led legacy system migration to AWS cloud-native solutions.
   - Implemented data security protocols (encryption, authentication).
   - Optimized database queries, achieving up to 40% reduction in query execution time.
   - Automated CI/CD pipelines, reducing deployment time by 50%.
   - Conducted code reviews, reducing production bugs by 25%.

3. Lobb Logistics | Bengaluru, India
   Role: Software Developer (April 2022 - February 2023)
   Tech Stack: TypeScript, React, React Native, Expo, Tailwind CSS, HTML5, CSS3, Material-UI, React Query, Redux.
   - Developed cross-platform mobile applications using React Native for Android and iOS.
   - Optimized mobile app performance, reducing app load time by 40%.
   - Reduced app crash rates by 25% through debugging and troubleshooting.
   - Integrated push notifications and in-app messaging, boosting retention by 30%.

4. Wipadika Innovations | Bengaluru, India
   Role: Software Engineer (May 2021 - March 2022)
   Tech Stack: JavaScript, React.js, React Native, Redux, React Query, TypeScript, HTML5/CSS3, Sentry, Firebase.
   - Built dynamic React web applications and managed state with Redux and Context API.
   - Optimized data fetching with React Query, reducing server load by 35%.
   - Built reusable TypeScript components, reducing bugs by 40%.
   - Improved page load speeds by 30% using Chrome DevTools and Lighthouse.

5. Caritor Solutions | Bengaluru, India
   Role: Project Executive (September 2018 - January 2020)
   Tech Stack: Python, Pandas, NumPy, Flask, Plotly, Matplotlib, Seaborn.
   - Data cleaning, preprocessing, and exploratory data analysis using Pandas and NumPy.
   - Built interactive dashboards and lightweight Flask web applications for business analytics.

CERTIFICATIONS & EDUCATION:
- AWS Solutions Architect — Udemy (Cloud architecture, EC2, S3, Lambda, RDS, security, governance).
- Machine Learning Intern — KPMG (Python, predictive models, data preprocessing).
- Data Science Intern — ExcelR (Machine learning models, statistical methods).
- Bachelor of Engineering (B.E.) in Electrical & Electronics Engineering — Acharya Institute of Technology, Bengaluru (August 2018).

LANGUAGES:
- English: Proficient (C2)
- Kannada: Proficient (C2)
- Telugu: Intermediate (B1)
- Hindi: Intermediate (B1)
- Tamil: Beginner (A1)
"""

def get_ai_client_and_model():
    api_key = os.environ.get("OPENROUTER_API_KEY") or os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None, None

    # Detect OpenRouter key
    if api_key.startswith("sk-or-") or os.environ.get("OPENROUTER_API_KEY"):
        model_name = os.environ.get("MODEL_NAME", "liquid/lfm-2.5-2.6b:free")
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=api_key,
            default_headers={
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "ABHISHEK-OS Digital Twin",
            },
        )
        return client, model_name

    # Standard OpenAI
    model_name = os.environ.get("MODEL_NAME", "gpt-4o-mini")
    return OpenAI(api_key=api_key), model_name

# Digital Twin Persona Knowledge & AI Logic

SYSTEM_PROMPT = f"""
# Your role

You are an AI Digital Twin of Abhishek J N, running on his portfolio website.
You speak in the FIRST PERSON ("I", "my", "me") as Abhishek J N.
You answer questions strictly and accurately based on Abhishek's resume, projects, skills, career history, certifications, and technical experience.

# Complete Knowledge Base (From resume.pdf)

{STRUCTURED_RESUME_KNOWLEDGE}

# Full Cleaned Text from resume.pdf

{RESUME}

# CRITICAL RULES (MUST FOLLOW STRICTLY)

1. Identity & Scope:
- Speak as Abhishek J N in the first person ("I am a Full Stack Software Engineer...", "In my GT-Connect project at Deloitte...").
- You have complete knowledge of everything in Abhishek's resume (Deloitte Eli Lilly projects CSA-Launchpad & GT-Connect, Turtil, Lobb Logistics, Wipadika Innovations, Caritor Solutions, AWS services, React, Node, Python, metrics, certifications, education, languages).
- Be technical, confident, precise, and friendly.

2. OFF-TOPIC / UNKNOWN QUESTION RULE (STRICT OVERRIDE):
If the user asks about ANYTHING outside of Abhishek's professional career, resume, background, skills, projects, certifications, and work experience (such as hobbies, sports like cricket, personal life, unrelated trivia, or anything NOT documented in his resume), your ONLY response MUST be EXACTLY:
Bananas!!

3. Accuracy: Never hallucinate details not mentioned in the context.

4. EMAIL RECORDING: If the user provides an email address or wants to leave their contact email, invoke the `record_email_tool` function to record their email address.
"""

def agent_tools(email):
    print("THE EMAIL IS ::::::::" + str(email))
    return f"Email ({email}) recorded successfully."

record_email_tool_json = {
    "name": "record_email_tool",
    "description": "Use this tool to record that a user provided their email address",
    "parameters": {
        "type": "object",
        "properties": {
            "email": {"type": "string", "description": "The email address of this user"}
        },
        "required": ["email"],
    }
}


record_phone_tool_json = {
    "name": "record_phone_tool",
    "description": "Use this tool to record that a user provided their phone number",
    "parameters": {
        "type": "object",
        "properties": {
            "phone": {"type": "string", "description": "The phone number of this user"}
        },
        "required": ["phone"],
    }
}

tools = [{"type": "function", "function": record_email_tool_json}, {"type": "function", "function": record_phone_tool_json}]


def digital_twin_agent(message, history):
    """
    Real AI agent logic — calls OpenAI or OpenRouter Chat Completions API.
    `history` is a list of {"role": ..., "content": ...} dicts (Gradio's
    default format for gr.ChatInterface).
    """
    client, model_name = get_ai_client_and_model()
    if not client:
        return "⚠️ API key is not set. Please set OPENAI_API_KEY or OPENROUTER_API_KEY in backend/.env."

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Carry forward prior turns so the model has conversational context
    for turn in history:
        messages.append({"role": turn["role"], "content": turn["content"]})

    messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=messages,
            tools=tools,
            temperature=0.7,
            max_tokens=500,
        )

        assistant_msg = response.choices[0].message

        # Check if the AI model invoked any tool calls
        if hasattr(assistant_msg, "tool_calls") and assistant_msg.tool_calls:
            # 1. Append the assistant message with tool_calls to conversation history
            messages.append(assistant_msg)

            tool_outputs = []
            # 2. Process each requested tool call
            for tool_call in assistant_msg.tool_calls:
                func_name = tool_call.function.name
                if func_name == "record_email_tool":
                    try:
                        args = json.loads(tool_call.function.arguments)
                        email = args.get("email", "")
                    except Exception:
                        email = tool_call.function.arguments

                    result = agent_tools(email)
                    tool_outputs.append(result)

                    # Append tool response message
                    messages.append({
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "content": str(result),
                    })

            # 3. Call OpenAI again so the model generates a final user-facing text response
            second_response = client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.7,
                max_tokens=500,
            )
            final_content = second_response.choices[0].message.content
            if final_content:
                return final_content
            elif tool_outputs:
                return f"✅ {tool_outputs[0]}"
            else:
                return "✅ Email recorded successfully!"

        return assistant_msg.content or "Bananas!!"

    except Exception as e:
        error_str = str(e)
        if "insufficient_quota" in error_str or "429" in error_str:
            return (
                "⚠️ **OpenAI Billing Quota Exceeded (429 Insufficient Quota)**\n\n"
                "Even on newly created API keys, OpenAI requires adding prepaid billing credits "
                "(minimum $5) to your Developer Account before API requests are allowed.\n\n"
                "👉 Add credits here: https://platform.openai.com/settings/organization/billing/overview\n"
                "*(Note: OpenAI API credits are separate from ChatGPT Plus subscriptions)*"
            )
        return f"⚠️ Error talking to OpenAI API: {e}"



demo = gr.ChatInterface(
    fn=digital_twin_agent,
    title=f"⚡ {PERSONA_SHORT.upper()}-OS AI Digital Twin (Live OpenAI Backend)",
    description=f"AI Assistant representing {PERSONA_NAME} ({PERSONA_ROLE}).",
    examples=PROFILE.get("sampleQuestions", [
        "What is your full stack experience?",
        "What AWS services and frontend frameworks do you use?",
        "Can I leave my email to get in touch?"
    ]),
)

app = demo.app

if __name__ == "__main__":
    if not os.environ.get("OPENAI_API_KEY"):
        print("⚠️  WARNING: OPENAI_API_KEY is not set. Set it before running, e.g.")
        print('   export OPENAI_API_KEY="sk-..."')
    server_name = os.environ.get("GRADIO_SERVER_NAME", "127.0.0.1")
    server_port = int(os.environ.get("GRADIO_SERVER_PORT", 7860))
    print(f"🚀 Starting Gradio server on http://{server_name}:{server_port} ...")
    demo.launch(server_name=server_name, server_port=server_port, show_error=True)