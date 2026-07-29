# SafeSphere AI 🛡️

**AI-Powered Cyberbullying Detection & Reporting Platform**
  
[![Live Demo](https://img.shields.io/badge/Live-safesphere--ai--gamma.vercel.app-6366f1?style=for-the-badge)](https://safesphere-ai-gamma.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-4ade80?style=for-the-badge)](https://safesphere-ai-rcdt.onrender.com/api/health)

## About

SafeSphere AI is a full-stack web platform that detects harmful content in real time and provides a structured complaint filing and resolution system. Built to give cyberbullying victims a voice and ensure 24-hour admin response.

## Features

- **Real-Time AI Detection** — 400+ keyword detection with severity scoring (low/medium/high/critical)
- **3-Step Complaint Filing** — Guided form with AI severity detection and image evidence upload
- **Admin Control Center** — Review, assign, resolve complaints with email notifications
- **User Dashboard** — Safety score, analysis history, complaint tracking
- **Google Sign-In** — OAuth 2.0 integration
- **OTP Password Reset** — Secure email OTP via Resend API
- **Role-Based Access** — User, Admin roles with protected routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB Atlas |
| Auth | JWT, Google OAuth 2.0 |
| Email | Resend API |
| Deployment | Vercel + Render |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Resend API key

### Installation

```bash
# Clone the repo
git clone https://github.com/deekshitha875/safesphere-ai.git
cd safesphere-ai

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables 

Create `server/.env`:
```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_key
```

Create `client/.env`:
```
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Run Locally

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend
cd client && npm run dev
```

## Live Demo

Visit [safesphere-ai-gamma.vercel.app](https://safesphere-ai-gamma.vercel.app)

## License

MIT
