# 🎓 RV Learning Hub — Learning Management System

A full-stack, cross-platform Learning Management System built for JEE, NEET & Commerce coaching.
Available as **Web App**, **Android App** (Google Play Store), and **iOS App** (Apple App Store).

---

## 📁 Project Structure

```
Final LMS/
├── backend/                    # Node.js + Express API Server
│   ├── config/                 # Database connection config
│   ├── data/                   # In-memory data store
│   ├── middleware/             # Auth middleware (JWT protect)
│   ├── models/                 # Mongoose schemas (25 models)
│   ├── routes/                 # 20 modular Express route files
│   ├── seed/                   # Database seed data
│   ├── test/                   # Automated integration tests (25 tests)
│   ├── utils/                  # Utility modules (logger)
│   ├── index.js                # Slim Express server entry (~70 lines)
│   ├── package.json            # Backend dependencies
│   └── .env.example            # Environment variable template
├── src/                        # Frontend modular source code
│   ├── pages/                  # 52 individual page modules
│   │   ├── student/            # 17 student & parent page modules
│   │   ├── faculty/            # 11 faculty page modules
│   │   ├── admin/              # 14 admin page modules
│   │   ├── shared/             # 8 shared/cross-role page modules
│   │   └── index.js            # Central page registry loader
│   ├── services/               # API client & Service Worker
│   ├── components/             # Reusable UI components (mobile nav)
│   └── app.js                  # Main application entry point
├── public/                     # Static assets (icons, PWA manifest, policies)
│   ├── icon-192.png            # App icon 192x192
│   ├── icon-512.png            # App icon 512x512
│   ├── manifest.webmanifest    # PWA manifest
│   ├── sw.js                   # Service Worker
│   ├── privacy-policy.html     # Privacy Policy (store requirement)
│   └── terms-of-service.html   # Terms of Service (store requirement)
├── index.html                  # Main HTML entry point
├── main.js                     # SPA application logic
├── style.css                   # All CSS styles
├── capacitor.config.json       # Mobile app configuration
├── vite.config.js              # Vite build config
├── package.json                # Root dependencies (Vite)
├── .github/workflows/          # CI/CD Pipeline
│   └── ci-cd.yml               # GitHub Actions (build-and-test)
├── vercel.json                 # Vercel deployment config
└── .gitignore                  # Git ignore rules
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ → [nodejs.org](https://nodejs.org)
- **MongoDB** v7+ → [mongodb.com](https://www.mongodb.com/try/download/community)

### 1. Clone & Install

```bash
git clone https://github.com/HarshithaDS631/RVLH_LMS.git
cd RVLH_LMS
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env        # Copy env template
npm install                  # Install dependencies
npm run dev                  # Start dev server (port 5000)
```

### 3. Frontend Setup

```bash
npm install                  # Install dependencies (from project root)
npm run dev                  # Start Vite dev server (port 3000)
```

### 4. Open in Browser

Visit **http://localhost:3000** — the frontend proxies API calls to backend automatically.

### Demo Credentials

| Role       | Email              | Password     |
|------------|--------------------|--------------|
| Student    | arjun@rvhub.com    | student123   |
| Faculty    | priya@rvhub.com    | faculty123   |
| Admin      | admin@rvhub.com    | admin123     |

---

## 🧪 Running Tests

```bash
npm test        # Runs 25 automated integration tests (from project root)
```

---

## 📱 Mobile App Build (Google Play Store & Apple App Store)

### Android (Play Store)

```bash
npm run build                    # Build production assets
npx cap add android              # Add Android platform
npx cap sync android             # Sync web assets to Android
npx cap open android             # Open in Android Studio
```

Then in Android Studio: **Build → Generate Signed Bundle / APK**

### iOS (App Store)

```bash
npm run build                    # Build production assets
npx cap add ios                  # Add iOS platform
npx cap sync ios                 # Sync web assets to iOS
npx cap open ios                 # Open in Xcode
```

Then in Xcode: **Product → Archive → Distribute App**

---

## ✅ Store Approval Checklist

### Google Play Store
- [x] App icon (512x512 PNG)
- [x] Privacy Policy URL (`/privacy-policy.html`)
- [x] Terms of Service
- [x] App category: Education
- [x] Target API level: 34+ (Android 14)
- [x] App Bundle (AAB) format support
- [x] Content rating questionnaire: Education
- [x] Data safety declaration covered by Privacy Policy

### Apple App Store
- [x] App icon (1024x1024 in Asset Catalog)
- [x] Privacy Policy URL (`/privacy-policy.html`)
- [x] App Transport Security: HTTPS enforced
- [x] Launch Screen configured
- [x] Safe area insets implemented
- [x] Category: Education
- [x] Age rating: 4+ (Educational content only)
- [x] App Review guidelines compliance

---

## 🔗 Important URLs

| Resource            | URL                                         |
|---------------------|---------------------------------------------|
| Privacy Policy      | `https://your-domain.com/privacy-policy.html`|
| Terms of Service    | `https://your-domain.com/terms-of-service.html`|
| API Server          | `https://your-domain.com/api/`              |
| GitHub Repository   | `https://github.com/HarshithaDS631/RVLH_LMS`|

---

## 🏗️ Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | Vite + Vanilla JavaScript SPA                 |
| Backend    | Node.js + Express.js                          |
| Database   | MongoDB + Mongoose                            |
| Auth       | JWT (jsonwebtoken) + bcrypt                   |
| Mobile     | Capacitor (Android + iOS native wrapper)      |
| PWA        | Service Worker + Web App Manifest             |
| CI/CD      | GitHub Actions (build-and-test pipeline)      |
| Hosting    | Vercel (web) / Play Store / App Store         |

---

## 📄 License

© 2026 RV Learning Hub. All rights reserved.
