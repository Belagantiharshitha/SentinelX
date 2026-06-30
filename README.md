# 🛡️ SentinelX
### AI-Driven Adaptive Trust & Behavioral Defense Layer

📌 About SentinelX

SentinelX is an AI-powered behavioral fraud detection and adaptive trust framework designed to protect modern web applications from sophisticated cyber attacks.

Unlike traditional security systems that verify users only during login, SentinelX continuously monitors user behavior throughout the session. It detects anomalies, calculates dynamic trust scores, identifies suspicious activities, and automatically responds to threats before they cause financial loss or data compromise.

The project combines Artificial Intelligence, Machine Learning, Zero Trust Security, and real-time monitoring into a single adaptive security platform.

---

 🎯 Problem Statement

Modern applications remain vulnerable to attacks where malicious users imitate legitimate user behavior.

Traditional security systems analyze requests individually and fail to detect:

- Credential Stuffing
- Session Hijacking
- API Abuse
- Insider Threats
- Account Takeover
- Low-and-Slow Attacks

SentinelX solves this problem using continuous behavioral analysis and adaptive trust evaluation.

# ✨ Features

- ✅ Adaptive Trust Scoring
- ✅ Behavioral Risk Analysis
- ✅ Machine Learning Anomaly Detection
- ✅ AI Incident Report Generation
- ✅ Root Cause Analysis (GPT-4o)
- ✅ Zero Trust Security Model
- ✅ Real-Time SOC Dashboard
- ✅ Threat Visualization
- ✅ Impossible Travel Detection
- ✅ Device Fingerprinting
- ✅ OTP & MFA Triggering
- ✅ Automated Incident Response

# 🏗️ System Architecture

```
                    User
                      │
                      ▼
             FastAPI Middleware
                      │
                      ▼
          Behavioral Risk Engine
        ┌─────────┬─────────┬─────────┐
        │         │         │
        ▼         ▼         ▼
 Adaptive      Rule-Based   Machine
 Baseline      Detection    Learning
                              │
                              ▼
                     Isolation Forest
                              │
                              ▼
                    Total Risk Score
                              │
                              ▼
                 Automated Response Engine
                              │
          ┌──────────┬────────────┬───────────┐
          │          │            │
        Allow      OTP/MFA      Block User
                              │
                              ▼
                 React SOC Dashboard
```

---

# 🧠 Detection Engine

## Layer 1 – Adaptive Baseline

Compares the user's current session against historical behavior.

Parameters:

- Device Fingerprint
- Browser
- Login Time
- Transaction Amount
- Location
- IP Address

---

## Layer 2 – Rule-Based Detection

Detects known attack signatures.

Examples:

- Credential Stuffing
- Impossible Travel
- Session Hijacking
- API Abuse
- Velocity Checks

---

## Layer 3 – Machine Learning

Uses Isolation Forest to detect hidden anomalies that traditional rules cannot identify.

The ML engine analyzes behavioral patterns and produces a fraud probability score.

---

# 📊 Risk Classification

| Risk Score | Status | Action |
|------------|---------|------------------------|
| 0–100 | Safe | Allow Access |
| 101–160 | Medium | OTP Verification |
| 161–220 | High | Force MFA |
| 221+ | Critical | Block User & Generate Incident |

---

# 🤖 AI Capabilities

SentinelX uses OpenAI GPT-4o to automatically generate:

- Root Cause Analysis
- Incident Summary
- Behavioral Forensic Report
- Risk Explanation
- Security Recommendations
- Mitigation Steps

---

# 🛠️ Technology Stack

### Frontend

- React
- Vite
- Framer Motion

### Backend

- Python
- FastAPI
- SQLAlchemy

### Machine Learning

- Scikit-Learn
- Isolation Forest
- Principal Component Analysis (PCA)
- Random Forest

### Database

- SQLite

### Authentication

- JWT
- bcrypt
- PyOTP

### AI

- OpenAI GPT-4o

### Deployment

- Docker
- Docker Compose

---

# 📂 Project Structure

```
SentinelX
│
├── backend
│   ├── routes
│   ├── middleware
│   ├── models
│   ├── database
│   ├── ai
│   ├── ml
│   ├── utils
│   └── main.py
│
├── frontend
│
├── screenshots
│
├── requirements.txt
│
├── docker-compose.yml
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/SentinelX.git
```

```bash
cd SentinelX
```

---

# 🐍 Backend Setup

Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn main:app --reload
```

---

# ⚛️ Frontend Setup

Navigate to frontend

```bash
cd frontend
```

Install Packages

```bash
npm install
```

Run Development Server

```bash
npm run dev
```

---

# 🐳 Docker Setup

Build Containers

```bash
docker-compose build
```

Run Containers

```bash
docker-compose up
```

---

# 🔑 Environment Variables

Create a `.env` file.

```
OPENAI_API_KEY=your_openai_key

JWT_SECRET=your_secret

DATABASE_URL=sqlite:///sentinelx.db

REDIS_URL=redis://localhost:6379

TWILIO_SID=xxxxxxxx

TWILIO_AUTH_TOKEN=xxxxxxxx
```

> Never commit your `.env` file to GitHub.

---

# 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|------------|
| POST | /login | User Login |
| POST | /transfer | Money Transfer |
| POST | /otp | OTP Verification |
| GET | /dashboard | Dashboard Data |
| GET | /incidents | Incident Reports |
| GET | /trust-score | Current Trust Score |

---

---

# 🚀 Future Improvements

- Kubernetes Deployment
- SIEM Integration
- Kafka Streaming
- WebSocket Alerts
- Cloud Deployment
- Explainable AI Dashboard
- Mobile Application
- Multi-Tenant Support

---

# 📚 References

- OWASP Top 10
- NIST SP 800-63B
- Isolation Forest Research Paper
- Principal Component Analysis
- FastAPI Documentation
- React Documentation

---

# 👩‍💻 Author

**Harshitha Belaganti**

Cyber Security Student

Python • FastAPI • React • Machine Learning • Artificial Intelligence • Cyber Security

GitHub: https://github.com/belagantiharshitha


# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps the project reach more developers and encourages future improvements.
