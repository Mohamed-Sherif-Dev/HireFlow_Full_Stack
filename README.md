# HireFlow 🚀

> AI-Powered Recruitment Platform — Hire Smarter, Get Hired Faster

A full-stack recruitment platform that uses AI to match candidates with jobs, score applications, analyze CVs, and generate cover letters. Built for both companies and job seekers.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![AI](https://img.shields.io/badge/AI-LLaMA_3.1-purple?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)

---

## ✨ Features

### 👨‍💻 For Candidates
- **Google OAuth** — Sign in instantly
- **AI CV Analysis** — Upload CV and AI extracts skills, experience & builds profile
- **Smart Job Matching** — AI scores job compatibility (0-100%)
- **One-Click Apply** — Apply with AI-generated cover letter
- **Application Tracking** — Track status: Pending → Reviewing → Shortlisted → Accepted
- **Profile Dashboard** — Score distribution, stats, and completion tips

### 🏢 For Companies
- **Job Posting** — Post jobs with AI-generated descriptions
- **AI Candidate Scoring** — Every application gets scored automatically
- **Applicant Dashboard** — View all candidates sorted by AI score
- **Accept / Shortlist / Reject** — Manage pipeline with one click
- **Company Profile** — Logo, industry, size, and description

### 🤖 AI Features
- CV Parser — Extract skills, title, experience from any CV
- Job Fit Scoring — Compare candidate vs job requirements
- Cover Letter Generator — Personalized per job
- Job Description Generator — Write job posts with AI
- Job Matching — Recommend best jobs per candidate

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon.tech) |
| ORM | Prisma |
| Auth | NextAuth.js v5 (Google OAuth) |
| AI | LLaMA 3.1 via OpenRouter (free) |
| File Upload | Cloudinary (CV + logos) |
| Email | Nodemailer (Gmail SMTP) |
| Payments | Stripe |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deploy | Vercel |

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/hireflow.git
cd hireflow
npm install


# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# AI
OPENROUTER_API_KEY="sk-or-..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your@gmail.com"
SMTP_PASS="your-app-password"


src/
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth handler
│   │   ├── jobs/              # Job CRUD + Apply
│   │   ├── candidate/         # Candidate setup
│   │   ├── company/           # Company setup
│   │   ├── applications/      # Status updates
│   │   └── ai/                # CV analysis, scoring, matching
│   ├── auth/signin/           # Sign in page
│   ├── jobs/                  # Jobs listing + details
│   ├── candidate/             # Candidate pages
│   ├── company/               # Company pages
│   └── page.tsx               # Landing page
├── components/
│   ├── Navbar.tsx             # Navigation
│   └── SessionProvider.tsx    # Auth provider
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── db.ts                  # Prisma client
│   └── utils.ts               # Helpers
└── types/
    └── next-auth.d.ts         # Type extensions




Candidate applies →
  AI compares: candidate skills vs job requirements
  AI compares: years of experience
  AI generates: score (0-100%) + reasoning + strengths + weaknesses
  → Company sees ranked applicants

Candidate uploads CV →
  AI extracts: title, bio, skills, experience, education
  → Profile auto-filled

Candidate applies →
  AI generates: personalized cover letter
  → One-click apply    