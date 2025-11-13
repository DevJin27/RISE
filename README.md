# 🚀 RISE – Recursion, Iteration, Solution, Efficiency

**RISE** is a full-stack web application designed to help developers master coding problems efficiently through curated problem sets, AI-assisted insights, and progress tracking.

---

## 🧠 Overview

RISE streamlines the coding journey by integrating **problem-solving platforms**, **AI recommendations**, and **data-driven progress tracking** — all within a seamless and modern interface.

---

## 🏗️ Architecture

```
Frontend (React + Next.js + TailwindCSS)
        ↓ REST API (Axios)
Backend (Node.js + Express + Prisma ORM)
        ├── Database (MySQL – Aiven)
        ├── Cache (Redis – Upstash)
        ├── AI Service (Python + Claude API)
        └── LeetCode API (GraphQL)

Hosting:
- Frontend: Vercel
- Backend: Railway
- Database: Aiven (MySQL)
- AI Service: AWS Lambda
```

---

## 🔍 API Endpoints

**Problem Queries**
```http
GET /api/problems?difficulty=medium&topic=graphs&company=google&mastery=new
GET /api/problems/search?q=binary+tree&limit=20
GET /api/problems?sort=frequency&order=desc&page=2
```

**Submission History**
```http
GET /api/submissions/history?page=3&limit=50
```

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React, Next.js, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL (Aiven), Prisma ORM |
| **Cache** | Redis (Upstash) |
| **AI Service** | Python + Claude API |
| **Hosting** | Vercel (Frontend), Railway (Backend), AWS Lambda (AI Service) |

---

## 💡 Features

- 🔍 **Advanced Problem Filtering:** Filter problems by difficulty, topic, company, and mastery level.  
- 🧠 **AI Insights:** Claude API integration for problem hints, explanations, and personalized feedback.  
- ⚙️ **Performance Optimization:** Caching via Redis and efficient Prisma ORM queries.  
- 📊 **Progress Tracking:** Historical submission tracking with analytics dashboard.  
- ☁️ **Cloud-Native Deployment:** Fully hosted using Vercel, Railway, Aiven, and AWS Lambda.  

---

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/DevJin27/RISE.git
cd RISE
```

### 2. Install dependencies
```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
```

### 3. Configure environment variables
Create `.env` files in both `frontend` and `backend` directories.

**Example `.env` for backend:**
```
DATABASE_URL="mysql://username:password@host:port/database"
REDIS_URL="rediss://your-upstash-url"
CLAUDE_API_KEY="your-claude-api-key"
```
