import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  User,
  ScrollText,
  SlidersHorizontal,
  ShieldCheck,
  Mail,
  X,
  Minus,
  Square,
  Radio,
  FileDown,
  Download,
  Bot,
  Grid3x3,
  Wifi,
  Volume2,
  BatteryFull,
  Sparkles,
  BookOpen,
  Terminal,
} from "lucide-react";
import GradioChatWindow from "./components/GradioChatWindow";
import profile from "../profile.json";

/* Replace with the real, hosted URL of your resume PDF before publishing. */
const RESUME_URL = profile.resumePdfPath || "/resume.pdf";
const CONTACT_EMAIL = profile.email;
const LINKEDIN_URL = profile.linkedinUrl;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

/* Styled like real systemd verbose boot output (journalctl / dmesg). */
const BOOT_LOG = profile.bootLogs || [
  { s: "ok", text: "Started Load Kernel Modules." },
  { s: "ok", text: `Mounted /home/${profile.shortName.toLowerCase()}.` },
  { s: "ok", text: "Reached target Local File Systems." },
  { s: "ok", text: "Started NetworkManager." },
  { s: "ok", text: "Starting aws-cloud-services.service..." },
  { s: "ok", text: "Started aws-cloud-services.service — Lambda, SAM & API Gateway" },
  { s: "ok", text: "Starting react-frontend.service..." },
  { s: "ok", text: "Started react-frontend.service — Vite & React.js engine online" },
  { s: "ok", text: "Starting openai-twin.service..." },
  { s: "ok", text: "Started openai-twin.service — Gradio AI Assistant active" },
  { s: "run", text: "Checking certifications: AWS Solutions Architect .......... in progress" },
  { s: "ok", text: "Starting build-pipeline.service..." },
  { s: "ok", text: "Started build-pipeline.service." },
  { s: "ok", text: "Reached target Graphical Interface." },
];

const FEED_POOL = [
  { sev: "INFO", text: "AWS Lambda deployed successfully via SAM CLI" },
  { sev: "LOW", text: "CloudWatch log alert resolved — high API throughput" },
  { sev: "MED", text: "AWS Textract OCR pipeline optimization completed" },
  { sev: "INFO", text: "React Query cache invalidated — data refreshed" },
  { sev: "HIGH", text: "S3 Lifecycle policy updated for document cleanup" },
  { sev: "LOW", text: "Azure AD SSO authentication token renewed" },
  { sev: "MED", text: "PostgreSQL query index added — response time -40%" },
  { sev: "INFO", text: "CI/CD deployment pipeline finished in 45s" },
  { sev: "HIGH", text: "OpenAI API rate limit check — optimal latency" },
  { sev: "LOW", text: "Dependabot security patch applied cleanly" },
];

const SEV_COLOR = {
  INFO: "var(--cyan)",
  LOW: "var(--green)",
  MED: "var(--amber)",
  HIGH: "var(--red)",
};

const WINDOW_DEFS = [
  {
    id: "digital_twin",
    label: `Ask ${profile.shortName} (AI)`,
    title: "digital_twin.py — Python AI Assistant",
    icon: Bot,
    w: 560,
    h: 480,
    featured: true,
    hint: "Ask a question, get an instant answer",
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "abhishek@ubuntu-desktop: ~",
    icon: Terminal,
    w: 540,
    h: 380,
    hint: "Interactive GNOME Terminal & CLI",
  },
  {
    id: "about",
    label: "About",
    title: "about.txt — notepad",
    icon: User,
    w: 400,
    h: 270,
    hint: "Who I am, in 20 seconds",
  },
  {
    id: "experience",
    label: "Experience",
    title: "experience.log — tail -f",
    icon: ScrollText,
    w: 480,
    h: 360,
    hint: "What I actually do day to day",
  },
  {
    id: "skills",
    label: "Skills",
    title: "skills.conf — config",
    icon: SlidersHorizontal,
    w: 380,
    h: 320,
    hint: "Tools and technical range",
  },
  {
    id: "cert",
    label: "Certifications",
    title: "certs.sh — running",
    icon: ShieldCheck,
    w: 400,
    h: 250,
    hint: "Credentials and education",
  },
  {
    id: "resume",
    label: "Resume",
    title: "resume.pdf — 1 file",
    icon: FileDown,
    w: 360,
    h: 210,
    hint: "The one-click download",
  },
  {
    id: "contact",
    label: "Contact",
    title: "contact.sh — running",
    icon: Mail,
    w: 380,
    h: 250,
    hint: "Email and LinkedIn",
  },
  {
    id: "medium",
    label: "Medium Posts",
    title: "medium.sh — Recent Articles",
    icon: BookOpen,
    w: 580,
    h: 440,
    featured: true,
    hint: "Checkout my Medium technical articles",
  },
];

/* ------------------------------------------------------------------ */
/*  Window body content                                               */
/* ------------------------------------------------------------------ */

