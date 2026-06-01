# SafeSphere AI 🛡️

> AI-Powered Cyberbullying Detection & Prevention Platform

A full-stack MERN application that detects, prevents, and manages cyberbullying using advanced artificial intelligence.

## 🌐 Live Features

- **Real-Time Detection** — AI scans messages instantly with 98% accuracy
- **Sentiment Analysis** — Detects hate, toxicity, harassment, threats
- **400+ Harmful Words** — Comprehensive detection including Hindi/English
- **File a Complaint** — Anyone can report cyberbullying (no login required)
- **Admin Control Center** — 3 certified admins monitor and respond to complaints
- **Live Demo** — Try the AI analyzer in real time
- **Smart Chatbot** — AI assistant with 40+ unique responses

## 🚀 Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React + Vite | Node.js + Express | MongoDB |
| Tailwind CSS | JWT Auth | Mongoose |
| Framer Motion | REST API | |
| Recharts | Rate Limiting | |

## 🔐 Admin Credentials (Demo)

| Admin | Email | Password |
|-------|-------|----------|
| Admin Arjun | admin1@safesphere.ai | Admin@123 |
| Admin Priya | admin2@safesphere.ai | Admin@123 |
| Admin Rahul | admin3@safesphere.ai | Admin@123 |

## ⚙️ Setup & Run

```bash
# Install all dependencies
cd server && npm install
cd ../client && npm install

# Setup environment
cp server/.env.example server/.env
# Add your MongoDB URI in server/.env

# Run both servers
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Open `http://localhost:5173`

## 📁 Project Structure

```
safesphere-ai/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # User & Admin pages
│       ├── sections/# Home page sections
│       └── components/
├── server/          # Express backend
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API endpoints
│   └── middleware/  # Auth middleware
└── package.json
```

## 🔗 Cyberbullying Resources

- [National Cyber Crime Portal India](https://cybercrime.gov.in)
- [iCall Helpline](https://icallhelpline.org) — 9152987821
- [Cybersmile Foundation](https://cybersmile.org)

---

Built with ❤️ for a safer internet.
