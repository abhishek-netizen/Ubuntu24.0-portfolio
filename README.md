# ABHISHEK-OS — Full Stack Portfolio & AI Digital Twin

An interactive, Ubuntu 24.04 LTS desktop portfolio and AI Digital Twin for **Abhishek J N** (Full Stack Software Engineer at Big4).

Features a full GNOME/Ubuntu desktop environment (top bar, dock, activities overview, systemd-style boot sequence, live build & cloud alert stream) combined with a real Python + OpenAI/OpenRouter AI assistant trained on his resume.

---

## ⚡ 1-Step Customization (`profile.json`)

All personal details, UI windows, system boot logs, contact links, and AI persona knowledge are centralized in **`profile.json`** at the root of the repository.

To adapt this portfolio for yourself:
1. Open **`profile.json`** and update your name, role, email, LinkedIn, avatar, bio, and experience logs.
2. Replace **`backend/twin/resume.pdf`** with your own resume PDF.
3. Both the **React desktop frontend** and **Python AI backend** will automatically update!

---

## ⚡ Key Features

- **Ubuntu 24.04 Desktop UI**: Draggable windows, GNOME top bar, side dock, activities overview, systemd-style boot sequence.
- **AI Digital Twin (`/api/chat`)**: Serverless AI agent embedded in the desktop, trained on your resume PDF.
  - Supports both **OpenAI** (`sk-proj-...`) and **OpenRouter** (`sk-or-v1-...`) API keys.
  - Answers questions about experience, stack, certifications, availability, and contact.
- **Stack Overflow profile popover** and **GitHub profile card** in the GNOME top bar.
- **Interactive Ubuntu Terminal**: Supports `neofetch`, `ls`, `cat`, `open`, `whoami`, `sudo`, and more.
- **Live System Feed**: Real-time cloud deployment & build pipeline stream simulation.

---

## 📁 Repository Structure

```text
ubuntu-portfolio/
├── profile.json            # 🌟 CENTRAL CONFIG (Edit this to customize!)
├── api/
│   └── chat.py             # Vercel Python Serverless Function (AI Digital Twin API)
├── requirements.txt        # Python deps for Vercel runtime (openai, pypdf)
├── backend/
│   ├── app.py              # Local Gradio dev server  
│   ├── requirements.txt    # Full Python deps for local dev
│   ├── twin/
│   │   └── resume.pdf      # Resume PDF (AI knowledge base)
│   └── .env                # Local env vars (OPENAI_API_KEY) — not committed
├── src/
│   ├── App.jsx             # Main Ubuntu desktop UI (all windows, terminal, dock)
│   └── components/
│       └── GradioChatWindow.jsx  # Native React AI chat UI
├── vercel.json             # Vercel deployment config
├── package.json            # Node scripts
└── vite.config.js          # Vite build config
```

---

## 🚀 Local Development

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+

### Setup

```bash
# 1. Install Node dependencies
npm install

# 2. Setup Python virtual environment
python3 -m venv backend/venv
backend/venv/bin/pip install -r backend/requirements.txt

# 3. Create backend/.env with your API key
echo "OPENAI_API_KEY=sk-or-v1-..." > backend/.env

# 4. Start dev server (React only — AI chat calls /api/chat in production)
npm run dev:react
```

Open `http://localhost:5173`

> **Note**: The AI Digital Twin chat (`/api/chat`) runs as a Vercel Serverless Function in production. Locally, the Gradio backend runs separately on port 7860 via `npm run dev`.

---

## 🌐 Free Deployment on Vercel (Single Project)

This project deploys as a **single Vercel project** — the React frontend and Python AI backend are both deployed together from the same GitHub repository.

### Step 1: Connect GitHub Repository to Vercel

1. Go to **[vercel.com/new](https://vercel.com/new)** and click **Import Git Repository**.
2. Select your `Ubuntu24.0-portfolio` GitHub repo.
3. Leave the **Root Directory** as the **repository root** (do not change it to `backend/`).
4. Vercel auto-detects **Vite** as the framework.

### Step 2: Add Environment Variable

In the **Environment Variables** section before deploying, add:

| Key | Value |
|---|---|
| `OPENAI_API_KEY` | `sk-or-v1-...` (OpenRouter) or `sk-proj-...` (OpenAI) |

> Both **OpenRouter** and **OpenAI** keys are supported automatically.

### Step 3: Deploy

Click **Deploy**. Vercel will:
1. Run `npm run build` → generate the React `dist/` output.
2. Register `api/chat.py` as a Python Serverless Function at `/api/chat`.

Your live portfolio will be available at `https://your-project.vercel.app` 🎉

### Step 4: Re-deploy after changes

Any `git push` to `main` triggers an automatic re-deploy on Vercel.

```bash
git add .
git commit -m "your changes"
git push
```

---

## 📜 License

MIT License © Abhishek J N