function WindowBody({ id, onOpen }) {
  if (id === "digital_twin") {
    return <GradioChatWindow />;
  }

  if (id === "terminal") {
    return <TerminalApp onOpen={onOpen} />;
  }

  if (id === "about") {
    return (
      <div className="win-prose">
        {(profile.aboutParagraphs || []).map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
        {profile.degree && <p className="win-muted">{profile.degree}</p>}
      </div>
    );
  }

  if (id === "experience") {
    return (
      <pre className="win-log">
{profile.experienceLog}
      </pre>
    );
  }

  if (id === "skills") {
    return (
      <pre className="win-log">
{profile.skillsConf}
      </pre>
    );
  }

  if (id === "cert") {
    return (
      <pre className="win-log">
{profile.certificationsSh}
      </pre>
    );
  }

  if (id === "contact") {
    return (
      <div className="win-prose">
        <p className="win-muted" style={{ marginBottom: 10 }}>
          $ cat contact.sh
        </p>
        <p>
          <span className="win-key">email</span>{" "}
          <a className="win-link" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
        {profile.githubUrl && (
          <p>
            <span className="win-key">github</span>{" "}
            <a className="win-link" href={profile.githubUrl} target="_blank" rel="noreferrer">
              {profile.githubUrl.replace("https://", "")}
            </a>
          </p>
        )}
        <p>
          <span className="win-key">linkedin</span>{" "}
          <a
            className="win-link"
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
          >
            {LINKEDIN_URL.replace("https://", "")}
          </a>
        </p>
        {profile.twitterUrl && (
          <p>
            <span className="win-key">twitter (x)</span>{" "}
            <a
              className="win-link"
              href={profile.twitterUrl}
              target="_blank"
              rel="noreferrer"
            >
              {profile.twitterUrl.replace("https://", "")}
            </a>
          </p>
        )}
        {profile.stackoverflowUrl && (
          <p>
            <span className="win-key">stackoverflow</span>{" "}
            <a
              className="win-link"
              href={profile.stackoverflowUrl}
              target="_blank"
              rel="noreferrer"
            >
              {profile.stackoverflowUrl.replace("https://", "")}
            </a>
          </p>
        )}
        {profile.mediumUrl && (
          <p>
            <span className="win-key">medium</span>{" "}
            <a
              className="win-link"
              href={profile.mediumUrl}
              target="_blank"
              rel="noreferrer"
            >
              {profile.mediumUrl.replace("https://", "")}
            </a>
          </p>
        )}
        {profile.location && (
          <p className="win-muted" style={{ marginTop: 10, fontSize: 12 }}>
            Location: {profile.location}
          </p>
        )}
      </div>
    );
  }

  if (id === "resume") {
    return (
      <div className="resume-card">
        <div className="resume-file">
          <FileDown size={22} />
          <div>
            <div className="resume-name">resume.pdf</div>
            <div className="win-muted" style={{ fontSize: 11 }}>
              {profile.role} — {profile.name}
            </div>
          </div>
        </div>
        <a
          className="resume-btn"
          href={RESUME_URL}
          download
          target="_blank"
          rel="noreferrer"
        >
          <Download size={14} />
          download resume
        </a>
      </div>
    );
  }

  if (id === "medium") {
    const articles = profile.mediumArticles || [
      { id: 0, title: "Recent Medium Article #1", badgeUrl: `https://github-readme-medium-recent-article.vercel.app/medium/${profile.mediumUsername || "@abhishwithu"}/0` },
      { id: 1, title: "Recent Medium Article #2", badgeUrl: `https://github-readme-medium-recent-article.vercel.app/medium/${profile.mediumUsername || "@abhishwithu"}/1` },
      { id: 2, title: "Recent Medium Article #3", badgeUrl: `https://github-readme-medium-recent-article.vercel.app/medium/${profile.mediumUsername || "@abhishwithu"}/2` },
    ];
    return (
      <div className="win-prose" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: "16px", color: "var(--ubuntu-orange)" }}>Checkout My Medium Posts</h3>
          {profile.mediumUrl && (
            <a
              href={profile.mediumUrl}
              target="_blank"
              rel="noreferrer"
              className="win-link"
              style={{ fontSize: "13px" }}
            >
              Follow on Medium ({profile.mediumUsername || "@abhishwithu"}) →
            </a>
          )}
        </div>
        <p className="win-muted" style={{ margin: 0, fontSize: "13px" }}>
          Read my latest technical articles and software engineering deep dives:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
          {articles.map((art, idx) => (
            <a
              key={idx}
              href={art.url || profile.mediumUrl || `https://medium.com/${profile.mediumUsername || "@abhishwithu"}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", backgroundColor: "rgba(0,0,0,0.2)" }}
            >
              <img
                src={art.badgeUrl || `https://github-readme-medium-recent-article.vercel.app/medium/${profile.mediumUsername || "@abhishwithu"}/${art.id}`}
                alt={art.title || `Recent Article ${art.id}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </a>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
/* ------------------------------------------------------------------ */
/*  Interactive Ubuntu Terminal Component                             */
/* ------------------------------------------------------------------ */

function TerminalApp({ onOpen }) {
  const [history, setHistory] = useState([
    {
      type: "banner",
      text: (
        <div style={{ color: "#aaa", marginBottom: 10, lineHeight: 1.4 }}>
          <div>Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-40-generic x86_64)</div>
          <br />
          <div> * Documentation:  https://help.ubuntu.com</div>
          <div> * Management:     https://landscape.canonical.com</div>
          <div> * Support:        https://ubuntu.com/pro</div>
          <br />
          <div>Type <span style={{ color: "#4CAF50", fontWeight: "bold" }}>help</span> or <span style={{ color: "#f48225", fontWeight: "bold" }}>neofetch</span> for available commands.</div>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const raw = inputVal.trim();
      const parts = raw.split(" ");
      const cmd = parts[0].toLowerCase();
      const arg = parts.slice(1).join(" ");

      const newHistory = [...history, { type: "input", text: raw }];
      if (raw) setCmdHistory((prev) => [...prev, raw]);
      setHistoryIdx(-1);
      setInputVal("");

      if (!cmd) {
        setHistory(newHistory);
        return;
      }

      let response = null;

      switch (cmd) {
        case "help":
          response = (
            <div style={{ color: "#ddd" }}>
              <div>Available Commands:</div>
              <div style={{ paddingLeft: 12, marginTop: 4 }}>
                <div><b style={{ color: "#f48225" }}>neofetch</b>     - Display Ubuntu system information & ASCII logo</div>
                <div><b style={{ color: "#4CAF50" }}>ls / dir</b>     - List files in current directory</div>
                <div><b style={{ color: "#4CAF50" }}>cat &lt;file&gt;</b>   - View file contents (e.g. cat about.txt, cat skills.conf)</div>
                <div><b style={{ color: "#00BCD4" }}>open &lt;app&gt;</b>   - Open desktop app (e.g. open resume, open contact, open twin)</div>
                <div><b style={{ color: "#aaa" }}>whoami</b>       - Show current logged-in user</div>
                <div><b style={{ color: "#aaa" }}>uname -a</b>     - Display kernel and OS details</div>
                <div><b style={{ color: "#aaa" }}>date</b>         - Output current system timestamp</div>
                <div><b style={{ color: "#aaa" }}>clear / cls</b>  - Clear the terminal screen</div>
                <div><b style={{ color: "#aaa" }}>echo &lt;txt&gt;</b>   - Print text to stdout</div>
                <div><b style={{ color: "#FF5722" }}>sudo &lt;cmd&gt;</b>   - Execute with administrative privileges</div>
              </div>
            </div>
          );
          break;

        case "neofetch":
        case "fastfetch":
          response = (
            <div style={{ display: "flex", gap: 16, marginTop: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <pre style={{ color: "#E95420", margin: 0, fontWeight: "bold", fontSize: 11, lineHeight: 1.2 }}>
{`            .-/+O:-.
        \`.:+++++++=:\`
      .+++=:-\`\`\`\`-:+ bodega
    .=+=:          :++\`
   .+=:            \`++=
   :++              .-
  :=+=             .++-
  --:=:           .+++.
   :++            \`++=
   .+=:            \`++=
    .=+=:          :++\`
      .+++=:-\`\`\`\`-:+
        \`.:+++++++=:\`
            .-/+O:-.`}
              </pre>
              <div style={{ fontSize: 11.5, lineHeight: 1.5, color: "#eee" }}>
                <div><b style={{ color: "#E95420" }}>{profile.shortName.toLowerCase()}</b>@<b>ubuntu-desktop</b></div>
                <div>------------------------</div>
                <div><b>OS:</b> Ubuntu 24.04 LTS x86_64</div>
                <div><b>Host:</b> Digital Twin Engine v2.4</div>
                <div><b>Kernel:</b> 6.8.0-40-generic</div>
                <div><b>Uptime:</b> 7 days, 4 hours</div>
                <div><b>Shell:</b> zsh / bash 5.2.21</div>
                <div><b>Role:</b> {profile.role}</div>
                <div><b>Company:</b> {profile.company}</div>
                <div><b>Memory:</b> 4096MB / 16384MB</div>
              </div>
            </div>
          );
          break;

        case "ls":
        case "dir":
          response = (
            <div style={{ display: "flex", gap: 16, color: "#4CAF50", fontWeight: "bold" }}>
              <span>about.txt</span>
              <span>skills.conf</span>
              <span>experience.log</span>
              <span>certs.sh</span>
              <span>contact.txt</span>
              <span style={{ color: "#2196F3" }}>resume.pdf</span>
              <span style={{ color: "#f48225" }}>digital_twin.py</span>
            </div>
          );
          break;

        case "cat":
          if (!arg) {
            response = <span style={{ color: "#FF5722" }}>cat: missing file operand. Usage: cat &lt;filename&gt;</span>;
          } else if (arg === "about.txt") {
            response = <div style={{ color: "#ddd" }}>{profile.githubBio || profile.role}</div>;
          } else if (arg === "skills.conf") {
            response = (
              <div style={{ color: "#aaa" }}>
                <div>[Frontend] React.js, Next.js, React Native, TypeScript, TailwindCSS</div>
                <div>[Backend] Node.js, Python, SAM CLI, AWS Lambda, REST/GraphQL</div>
                <div>[Database] PostgreSQL, DynamoDB, Redis</div>
              </div>
            );
          } else if (arg === "experience.log") {
            response = (
              <div style={{ color: "#ddd" }}>
                <div>[2021-Present] {profile.role} at {profile.company}</div>
                <div>* Developing enterprise microservices, cloud pipelines & AI Digital Twins.</div>
              </div>
            );
          } else if (arg === "certs.sh") {
            response = <div style={{ color: "#4CAF50" }}>✔ AWS Certified Solutions Architect · AWS Certified Developer</div>;
          } else if (arg === "contact.txt") {
            response = (
              <div style={{ color: "#ddd" }}>
                <div>Email: {profile.email}</div>
                <div>GitHub: {profile.githubUrl}</div>
                <div>LinkedIn: {profile.linkedinUrl}</div>
                <div>Twitter: {profile.twitterUrl}</div>
                <div>Stack Overflow: {profile.stackoverflowUrl}</div>
              </div>
            );
          } else if (arg === "resume.pdf") {
            response = <span style={{ color: "#2196F3" }}>[Binary PDF File] Use command 'open resume' to download.</span>;
          } else if (arg === "digital_twin.py") {
            response = (
              <pre style={{ color: "#f48225", margin: 0, fontSize: 11 }}>
{`import gradio as gr
from openai import OpenAI

client = OpenAI()
print("Digital Twin loaded for ${profile.name}")`}
              </pre>
            );
          } else {
            response = <span style={{ color: "#FF5722" }}>cat: {arg}: No such file or directory</span>;
          }
          break;

        case "whoami":
          response = <span>{profile.shortName.toLowerCase()} ({profile.role} @ {profile.company})</span>;
          break;

        case "uname":
          response = <span>Linux ubuntu-desktop 6.8.0-40-generic #40-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux</span>;
          break;

        case "date":
          response = <span>{new Date().toString()}</span>;
          break;

        case "clear":
        case "cls":
          setHistory([]);
          return;

        case "echo":
          response = <span>{arg}</span>;
          break;

        case "open":
          if (!arg) {
            response = <span style={{ color: "#FF5722" }}>Usage: open &lt;app_name&gt; (e.g. open resume, open contact, open twin)</span>;
          } else {
            const target = arg.toLowerCase().replace(".py", "").replace(".txt", "").replace(".pdf", "");
            if (target === "twin" || target === "digital_twin" || target === "ai") {
              onOpen("digital_twin");
              response = <span style={{ color: "#4CAF50" }}>Launching Digital Twin AI Window...</span>;
            } else if (target === "resume") {
              onOpen("resume");
              response = <span style={{ color: "#4CAF50" }}>Opening Resume Window...</span>;
            } else if (target === "contact") {
              onOpen("contact");
              response = <span style={{ color: "#4CAF50" }}>Opening Contact Window...</span>;
            } else if (target === "about") {
              onOpen("about");
              response = <span style={{ color: "#4CAF50" }}>Opening About Window...</span>;
            } else if (target === "skills") {
              onOpen("skills");
              response = <span style={{ color: "#4CAF50" }}>Opening Skills Window...</span>;
            } else if (target === "experience") {
              onOpen("experience");
              response = <span style={{ color: "#4CAF50" }}>Opening Experience Window...</span>;
            } else {
              response = <span style={{ color: "#FF5722" }}>open: App '{arg}' not found. Try: open resume, open contact, open twin</span>;
            }
          }
          break;

        case "sudo":
          response = (
            <div style={{ color: "#FF5722" }}>
              <div>[sudo] password for {profile.shortName.toLowerCase()}: *******</div>
              <div>Permission denied: {profile.name} controls this desktop environment!</div>
            </div>
          );
          break;

        default:
          response = <span style={{ color: "#FF5722" }}>command not found: {cmd}. Type 'help' for available commands.</span>;
      }

      setHistory([...newHistory, { type: "output", text: response }]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx + 1;
        if (nextIdx < cmdHistory.length) {
          setHistoryIdx(nextIdx);
          setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div
      className="ubuntu-terminal"
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "#1c1921",
        color: "#fff",
        fontFamily: "'Ubuntu Mono', 'Fira Code', monospace",
        fontSize: "12.5px",
        padding: "12px",
        height: "100%",
        boxSizing: "border-box",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {history.map((item, idx) => (
        <div key={idx} style={{ marginBottom: "6px" }}>
          {item.type === "input" ? (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                {profile.shortName.toLowerCase()}@ubuntu-desktop:~$
              </span>
              <span style={{ color: "#fff" }}>{item.text}</span>
            </div>
          ) : (
            item.text
          )}
        </div>
      ))}

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
          {profile.shortName.toLowerCase()}@ubuntu-desktop:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontFamily: "inherit",
            fontSize: "inherit",
            flex: 1,
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}


/* ------------------------------------------------------------------ */
/*  Boot: verbose systemd-style log                                    */
/* ------------------------------------------------------------------ */

function BootLog({ progress, onLine }) {
  const shownCount = Math.min(
    BOOT_LOG.length,
    Math.floor((progress / 100) * BOOT_LOG.length) + 1
  );

  return (
    <div className="boot-log">
      <div className="boot-log-head">Ubuntu 24.04 LTS · {profile.shortName.toLowerCase()}-desktop</div>
      {BOOT_LOG.slice(0, shownCount).map((line, i) => (
        <div className="boot-log-row" key={i}>
          <span className={line.s === "ok" ? "tag-ok" : "tag-run"}>
            {line.s === "ok" ? "[  OK  ]" : "[ .... ]"}
          </span>
          <span>{line.text}</span>
        </div>
      ))}
      <span className="boot-cursor">▌</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Boot: Plymouth-style logo splash                                   */
/* ------------------------------------------------------------------ */

function LogoSplash({ progress }) {
  const filled = Math.round((progress / 100) * 5);
  return (
    <div className="splash">
      <div className="splash-logo" aria-hidden="true">
        <svg viewBox="0 0 100 100" width="72" height="72">
          <circle cx="50" cy="14" r="9" fill="var(--ubuntu-orange)" />
          <circle cx="86" cy="50" r="9" fill="var(--ubuntu-orange)" opacity="0.85" />
          <circle cx="50" cy="86" r="9" fill="var(--ubuntu-orange)" opacity="0.7" />
          <circle cx="14" cy="50" r="9" fill="var(--ubuntu-orange)" opacity="0.55" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="var(--ubuntu-orange)" strokeWidth="4" opacity="0.4" />
        </svg>
      </div>
      <div className="splash-word">ubuntu</div>
      <div className="splash-dots">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < filled ? "sdot on" : "sdot"} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Boot: GDM-style login                                              */
/* ------------------------------------------------------------------ */

function LoginScreen({ onSignIn, clock }) {
  const timeStr = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = clock.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    const go = (e) => {
      if (e.key === "Enter" || e.key === " ") onSignIn();
    };
    window.addEventListener("keydown", go);
    const t = setTimeout(onSignIn, 4000);
    return () => {
      window.removeEventListener("keydown", go);
      clearTimeout(t);
    };
  }, [onSignIn]);

  return (
    <div className="login" onClick={onSignIn}>
      <div className="login-clock">{timeStr}</div>
      <div className="login-date">{dateStr}</div>
      <div className="login-card">
        <div className="login-avatar">{profile.avatarInitial || profile.name[0]}</div>
        <div className="login-name">{profile.name}</div>
        <div className="login-role">{profile.role}</div>
        <button
          className="login-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSignIn();
          }}
        >
          Sign in →
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Boot orchestrator                                                  */
/* ------------------------------------------------------------------ */

function BootSequence({ onDone, reducedMotion, clock }) {
  const [phase, setPhase] = useState(reducedMotion ? "login" : "log");
  const [progress, setProgress] = useState(reducedMotion ? 100 : 0);

  useEffect(() => {
    if (reducedMotion || phase !== "log") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 6, 100);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(() => setPhase("splash"), 250);
        }
        return next;
      });
    }, 110);
    return () => clearInterval(id);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== "splash") return;
    const t = setTimeout(() => setPhase("login"), 1300);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="boot-wrap">
      <button
        className="skip-intro"
        onClick={onDone}
        aria-label="Skip intro and go straight to the portfolio"
      >
        Skip intro →
      </button>

      {phase === "log" && <BootLog progress={progress} />}
      {phase === "splash" && <LogoSplash progress={100} />}
      {phase === "login" && <LoginScreen onSignIn={onDone} clock={clock} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Live feed (signature widget)                                       */
/* ------------------------------------------------------------------ */

function LiveFeed({ reducedMotion }) {
  const [entries, setEntries] = useState(() =>
    FEED_POOL.slice(0, 5).map((e, i) => ({ ...e, id: i, t: fakeTime(i) }))
  );
  const counter = useRef(5);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      const pick = FEED_POOL[Math.floor(Math.random() * FEED_POOL.length)];
      const entry = { ...pick, id: counter.current++, t: fakeTime(counter.current) };
      setEntries((prev) => [entry, ...prev].slice(0, 6));
    }, 3600);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="feed">
      <div className="feed-head">
        <Radio size={12} />
        <span>detection-feed.service</span>
        <span className="feed-live">● live</span>
      </div>
      <div className="feed-body">
        {entries.map((e) => (
          <div className="feed-row" key={e.id}>
            <span className="feed-time">{e.t}</span>
            <span className="feed-sev" style={{ color: SEV_COLOR[e.sev] }}>
              {e.sev.padEnd(4, " ")}
            </span>
            <span className="feed-text">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function fakeTime(seed) {
  const base = 14 * 3600 + 32 * 60 + (seed * 37) % 1800;
  const h = String(Math.floor(base / 3600) % 24).padStart(2, "0");
  const m = String(Math.floor((base % 3600) / 60)).padStart(2, "0");
  const s = String(base % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* ------------------------------------------------------------------ */
/*  Draggable / mobile-safe window                                     */
/* ------------------------------------------------------------------ */

function Win({ def, pos, z, isMobile, onFocus, onMove, onClose, onOpen }) {
  const dragRef = useRef(null);

  const onDown = useCallback(
    (e) => {
      if (isMobile) {
        onFocus();
        return;
      }
      onFocus();
      const startX = e.clientX;
      const startY = e.clientY;
      const origX = pos.x;
      const origY = pos.y;
      dragRef.current = { startX, startY, origX, origY };

      const move = (ev) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        onMove(def.id, dragRef.current.origX + dx, dragRef.current.origY + dy);
      };
      const up = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [def.id, isMobile, onFocus, onMove, pos.x, pos.y]
  );

  const style = isMobile
    ? { zIndex: z }
    : { left: pos.x, top: pos.y, width: def.w, zIndex: z };

  return (
    <div
      className={isMobile ? "win win-mobile" : "win"}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="win-bar" onMouseDown={onDown}>
        <def.icon size={13} className="win-bar-icon" />
        <span className="win-title">{def.title}</span>
        <span className="win-controls">
          <button className="win-ctrl" aria-label="minimize (visual only)" tabIndex={-1}>
            <Minus size={12} />
          </button>
          <button className="win-ctrl" aria-label="maximize (visual only)" tabIndex={-1}>
            <Square size={10} />
          </button>
          <button
            className="win-ctrl win-ctrl-close"
            aria-label={`close ${def.title}`}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onClose(def.id)}
          >
            <X size={13} />
          </button>
        </span>
      </div>
      <div className="win-content" style={isMobile ? undefined : { maxHeight: def.h }}>
        <WindowBody id={def.id} onOpen={onOpen} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Top bar                                                             */
/* ------------------------------------------------------------------ */

function TopBar({ clock, onOpen, onToggleOverview, overviewOpen }) {
  const timeStr = clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [showProfile, setShowProfile] = useState(false);
  const stats = profile.stackoverflowStats || {};
  const hoverTimer = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowProfile(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setShowProfile(false);
    }, 350);
  };

  return (
    <div className="topbar">
      <button
        className={overviewOpen ? "topbar-activities on" : "topbar-activities"}
        onClick={onToggleOverview}
      >
        <Grid3x3 size={13} />
        Activities
      </button>

      <div className="topbar-clock">{timeStr}</div>

      <div className="topbar-right">
        <a
          className="topbar-cta"
          href={RESUME_URL}
          download
          target="_blank"
          rel="noreferrer"
        >
          <Download size={12} />
          Résumé
        </a>
        <button className="topbar-cta topbar-cta-ghost" onClick={() => onOpen("contact")}>
          <Mail size={12} />
          Contact
        </button>
        
        {/* Ubuntu Top-Right Status Tray with Profile Avatar */}
        <div
          className={`topbar-tray ${showProfile ? "active" : ""}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setShowProfile((v) => !v)}
          style={{ position: "relative" }}
        >
          <Wifi size={13} />
          <Volume2 size={13} />
          <BatteryFull size={13} />
          
          {/* Ubuntu User Avatar Profile Icon */}
          <span className="topbar-avatar-icon" title="View Stack Overflow Stats">
            <User size={12} />
          </span>

          {/* Clean Floating Stack Overflow Profile Menu */}
          {showProfile && (
            <div
              className="topbar-profile-dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="so-drop-header">
                <div className="so-drop-avatar">
                  <User size={16} />
                </div>
                <div className="so-drop-user">
                  <div className="so-drop-name">{profile.stackoverflowUsername || "abhiSHH"}</div>
                  <div className="so-drop-role">Stack Overflow Contributor</div>
                </div>
                <div className="so-drop-rep">
                  <span className="rep-num">{stats.reputation || 459}</span>
                  <span className="rep-tag">REP</span>
                </div>
              </div>

              <div className="so-drop-reach">
                <span className="reach-val">{stats.peopleReached || "~635k"}</span>
                <span className="reach-lbl">People Reached</span>
              </div>

              <div className="so-drop-badges">
                <span className="badge-chip silver">7 🥈 Silver</span>
                <span className="badge-chip bronze">9 🥉 Bronze</span>
                <span className="badge-chip days">{stats.visitedDays || 836} Days</span>
              </div>

              <div className="so-drop-answers">
                <div className="ans-hdr">TOP ANSWERS</div>
                {(stats.topAnswers || []).slice(0, 3).map((a, i) => (
                  <div key={i} className="ans-row">
                    <span className="ans-pts">+{a.score}</span>
                    <span className="ans-txt">{a.title}</span>
                  </div>
                ))}
              </div>

              <a
                href={profile.stackoverflowUrl || "https://stackoverflow.com/users/12706366/abhishh"}
                target="_blank"
                rel="noreferrer"
                className="so-drop-link"
              >
                Open Stack Overflow Profile ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dock                                                                */
/* ------------------------------------------------------------------ */

function Dock({ openMap, onOpen, onToggleOverview, overviewOpen }) {
  return (
    <div className="dock">
      {WINDOW_DEFS.filter((d) => d.id !== "digital_twin").map((d) => {
        const Icon = d.icon;
        const isOpen = !!openMap[d.id];
        return (
          <button
            key={d.id}
            className={d.featured ? "dock-btn dock-btn-featured" : "dock-btn"}
            onClick={() => onOpen(d.id)}
            data-tip={d.label}
          >
            <span className="dock-icon">
              <Icon size={20} />
              {d.featured && <Sparkles size={9} className="dock-spark" />}
            </span>
            {isOpen && <span className="dock-active-dot" />}
          </button>
        );
      })}
      <div className="dock-sep" />
      <button
        className={overviewOpen ? "dock-btn dock-grid on" : "dock-btn dock-grid"}
        onClick={onToggleOverview}
        data-tip="Show all"
      >
        <Grid3x3 size={18} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Activities overview (site map)                                     */
/* ------------------------------------------------------------------ */

function Overview({ onOpen, onClose }) {
  return (
    <div className="overview" onClick={onClose}>
      <div className="overview-hint">Click a tile to open it</div>
      <div className="overview-grid" onClick={(e) => e.stopPropagation()}>
        {WINDOW_DEFS.map((d) => {
          const Icon = d.icon;
          return (
            <button
              key={d.id}
              className={d.featured ? "overview-tile featured" : "overview-tile"}
              onClick={() => {
                onOpen(d.id);
                onClose();
              }}
            >
              <Icon size={22} />
              <span className="overview-tile-label">{d.label}</span>
              <span className="overview-tile-hint">{d.hint}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating AI Chatbot Widget (Bottom Right)                          */
/* ------------------------------------------------------------------ */

function FloatingAiWidget({ isOpen, onToggle }) {
  return (
    <div className="floating-ai-wrap">
      {!isOpen && (
        <div className="floating-ai-bubble" onClick={onToggle}>
          <Sparkles size={13} className="sparkle-icon" />
          <span>Ask {profile.shortName} AI...</span>
        </div>
      )}
      <button
        className={`floating-ai-btn ${isOpen ? "open" : ""}`}
        onClick={onToggle}
        aria-label="Toggle AI Assistant"
        title={isOpen ? "Close AI Assistant" : `Ask ${profile.name}'s AI Digital Twin`}
      >
        <span className="pulse-ring" />
        <span className="online-dot" />
        <Bot size={26} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop                                                             */
/* ------------------------------------------------------------------ */

function Desktop({ reducedMotion }) {
  const [open, setOpen] = useState({ about: true });
  const [pos, setPos] = useState({ about: { x: 100, y: 72 } });
  const [z, setZ] = useState({ about: 10 });
  const topZ = useRef(11);
  const [clock, setClock] = useState(() => new Date());
  const cascade = useRef(1);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [showCoach, setShowCoach] = useState(true);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 720 : false
  );

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!showCoach) return;
    const t = setTimeout(() => setShowCoach(false), 6000);
    return () => clearTimeout(t);
  }, [showCoach]);

  const openWindow = (id) => {
    setOverviewOpen(false);
    setShowCoach(false);
    setOpen((o) => {
      if (o[id]) return o;
      const n = cascade.current++;
      setPos((p) => ({
        ...p,
        [id]: { x: 90 + (n % 4) * 34, y: 70 + (n % 4) * 30 },
      }));
      return { ...o, [id]: true };
    });
    topZ.current += 1;
    setZ((zz) => ({ ...zz, [id]: topZ.current }));
  };

  const closeWindow = (id) => setOpen((o) => ({ ...o, [id]: false }));

  const focusWindow = (id) => {
    topZ.current += 1;
    setZ((zz) => ({ ...zz, [id]: topZ.current }));
  };

  const moveWindow = (id, x, y) => setPos((p) => ({ ...p, [id]: { x, y } }));

  const openDefs = useMemo(
    () => WINDOW_DEFS.filter((d) => open[d.id]),
    [open]
  );

  return (
    <div className="desktop">
      <div className="wallpaper" aria-hidden="true">
        <div className="wp-gradient" />
        <div className="wp-ring wp-ring-a" />
        <div className="wp-ring wp-ring-b" />
      </div>

      {/* Centered Desktop Wallpaper GitHub Profile Widget */}
      <div className="wp-github-widget">
        <a
          href={profile.githubUrl || `https://github.com/${profile.githubUsername || "abhishek-netizen"}`}
          target="_blank"
          rel="noreferrer"
          className="wp-github-card"
          title="Open GitHub Profile"
        >
          <div className="wp-gh-user-row">
            <img
              src={profile.githubAvatarUrl || `https://github.com/${profile.githubUsername || "abhishek-netizen"}.png`}
              alt={profile.name}
              className="wp-gh-avatar"
            />
            <div className="wp-gh-identity">
              <div className="wp-gh-name">{profile.shortName.toLowerCase()}_jn</div>
              <div className="wp-gh-handle">@{profile.githubUsername || "abhishek-netizen"}</div>
              <div className="wp-gh-role-tag">{profile.role}</div>
            </div>
          </div>

          <div className="wp-gh-bio">
            "{profile.githubBio || profile.aboutParagraphs[0]}"
          </div>

          <div className="wp-gh-stats-row">
            <div className="wp-gh-stat-item">
              <span className="stat-num">{profile.githubStats?.followers || 23}</span>
              <span className="stat-label">followers</span>
            </div>
            <span className="stat-dot">•</span>
            <div className="wp-gh-stat-item">
              <span className="stat-num">{profile.githubStats?.following || 63}</span>
              <span className="stat-label">following</span>
            </div>
            <span className="stat-dot">•</span>
            <div className="wp-gh-stat-item">
              <span className="stat-num">{profile.githubStats?.repositories || 70}</span>
              <span className="stat-label">repos</span>
            </div>
          </div>

          <div className="wp-gh-stack-grid">
            <span className="stack-badge js">JavaScript</span>
            <span className="stack-badge py">Python</span>
            <span className="stack-badge react">React</span>
            <span className="stack-badge node">Node.js</span>
            <span className="stack-badge aws">AWS</span>
            <span className="stack-badge git">Git</span>
            <span className="stack-badge linux">Linux</span>
          </div>

          <div className="wp-gh-bar">
            <span>github.com/{profile.githubUsername || "abhishek-netizen"} ↗</span>
          </div>
        </a>
      </div>

      <TopBar
        clock={clock}
        onOpen={openWindow}
        overviewOpen={overviewOpen}
        onToggleOverview={() => setOverviewOpen((v) => !v)}
      />

      {!isMobile && (
        <div className="feed-slot">
          <LiveFeed reducedMotion={reducedMotion} />
        </div>
      )}

      {showCoach && (
        <div className="coach" role="status">
          <span>
            👋 New here? Try <strong>Ask Abhishek (AI)</strong> for instant
            answers, or grab the résumé up top.
          </span>
          <button className="coach-close" onClick={() => setShowCoach(false)} aria-label="dismiss">
            <X size={12} />
          </button>
        </div>
      )}

      {openDefs.map((d) => (
        <Win
          key={d.id}
          def={d}
          pos={pos[d.id] || { x: 90, y: 70 }}
          z={z[d.id] || 10}
          isMobile={isMobile}
          onFocus={() => focusWindow(d.id)}
          onMove={moveWindow}
          onClose={closeWindow}
          onOpen={openWindow}
        />
      ))}

      {overviewOpen && (
        <Overview onOpen={openWindow} onClose={() => setOverviewOpen(false)} />
      )}

      <FloatingAiWidget
        isOpen={!!open.digital_twin}
        onToggle={() => {
          if (open.digital_twin) {
            closeWindow("digital_twin");
          } else {
            const winW = isMobile ? window.innerWidth : 560;
            const winH = isMobile ? window.innerHeight : 480;
            const targetX = Math.max(20, window.innerWidth - winW - 30);
            const targetY = Math.max(50, window.innerHeight - winH - 70);
            setPos((p) => ({ ...p, digital_twin: { x: targetX, y: targetY } }));
            openWindow("digital_twin");
          }
        }}
      />

      <Dock
        openMap={open}
        onOpen={openWindow}
        overviewOpen={overviewOpen}
        onToggleOverview={() => setOverviewOpen((v) => !v)}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [booted, setBooted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [clock, setClock] = useState(() => new Date());

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const fn = (e) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", fn);
    return () => mq.removeEventListener?.("change", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="nisha-os">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&family=Ubuntu+Mono:wght@400;700&display=swap');

        .nisha-os {
          --ubuntu-orange: #E95420;
          --ubuntu-orange-light: #F08D6F;
          --aubergine-950: #2C001E;
          --aubergine-800: #4B1543;
          --aubergine-600: #77216F;
          --panel: #262626;
          --panel-alt: #1c1c1c;
          --surface: #2d2d2d;
          --border: rgba(255,255,255,0.09);
          --text: #f2f1f0;
          --dim: #9a9a9a;
          --cyan: #6cc2c9;
          --red: #e2513a;
          --green: #4CAF50;
          --amber: #eab676;
          --font-display: "Ubuntu", ui-sans-serif, system-ui, sans-serif;
          --font-mono: "Ubuntu Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;

          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          background: #000;
          color: var(--text);
          font-family: var(--font-display);
          overflow: hidden;
        }
        .nisha-os *, .nisha-os *::before, .nisha-os *::after { box-sizing: border-box; }
        .nisha-os button { font-family: inherit; cursor: pointer; }
        .nisha-os button:focus-visible,
        .nisha-os a:focus-visible {
          outline: 2px solid var(--ubuntu-orange);
          outline-offset: 2px;
        }

        /* ---------- boot: shared wrap ---------- */
        .boot-wrap {
          position: absolute; inset: 0;
          background: #0b0b0d;
          display: flex; align-items: center; justify-content: center;
        }
        .skip-intro {
          position: absolute; top: 16px; right: 18px; z-index: 20;
          background: rgba(255,255,255,0.06); border: 1px solid var(--border);
          color: var(--text); font-size: 12px; padding: 7px 12px;
          border-radius: 999px; letter-spacing: 0.02em;
        }
        .skip-intro:hover { background: rgba(255,255,255,0.12); }

        /* ---------- boot: verbose log ---------- */
        .boot-log {
          position: absolute; inset: 0;
          background: #0b0b0d;
          padding: 8vh 7vw;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.9;
          color: #d7d7d7;
          overflow: hidden;
        }
        .boot-log-head {
          color: var(--dim);
          margin-bottom: 10px;
          font-size: 12px;
        }
        .boot-log-row { display: flex; gap: 10px; }
        .tag-ok { color: var(--green); font-weight: 700; flex: none; }
        .tag-run { color: var(--amber); font-weight: 700; flex: none; }
        .boot-cursor {
          display: inline-block; margin-top: 4px;
          color: var(--dim);
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } }

        /* ---------- boot: plymouth splash ---------- */
        .splash {
          display: flex; flex-direction: column; align-items: center; gap: 18px;
          animation: fadein 0.4s ease;
        }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .splash-logo { animation: pulse 1.4s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }
        .splash-word {
          font-family: var(--font-display); font-weight: 300; letter-spacing: 0.08em;
          font-size: 20px; color: #f2f1f0; text-transform: lowercase;
        }
        .splash-dots { display: flex; gap: 8px; }
        .sdot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: background 0.2s; }
        .sdot.on { background: var(--ubuntu-orange); }

        /* ---------- boot: login (GDM-style) ---------- */
        .login {
          position: absolute; inset: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; cursor: pointer;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(233,84,32,0.18), transparent 55%),
            linear-gradient(160deg, var(--aubergine-950) 0%, var(--aubergine-800) 55%, var(--aubergine-600) 100%);
        }
        .login-clock { font-size: 15vw; font-weight: 300; line-height: 1; color: #fff; letter-spacing: -0.02em; }
        .login-date { color: rgba(255,255,255,0.75); font-size: 14px; margin-bottom: 28px; }
        .login-card { display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .login-avatar {
          width: 64px; height: 64px; border-radius: 50%;
          background: var(--ubuntu-orange); color: #1a0a06;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 700; margin-bottom: 8px;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.15);
        }
        .login-name { font-size: 16px; font-weight: 500; color: #fff; }
        .login-role { font-size: 12px; color: rgba(255,255,255,0.65); margin-bottom: 14px; }
        .login-btn {
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
          color: #fff; font-size: 13px; padding: 8px 18px; border-radius: 999px;
        }
        .login-btn:hover { background: var(--ubuntu-orange); border-color: var(--ubuntu-orange); }

        /* ---------- desktop ---------- */
        .desktop { position: absolute; inset: 0; overflow: hidden; }
        .wallpaper { position: absolute; inset: 0; overflow: hidden; z-index: 0; }
        .wp-gradient {
          position: absolute; inset: 0;
          background: linear-gradient(150deg, var(--aubergine-950) 0%, var(--aubergine-800) 48%, var(--aubergine-600) 78%, var(--ubuntu-orange) 130%);
        }
        .wp-ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .wp-ring-a { width: 60vw; height: 60vw; right: -18vw; top: -20vw; }
        .wp-ring-b { width: 34vw; height: 34vw; left: -8vw; bottom: -10vw; border-color: rgba(233,84,32,0.12); }

        /* ---------- wallpaper developer credibility widgets ---------- */
        .wp-cards-widget {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: auto;
          display: flex;
          gap: 24px;
          align-items: center;
          justify-content: center;
          max-width: 95vw;
        }
        @media (max-width: 980px) {
          .wp-cards-widget { flex-direction: column; gap: 16px; top: 52%; }
          .wp-so-card { display: none; }
        }
        .wp-github-card, .wp-so-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          background: rgba(13, 17, 23, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(233, 84, 32, 0.35);
          border-radius: 18px;
          padding: 20px 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(233, 84, 32, 0.2);
          text-decoration: none;
          color: var(--text);
          width: 400px;
          max-width: 90vw;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .wp-github-card:hover {
          transform: translateY(-4px);
          border-color: var(--ubuntu-orange);
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(233, 84, 32, 0.3);
        }
        .wp-so-card {
          border-color: rgba(244, 130, 37, 0.4);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(244, 130, 37, 0.15);
        }
        .wp-so-card:hover {
          transform: translateY(-4px);
          border-color: #f48225;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(244, 130, 37, 0.3);
        }

        .wp-gh-user-row, .wp-so-user-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .wp-so-icon-badge {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          background: rgba(244, 130, 37, 0.15);
          border: 1px solid rgba(244, 130, 37, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wp-so-identity {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }
        .wp-so-name {
          font-weight: 700;
          font-size: 18px;
          color: #fff;
        }
        .wp-so-role {
          font-size: 11.5px;
          color: #f48225;
        }
        .wp-so-rep-tag {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(244, 130, 37, 0.15);
          border: 1px solid rgba(244, 130, 37, 0.3);
          padding: 4px 10px;
          border-radius: 8px;
        }
        .wp-so-rep-tag .rep-num {
          font-weight: 800;
          font-size: 16px;
          color: #f48225;
          line-height: 1.1;
        }
        .wp-so-rep-tag .rep-lbl {
          font-size: 9px;
          color: var(--dim);
          letter-spacing: 0.5px;
        }

        /* ---------- wallpaper github widget ---------- */
        .wp-github-widget {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: auto;
          opacity: 0.88;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .wp-github-widget:hover {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1.03);
        }
        .wp-github-card {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          background: rgba(13, 17, 23, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(233, 84, 32, 0.35);
          border-radius: 18px;
          padding: 20px 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(233, 84, 32, 0.2);
          text-decoration: none;
          color: var(--text);
          width: 440px;
          max-width: 90vw;
        }

        .wp-gh-bar {
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--dim);
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .wp-gh-user-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .wp-gh-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 2px solid var(--ubuntu-orange);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          object-fit: cover;
        }
        .wp-gh-identity {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .wp-gh-name {
          font-weight: 700;
          font-size: 18px;
          color: #f0f6fc;
          letter-spacing: -0.2px;
        }
        .wp-gh-handle {
          font-family: var(--font-mono);
          font-size: 13px;
          color: #8b949e;
        }
        .wp-gh-role-tag {
          font-size: 11px;
          color: var(--ubuntu-orange-light);
          margin-top: 2px;
        }
        .wp-gh-bio {
          font-size: 12.5px;
          line-height: 1.45;
          color: #c9d1d9;
          margin-top: 14px;
          font-style: italic;
          background: rgba(255, 255, 255, 0.04);
          padding: 8px 12px;
          border-radius: 8px;
          border-left: 3px solid var(--ubuntu-orange);
        }
        .wp-gh-stats-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          font-size: 12.5px;
          color: #8b949e;
        }
        .wp-gh-stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .wp-gh-stat-item .stat-num {
          font-weight: 700;
          color: #f0f6fc;
        }
        .stat-dot {
          color: rgba(255, 255, 255, 0.2);
        }
        .wp-gh-stack-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 14px;
        }
        .stack-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #e6edf3;
        }
        .stack-badge.js { border-color: rgba(247, 223, 30, 0.4); color: #f7df1e; }
        .stack-badge.py { border-color: rgba(55, 118, 171, 0.5); color: #4b8bbe; }
        .stack-badge.react { border-color: rgba(97, 218, 251, 0.4); color: #61dafb; }
        .stack-badge.node { border-color: rgba(104, 160, 99, 0.4); color: #68a063; }
        .stack-badge.aws { border-color: rgba(255, 153, 0, 0.4); color: #ff9900; }
        .stack-badge.git { border-color: rgba(240, 80, 50, 0.4); color: #f05032; }
        .stack-badge.linux { border-color: rgba(233, 84, 32, 0.4); color: var(--ubuntu-orange-light); }
        .wp-github-bar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          margin-top: 14px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ubuntu-orange-light);
          letter-spacing: 0.5px;
        }

        /* ---------- floating bottom-right ai chatbot widget ---------- */
        .floating-ai-wrap {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 99;
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: auto;
        }
        .floating-ai-bubble {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(28, 24, 30, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(233, 84, 32, 0.4);
          color: var(--text);
          font-size: 13px;
          font-weight: 500;
          padding: 8px 14px;
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 20px rgba(233,84,32,0.15);
          cursor: pointer;
          animation: floatBubble 3s ease-in-out infinite;
          user-select: none;
        }
        .floating-ai-bubble .sparkle-icon {
          color: var(--ubuntu-orange-light);
        }
        .floating-ai-bubble:hover {
          background: rgba(45, 35, 48, 0.95);
          transform: translateY(-2px);
        }
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .floating-ai-btn {
          position: relative;
          width: 58px;
          height: 58px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--ubuntu-orange) 0%, var(--aubergine-800) 100%);
          border: 2px solid rgba(255, 255, 255, 0.25);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(233, 84, 32, 0.4), 0 4px 12px rgba(0,0,0,0.5);
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
        }
        .floating-ai-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 14px 36px rgba(233, 84, 32, 0.6), 0 6px 16px rgba(0,0,0,0.6);
        }
        .floating-ai-btn.open {
          background: var(--aubergine-950);
          border-color: var(--ubuntu-orange);
        }
        .pulse-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid var(--ubuntu-orange);
          opacity: 0;
          animation: pulseRing 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          pointer-events: none;
        }
        @keyframes pulseRing {
          0% { transform: scale(0.85); opacity: 0.8; }
          60%, 100% { transform: scale(1.35); opacity: 0; }
        }
        .online-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          background: #4CAF50;
          border: 2px solid #1c1c1c;
          box-shadow: 0 0 8px #4CAF50;
        }
        @media (max-width: 720px) {
          .wp-github-widget {
            display: none;
          }
        }

        /* ---------- top bar ---------- */
        .topbar {
          position: absolute; top: 0; left: 0; right: 0; height: 34px;
          background: rgba(20,18,20,0.55); backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; z-index: 60;
          font-size: 12.5px; padding: 0 10px;
        }
        .topbar-activities {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: none; color: var(--text);
          padding: 5px 9px; border-radius: 6px;
        }
        .topbar-activities:hover, .topbar-activities.on { background: rgba(255,255,255,0.1); }
        .topbar-clock {
          position: absolute; left: 50%; transform: translateX(-50%);
          font-weight: 500; letter-spacing: 0.02em;
        }
        .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 8px; }
        .topbar-cta {
          display: flex; align-items: center; gap: 5px;
          background: var(--ubuntu-orange); color: #fff; border: none;
          font-size: 11.5px; font-weight: 500; padding: 5px 10px; border-radius: 999px;
          text-decoration: none;
        }
        .topbar-cta:hover { background: var(--ubuntu-orange-light); }
        .topbar-cta-ghost { background: rgba(255,255,255,0.1); color: var(--text); }
        .topbar-cta-ghost:hover { background: rgba(255,255,255,0.18); }
        .topbar-tray {
          display: flex;
          align-items: center;
          gap: 7px;
          color: var(--dim);
          margin-left: 4px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid transparent;
          cursor: pointer;
          position: relative;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .topbar-tray:hover, .topbar-tray.active {
          background: rgba(233, 84, 32, 0.18);
          border-color: rgba(233, 84, 32, 0.4);
          color: #fff;
        }
        .topbar-avatar-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(233, 84, 32, 0.25);
          color: var(--ubuntu-orange-light);
          margin-left: 2px;
          border: 1px solid rgba(233, 84, 32, 0.4);
        }

        /* ---------- topbar stack overflow profile dropdown ---------- */
        .topbar-profile-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 320px;
          background: #1c1921;
          border: 1px solid rgba(233, 84, 32, 0.4);
          border-radius: 12px;
          padding: 14px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
          z-index: 9999;
          color: #fff;
          font-family: var(--font-display);
          cursor: default;
          text-align: left;
        }
        .so-drop-header {
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 10px;
        }
        .so-drop-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--ubuntu-orange);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
        }
        .so-drop-user {
          flex: 1;
        }
        .so-drop-name {
          font-weight: 700;
          font-size: 14px;
          line-height: 1.2;
        }
        .so-drop-role {
          font-size: 10.5px;
          color: var(--dim);
        }
        .so-drop-rep {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(244, 130, 37, 0.15);
          padding: 3px 8px;
          border-radius: 6px;
        }
        .so-drop-rep .rep-num {
          font-weight: 800;
          color: #f48225;
          font-size: 15px;
          line-height: 1;
        }
        .so-drop-rep .rep-tag {
          font-size: 8px;
          color: var(--dim);
        }
        .so-drop-reach {
          margin-top: 10px;
          background: rgba(255, 255, 255, 0.04);
          border-left: 3px solid #f48225;
          padding: 6px 10px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .so-drop-reach .reach-val {
          font-weight: 700;
          font-size: 14px;
          color: #fff;
        }
        .so-drop-reach .reach-lbl {
          font-size: 10px;
          color: var(--dim);
        }
        .so-drop-badges {
          display: flex;
          gap: 6px;
          margin-top: 10px;
          font-size: 10.5px;
        }
        .badge-chip {
          padding: 2px 7px;
          border-radius: 4px;
          font-weight: 600;
        }
        .badge-chip.silver { background: rgba(186, 196, 203, 0.15); color: #bac4cb; }
        .badge-chip.bronze { background: rgba(214, 161, 126, 0.15); color: #d6a17e; }
        .badge-chip.days { background: rgba(255, 255, 255, 0.08); color: var(--dim); }
        .so-drop-answers {
          margin-top: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .so-drop-answers .ans-hdr {
          font-size: 9px;
          font-weight: 700;
          color: #f48225;
          letter-spacing: 0.5px;
        }
        .ans-row {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.25);
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }
        .ans-pts {
          color: #4CAF50;
          font-weight: 700;
        }
        .ans-txt {
          color: #ddd;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .so-drop-link {
          display: block;
          text-align: center;
          background: #f48225;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          margin-top: 10px;
          transition: background 0.2s ease;
        }
        .so-drop-link:hover {
          background: #e67316;
        }
          max-width: 90vw;
          background: rgba(18, 16, 20, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(244, 130, 37, 0.45);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(244, 130, 37, 0.25);
          z-index: 9999;
          text-align: left;
          cursor: default;
          animation: popoverSlide 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes popoverSlide {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .so-popover-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .so-popover-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .so-popover-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(244, 130, 37, 0.15);
          border: 1px solid rgba(244, 130, 37, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .so-popover-name {
          font-weight: 700;
          font-size: 15px;
          color: #fff;
        }
        .so-popover-sub {
          font-size: 11px;
          color: #f48225;
        }
        .so-popover-rep {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          background: rgba(244, 130, 37, 0.15);
          border: 1px solid rgba(244, 130, 37, 0.3);
          padding: 4px 10px;
          border-radius: 8px;
        }
        .so-popover-rep .rep-val {
          font-size: 16px;
          font-weight: 800;
          color: #f48225;
          line-height: 1;
        }
        .so-popover-rep .rep-lbl {
          font-size: 8.5px;
          color: var(--dim);
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        .so-popover-impact {
          margin-top: 12px;
          background: rgba(255, 255, 255, 0.04);
          border-left: 3px solid #f48225;
          padding: 8px 12px;
          border-radius: 6px;
        }
        .so-popover-impact .impact-bold {
          font-size: 17px;
          font-weight: 800;
          color: #fff;
        }
        .so-popover-impact .impact-sub {
          font-size: 9px;
          color: var(--dim);
          letter-spacing: 0.5px;
          margin-top: 1px;
        }

        .so-popover-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          font-size: 11px;
        }
        .so-popover-answers {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .so-popover-answers .ans-label {
          font-size: 9px;
          font-weight: 700;
          color: #f48225;
          letter-spacing: 0.5px;
        }
        .so-popover-ans-item {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 6px 10px;
          border-radius: 6px;
          text-decoration: none;
          transition: border-color 0.2s;
        }
        .so-popover-ans-item:hover {
          border-color: #f48225;
        }
        .so-popover-ans-item .ans-score {
          font-size: 11px;
          font-weight: 700;
          color: #4CAF50;
          background: rgba(76, 175, 80, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .so-popover-ans-item .ans-title {
          font-size: 11.5px;
          color: #f0f6fc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .so-popover-btn {
          display: block;
          text-align: center;
          background: #f48225;
          color: #fff;
          font-size: 11.5px;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 8px;
          text-decoration: none;
          margin-top: 12px;
          transition: background 0.2s ease;
        }
        .so-popover-btn:hover {
          background: #e67316;
        }

        /* ---------- coach mark ---------- */
        .coach {
          position: absolute; top: 44px; left: 50%; transform: translateX(-50%);
          z-index: 55; max-width: min(86vw, 420px);
          background: rgba(28,28,28,0.92); border: 1px solid var(--border);
          color: var(--text); font-size: 12.5px; line-height: 1.5;
          padding: 10px 14px; border-radius: 10px;
          display: flex; align-items: flex-start; gap: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .coach strong { color: var(--ubuntu-orange-light); }
        .coach-close { background: transparent; border: none; color: var(--dim); flex: none; }
        .coach-close:hover { color: var(--text); }

        /* ---------- live feed widget ---------- */
        .feed-slot { position: absolute; top: 44px; right: 14px; width: 290px; z-index: 4; }
        .feed { background: rgba(28,28,28,0.82); backdrop-filter: blur(8px); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
        .feed-head { display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-bottom: 1px solid var(--border); font-size: 10.5px; color: var(--dim); font-family: var(--font-mono); }
        .feed-live { margin-left: auto; color: var(--green); }
        .feed-body { padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; }
        .feed-row { display: flex; gap: 8px; font-size: 11px; line-height: 1.4; font-family: var(--font-mono); }
        .feed-time { color: var(--dim); flex: none; }
        .feed-sev { flex: none; font-weight: 600; }
        .feed-text { color: var(--text); opacity: 0.9; }

        /* ---------- dock ---------- */
        .dock {
          position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          background: rgba(20,18,20,0.55); backdrop-filter: blur(10px);
          border: 1px solid var(--border); border-radius: 16px;
          padding: 10px 7px; z-index: 60;
        }
        .dock-btn {
          position: relative; width: 42px; height: 42px; border-radius: 11px;
          background: var(--surface); border: 1px solid transparent;
          color: var(--text); display: flex; align-items: center; justify-content: center;
        }
        .dock-btn:hover { background: #3a3a3a; transform: translateY(-2px); transition: transform 0.12s; }
        .dock-btn-featured { background: linear-gradient(145deg, var(--ubuntu-orange), #b8390f); color: #fff; }
        .dock-icon { position: relative; display: flex; }
        .dock-spark { position: absolute; top: -4px; right: -5px; color: #ffd9a8; }
        .dock-active-dot { position: absolute; left: -10px; top: 50%; transform: translateY(-50%); width: 4px; height: 16px; border-radius: 3px; background: var(--ubuntu-orange-light); }
        .dock-sep { width: 24px; height: 1px; background: var(--border); margin: 2px 0; }
        .dock-grid { background: transparent; color: var(--dim); }
        .dock-grid:hover, .dock-grid.on { background: rgba(255,255,255,0.1); color: var(--text); }
        .dock-btn::after {
          content: attr(data-tip);
          position: absolute; left: 52px; top: 50%; transform: translateY(-50%) translateX(-4px);
          background: #1c1c1c; border: 1px solid var(--border); color: var(--text);
          font-size: 11px; padding: 4px 8px; border-radius: 6px; white-space: nowrap;
          opacity: 0; pointer-events: none; transition: opacity 0.12s, transform 0.12s;
        }
        .dock-btn:hover::after { opacity: 1; transform: translateY(-50%) translateX(0); }

        /* ---------- overview (activities grid) ---------- */
        .overview {
          position: absolute; inset: 0; z-index: 70;
          background: rgba(10,8,10,0.72); backdrop-filter: blur(6px);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 40px 24px;
        }
        .overview-hint { color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 18px; }
        .overview-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 140px));
          gap: 14px; max-width: 720px;
        }
        .overview-tile {
          display: flex; flex-direction: column; align-items: flex-start; gap: 8px;
          background: rgba(255,255,255,0.06); border: 1px solid var(--border);
          border-radius: 12px; padding: 14px; color: var(--text); text-align: left;
        }
        .overview-tile:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); transition: transform 0.12s; }
        .overview-tile.featured { border-color: var(--ubuntu-orange); }
        .overview-tile-label { font-size: 13px; font-weight: 500; }
        .overview-tile-hint { font-size: 10.5px; color: var(--dim); line-height: 1.3; }

        /* ---------- window ---------- */
        .win {
          position: absolute;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 9px;
          box-shadow: 0 16px 34px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .win-bar {
          display: flex; align-items: center; gap: 7px;
          padding: 8px 10px; background: var(--panel-alt);
          border-bottom: 1px solid var(--border);
          cursor: grab; user-select: none;
        }
        .win-bar-icon { color: var(--ubuntu-orange-light); flex: none; }
        .win-title { font-size: 11.5px; color: var(--dim); flex: 1; letter-spacing: 0.01em; }
        .win-controls { display: flex; gap: 4px; }
        .win-ctrl { background: transparent; border: none; color: var(--dim); display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 4px; }
        .win-ctrl:hover { background: rgba(255,255,255,0.1); color: var(--text); }
        .win-ctrl-close:hover { background: var(--red); color: #fff; }
        .win-content { padding: 16px 18px; overflow: auto; font-size: 13px; }
        .win-prose p { margin: 0 0 10px; line-height: 1.55; }
        .win-muted { color: var(--dim); }
        .win-key { color: var(--cyan); font-family: var(--font-mono); }
        .win-link { color: var(--ubuntu-orange-light); text-decoration: none; border-bottom: 1px dashed rgba(233,84,32,0.4); }
        .win-link:hover { color: #fff; }
        .win-log { margin: 0; font-family: var(--font-mono); font-size: 12.5px; line-height: 1.6; color: var(--text); white-space: pre-wrap; }

        .resume-card { display: flex; flex-direction: column; }
        .resume-file { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid var(--border); border-radius: 6px; background: var(--panel-alt); color: var(--ubuntu-orange-light); }
        .resume-name { font-family: var(--font-mono); font-size: 13px; color: var(--text); }
        .resume-btn { margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 12px; border-radius: 6px; background: var(--ubuntu-orange); color: #fff; font-weight: 600; font-size: 12px; text-decoration: none; letter-spacing: 0.02em; }
        .resume-btn:hover { background: var(--ubuntu-orange-light); }

        /* ---------- mobile ---------- */
        @media (max-width: 720px) {
          .dock { left: 50%; top: auto; bottom: 8px; transform: translateX(-50%); flex-direction: row; border-radius: 18px; max-width: calc(100% - 20px); overflow-x: auto; }
          .dock-btn::after { display: none; }
          .feed-slot { display: none; }
          .topbar-cta span, .topbar-activities span { display: none; }
          .login-clock { font-size: 20vw; }
          .win-mobile {
            position: fixed; left: 8px; right: 8px; top: 42px; bottom: 74px;
            width: auto !important;
          }
          .win-mobile .win-content { max-height: none; height: calc(100% - 37px); }
          .overview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .boot-cursor, .splash-logo { animation: none; }
        }
      `}</style>

      {!booted ? (
        <BootSequence
          onDone={() => setBooted(true)}
          reducedMotion={reducedMotion}
          clock={clock}
        />
      ) : (
        <Desktop reducedMotion={reducedMotion} />
      )}
    </div>
  );
}