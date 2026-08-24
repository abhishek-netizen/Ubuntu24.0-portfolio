import os
import json
import gradio as gr # type: ignore

twin_dir = os.path.dirname(os.path.abspath(__file__))
profile_path = os.path.join(twin_dir, "..", "..", "profile.json")

PROFILE = {}
if os.path.exists(profile_path):
    try:
        with open(profile_path, "r", encoding="utf-8") as f:
            PROFILE = json.load(f)
    except Exception:
        pass

name = PROFILE.get("name", "Abhishek J N")
short_name = PROFILE.get("shortName", "Abhishek")
role = PROFILE.get("role", "Full Stack Software Engineer")
sample_questions = PROFILE.get("sampleQuestions", ["What is your experience?", "Tell me about your tech stack."])

SYSTEM_PROMPT = f"You are {short_name}'s Digital Twin — a {role}."

def digital_twin_response(message, history):
    return f"🤖 [Digital Twin]: Thanks for asking about '{message}'! As {short_name}'s Digital Twin, I represent {name} ({role})."

demo = gr.ChatInterface(
    fn=digital_twin_response,
    title=f"{short_name.upper()}-OS Digital Twin AI",
    examples=sample_questions
)

demo.launch()
