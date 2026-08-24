import gradio as gr  # type: ignore

SYSTEM_PROMPT = """You are Nisha's Digital Twin — a SOC Analyst (L1) and aspiring Detection Engineer.
Knowledge Base:
- 1.5+ years experience in SIEM monitoring (Microsoft Sentinel)
- Proficient in KQL query language, log analysis, threat hunting
- Studying for Microsoft SC-200 certification
"""

def digital_twin_response(message, history):
    # Process user query against digital twin persona knowledge base
    # (Optional: Connect to API endpoint like Groq, OpenAI, or Hugging Face)
    return f"🤖 [Digital Twin]: Thanks for asking about '{message}'! As Nisha's Digital Twin, I specialize in Sentinel SIEM & KQL threat hunting."

demo = gr.ChatInterface(
    fn=digital_twin_response,
    title="NISHA-OS Digital Twin AI",
    examples=["What is your experience with Sentinel?", "Show me your top KQL hunting rules", "Are you open to remote roles?"]
)

demo.launch()
