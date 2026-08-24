# ABHISHEK-OS — Full Stack Portfolio & AI Digital Twin

An interactive, Ubuntu 24.04 LTS desktop portfolio and AI Digital Twin for **Abhishek J N** (Full Stack Software Engineer at Big4). 

Features a full GNOME/Ubuntu desktop environment (top bar, dock, activities overview, systemd-style boot sequence, live build & cloud alert stream) combined with a real Python + OpenAI AI assistant trained on his resume.

---

## ⚡ 1-Step Customization (`profile.json`)

All personal details, UI windows, system boot logs, contact links, and AI persona knowledge are centralized in **`profile.json`** at the root of the repository.

To adapt this portfolio for yourself or another engineer:
1. Open **`profile.json`** and update your name, role, email, LinkedIn, avatar, bio, and experience logs.
2. Replace **`backend/twin/resume.pdf`** with your own resume PDF.
3. Both the **React desktop frontend** and **Python AI backend** will automatically update instantly!

---

## ⚡ Key Features

- **Centralized Config (`profile.json`)**: One single file controls all desktop windows, login credentials, and AI assistant metadata.
- **Ubuntu 24.04 Desktop UI**: Dynamic desktop wallpaper, draggable/resizable window system, GNOME top bar, side dock, and systemd journalctl boot sequence.
- **AI Digital Twin (`digital_twin.py`)**: Real AI agent embedded in a desktop terminal window.
  - Automatically reads and parses `backend/twin/resume.pdf` on startup.
  - Answers questions about React.js, Node.js, Python (Flask/FastAPI), AWS serverless architecture (Lambda, API Gateway, S3, Glue, Textract, SAM), and AI integrations (OpenAI / ChatGPT API).
  - Supports function calling / tools (`record_email_tool`, `record_phone_tool`) to capture contact details.
  - Enforces strict persona bounds (returns `"Bananas!!"` for off-topic/non-professional queries).
- **Live System Feed (`build-pipeline.service`)**: Real-time cloud deployment & build pipeline stream simulation.

---

## 📁 Repository Structure

```text
ubuntu-portfolio/
├── profile.json            # 🌟 CENTRAL CONFIG (Edit this file to customize!)
├── backend/
│   ├── app.py              # Python Gradio backend (loads profile.json & OpenAI API)
│   ├── requirements.txt    # Python dependencies (gradio, openai, pypdf, etc.)
│   ├── twin/
│   │   └── resume.pdf      # Knowledge base PDF extracted on server startup
│   └── .env                # Local environment variables (OPENAI_API_KEY)
├── src/
│   ├── App.jsx             # Main Ubuntu desktop UI component (loads profile.json)
│   ├── components/
│   │   └── GradioChatWindow.jsx # Embedded Gradio chat iframe component
│   └── twin/
│       └── digital_twin.py # Gradio interface configuration
├── public/                 # Static assets & PDF fallback
├── index.html              # HTML entry point
├── package.json            # Node scripts (concurrently runs React & Python)
└── vite.config.js          # Vite build configuration
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+

### 2. Environment Setup
Create a `.env` file inside the `backend/` directory with your OpenAI or OpenRouter API key:

```ini
# backend/.env
OPENAI_API_KEY=sk-proj-...
# OR
# OPENROUTER_API_KEY=sk-or-v1-...
```

### 3. Install Dependencies & Run

```bash
# Install Node dependencies
npm install

# Setup Python virtual environment & install requirements
python3 -m venv backend/venv
backend/venv/bin/pip install -r backend/requirements.txt

# Start both React frontend and Python backend concurrently
npm run dev
```

- **Frontend**: Open `http://localhost:5173`
- **Gradio Backend**: Running at `http://127.0.0.1:7860`

---

## 🌐 Free Deployment Guide

### 1. Backend (Render.com — 100% Free)
1. Push your repository to **GitHub**.
2. Sign in to **[Render.com](https://render.com)** → Click **New +** → **Web Service**.
3. Select your repository and configure:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: **Free**
4. Add **Environment Variables** in Render:
   - `OPENAI_API_KEY` = `sk-proj-...`
   - `GRADIO_SERVER_NAME` = `0.0.0.0`
   - `GRADIO_SERVER_PORT` = `10000`
5. Render will generate your live backend URL (e.g. `https://abhishek-digital-twin-backend.onrender.com`).

### 2. Frontend (Vercel / Netlify — 100% Free)
1. Import your GitHub repository into **Vercel** or **Netlify**.
2. Add an **Environment Variable**:
   - `VITE_GRADIO_URL` = `https://abhishek-digital-twin-backend.onrender.com`
3. Click **Deploy**.

---

## 📜 License

MIT License © Abhishek J N
