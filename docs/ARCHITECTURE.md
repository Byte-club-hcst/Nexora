# NEXORA 2026 — Architecture & System Design

## 1. Overview
NEXORA 2026 is an academic research conference web application designed as a decoupled, production-grade monorepo comprising:
- **Frontend**: Single Page Application built with React 18, Vite, React Router 6, and Vanilla CSS design system, targeted for global deployment on **Vercel**.
- **Backend**: RESTful API service built with Node.js and Express, targeted for containerized deployment on **Render**.
- **Authentication**: Firebase Authentication (Email/Password, Email Verification, Password Reset, Firebase ID tokens verified via Firebase Admin SDK).
- **Database**: Cloud Firestore (NoSQL, transaction-safe operations, indexed collections).
- **File Storage**: Cloudflare R2 (private, S3-compatible object storage with short-lived pre-signed URLs).
- **Domain Topology**:
  - Main portal: `https://nexora.tech` (or custom apex domain)
  - API subdomain: `https://api.nexora.tech` (or `api.` subdomain)

---

## 2. Monorepo Structure
```
nexora-2026/
├── frontend/                     # React + Vite application
│   ├── index.html                # HTML5 entry with OpenGraph & JSON-LD
│   ├── package.json              # Client dependencies
│   ├── vite.config.js            # Build configuration & proxy
│   ├── vercel.json               # SPA rewrite rules & security headers
│   ├── .env.example              # Client environment template
│   ├── public/                   # Static assets (images, logos, rulebook, robots, sitemap)
│   └── src/
│       ├── context/              # Auth & Event state providers
│       ├── services/             # API client & Firebase client
│       ├── components/           # Reusable UI component library
│       └── pages/                # Public, Participant & Admin route views
├── backend/                      # Node.js + Express REST API
│   ├── package.json              # Server dependencies & scripts
│   ├── .env.example              # Server environment template
│   └── src/
│       ├── config/               # Firebase, R2, Environment configs
│       ├── middleware/           # Auth, Admin, Rate Limit, Error handling
│       ├── services/             # Business logic (Storage, Registration, Submission, Audit)
│       ├── controllers/          # Thin request/response handlers
│       ├── routes/               # API route definitions
│       ├── validators/           # File signatures, mime, magic bytes, schemas
│       ├── utils/                # Standardized JSON response utilities
│       └── tests/                # Zero-dependency test suites
├── docs/                         # Technical documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── SECURITY_AUDIT.md
├── render.yaml                   # Infrastructure-as-code for Render backend
└── README.md                     # Project overview and quickstart
```

---

## 3. Data Model & Firestore Collections

### 3.1 `users`
Key: Firebase UID
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "college": "string",
  "phone": "string",
  "role": "participant | admin",
  "createdAt": "ISO-8601 UTC",
  "updatedAt": "ISO-8601 UTC"
}
```

### 3.2 `registrations`
Key: Firebase UID (stable identifier, 1:1 with user)
```json
{
  "uid": "string",
  "name": "string",
  "email": "string",
  "college": "string",
  "phone": "string",
  "track": "AI/ML | Data Science | Emerging Tech | Sustainable Tech | Interdisciplinary Innovation",
  "paymentStatus": "Pending Payment | Pending Verification | Verified | Rejected",
  "paymentProofKey": "payment-proofs/{uid}/{uuid}.png | null",
  "feeAmount": 100,
  "rejectionReason": "string | null",
  "paymentSubmittedAt": "ISO-8601 UTC",
  "paymentVerifiedAt": "ISO-8601 UTC",
  "paymentVerifiedBy": "adminUid",
  "createdAt": "ISO-8601 UTC",
  "updatedAt": "ISO-8601 UTC"
}
```

### 3.3 `submissions`
Key: Firebase UID
```json
{
  "id": "string (uid)",
  "userId": "string",
  "registrationId": "string",
  "title": "string",
  "track": "string",
  "abstract": "string",
  "keywords": "string",
  "authors": [
    { "name": "string", "course": "string", "branch": "string", "year": "string" }
  ],
  "abstractKey": "submissions/{uid}/abstracts/{uuid}.pdf",
  "posterKey": "submissions/{uid}/posters/{uuid}.png",
  "status": "Under Review | Accepted | Rejected",
  "round2Eligible": true,
  "adminFeedback": "string | null",
  "reviewedBy": "adminUid",
  "reviewedAt": "ISO-8601 UTC",
  "createdAt": "ISO-8601 UTC",
  "updatedAt": "ISO-8601 UTC"
}
```

### 3.4 `eventConfig`
Key: `default`
```json
{
  "eventName": "NEXORA 2026",
  "eventDescription": "Emerging Technology & Interdisciplinary Innovation Student Conference",
  "contactEmail": "nexora2026@hcst.edu.in",
  "registrationFee": 100,
  "registrationOpen": true,
  "registrationDeadline": "ISO-8601 UTC",
  "paymentDeadline": "ISO-8601 UTC",
  "submissionOpen": true,
  "submissionDeadline": "ISO-8601 UTC",
  "eventStart": "ISO-8601 UTC",
  "eventEnd": "ISO-8601 UTC",
  "venue": "APJ Abdul Kalam Auditorium, HCST Mathura",
  "updatedAt": "ISO-8601 UTC"
}
```

### 3.5 `auditLogs`
Key: Auto-generated document ID
```json
{
  "adminUid": "string",
  "action": "PAYMENT_VERIFIED | PAYMENT_REJECTED | SUBMISSION_ACCEPTED | SUBMISSION_REJECTED | EVENT_CONFIG_UPDATED | ANNOUNCEMENT_CREATED | FILE_ACCESSED",
  "targetUid": "string | null",
  "previousValue": "object | null",
  "newValue": "object | null",
  "metadata": "object",
  "timestamp": "ISO-8601 UTC"
}
```

---

## 4. Security & Access Control
1. **Deny Direct Firestore Reads/Writes**: Client browsers cannot execute direct Firestore operations; all database access is mediated by the Express backend running the Firebase Admin SDK.
2. **Token Verification**: Every protected API route extracts the Bearer token and verifies cryptographically via `auth.verifyIdToken()`.
3. **Role Enforcement**: Administrative authority requires verified custom claims (`role === 'admin'`). Frontend role information is never trusted.
4. **Private Storage & Short-Lived Signed URLs**: R2 bucket has public access disabled. Files (payment proofs, abstracts, posters) are only accessible via short-lived pre-signed URLs (60 minutes expiry) generated after identity and authorization verification.
5. **Magic Byte File Validation**: Uploaded buffers are inspected for valid binary signatures (`%PDF` for PDFs, `0x89 0x50 0x4E 0x47` for PNG, `0xFF 0xD8 0xFF` for JPEG) to prevent malicious executable masquerading.
