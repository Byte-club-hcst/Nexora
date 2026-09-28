# NEXORA 2026 — Official Conference Portal

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-orange.svg)](https://firebase.google.com/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2%20Storage-yellow.svg)](https://www.cloudflare.com/products/r2/)

Official web application for **NEXORA 2026** — Emerging Technology & Interdisciplinary Innovation Student Conference, hosted by **BYTE CLUB (CSE)** and **QUBIT TECH SOCIETY (IT)** at **Hindustan College of Science and Technology (HCST)**, Mathura (NAAC A+ Accredited).

---

## 🏛️ Monorepo Architecture
- **`frontend/`**: React 18 + Vite SPA, styled with custom responsive design system (teal, amber, glassmorphism), deployed on **Vercel**.
- **`backend/`**: Node.js + Express REST API with Firebase Admin SDK, Cloudflare R2 private storage, and rate limiting, deployed on **Render**.
- **`docs/`**: Complete technical, security, API, and deployment documentation.
- **`render.yaml`**: Infrastructure-as-code blueprint for Render backend deployment.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Backend Setup
```bash
cd backend
cp .env.example .env     # Configure Firebase & R2 credentials
npm install
npm test                 # Run test suites (all 14 unit & integration tests)
npm run dev              # Starts API server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env     # Configure Firebase Web Client credentials
npm install
npm run dev              # Starts Vite dev server on http://localhost:5173
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing Suite
Run backend tests covering signup, registration transactions, duplicate locks, file signature checks, R2 storage, and end-to-end lifecycle:
```bash
cd backend
npm test
```

Build the production frontend bundle:
```bash
cd frontend
npm run build
```

---

## 🛡️ Security & Architecture Features
- **Zero Client-Side Trust**: All authorization derives from verified Firebase ID tokens and custom claims (`role === 'admin'`).
- **Atomic Concurrency Protection**: Registrations and submissions execute within Firestore Transactions, eliminating race conditions.
- **Private Cloudflare R2 Storage**: Student submissions and payment proofs are stored privately; pre-signed, short-lived URLs (60 min) are only issued to authorized users.
- **Binary Signature File Verification**: Multer inspects raw magic-bytes (`%PDF`, PNG, JPEG) to guarantee authentic file types.
- **Audit Logging**: Comprehensive admin action logging (`auditLogs` collection) with sensitive credential redaction.
- **Dynamic Configuration**: Deadlines and fees are managed via `eventConfig` and displayed in Indian Standard Time (Asia/Kolkata).

---

## 📚 Documentation Links
- [System Architecture](docs/ARCHITECTURE.md)
- [REST API Specification](docs/API.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Security Audit & Vulnerability Remediation](docs/SECURITY_AUDIT.md)

---

## 👥 Organizing Committee
- **Chief Patron**: Shri P.K. Gupta (Chairman, Sharda Group)
- **General Chair**: Dr. R.S. Pavithra (Director, HCST)
- **Faculty Coordinators**: Mr. Gaurav Pandey (Byte Club) & Mr. Utkarsh Gupta (Qubit Club)
- **Student Coordinators**: Akshita Mathur (+91 70550 02687), Kunal Rathore (+91 75057 08793), Vinarm Verma (+91 90456 61289)
