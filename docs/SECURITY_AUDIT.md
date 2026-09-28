# NEXORA 2026 — Security Audit & Resolution Report

This document records the complete vulnerability audit conducted on the original scaffold and the remediation architecture implemented in the production refactor.

| Audit Finding | Original Issue | Production Remediation |
|---|---|---|
| **Hard-coded Credentials** | `public/js/firebase-config.js` committed hard-coded Firebase API keys to git. | Replaced with environment-driven configuration (`import.meta.env.VITE_FIREBASE_*`). Added strict `.env*` rules to `.gitignore`. |
| **Hard-coded Deadlines** | `const ABSTRACT_DEADLINE = new Date('2026-09-30...')` hard-coded in controllers. | Moved all conference deadlines into dynamic Firestore `eventConfig` collection. Admins can adjust deadlines on-the-fly via GUI without redeployment. |
| **Race Conditions in Registration** | Used `await doc.get(); if (!exists) await doc.set(...)` which allows concurrent double registrations. | Converted registration and submission creation to atomic **Firestore Transactions** (`db.runTransaction()`). Duplicate requests are rejected deterministically with HTTP 409. |
| **Unverified Email / Identity Spoofing** | Registration controller took email from `req.body.email` rather than verified token. | Email is now strictly extracted from the verified Firebase ID token (`req.user.email`). Client assertions of email/identity are ignored. |
| **Insecure File Handling (Cloudinary)** | Uploaded files were pushed to Cloudinary with public URLs, leaving payment screenshots and unpublished papers publicly indexable. | Replaced with private **Cloudflare R2** object storage. Pre-signed, time-limited URLs (60 minutes expiry) are generated only after role-based identity checks. |
| **Weak File Type Validation** | Multer only validated browser-provided `file.mimetype`, easily spoofed by renaming malicious binaries. | Implemented binary **magic-byte inspection** (`detectMagicBytes` checking `%PDF`, `0x89 0x50 0x4E 0x47` for PNG, `0xFF 0xD8 0xFF` for JPEG). |
| **Missing Audit Logging** | Admin verification and review decisions occurred without audit tracking. | Implemented `AuditService` recording all admin events (`PAYMENT_VERIFIED`, `SUBMISSION_ACCEPTED`, etc.) with timestamps, target UIDs, and token sanitization. |
| **Unbounded In-Memory Collections** | Admin endpoints called `.get()` on entire Firestore collections, risking memory exhaustion. | Implemented offset/limit pagination in backend services and React `Pagination` / `DataTable` controls in the frontend. |
| **CORS Policy** | No strict origin whitelist on APIs. | Implemented strict CORS whitelist matching the apex domain, `www`, and local dev origins. Blocked `Access-Control-Allow-Origin: *` on credentialed APIs. |
| **Missing Security Headers** | Express served without security response headers. | Integrated `helmet` with secure referrer policies, X-Frame-Options (`DENY`), and cross-origin policies. |
| **Frontend/Backend Coupling** | Server-rendered EJS tightly coupled templates with backend logic. | Completely refactored into a modern decoupled monorepo: React 18 + Vite SPA frontend talking purely via authenticated HTTPS REST APIs to Node.js backend. |
| **Missing Error & Loading UX** | Pages lacked loading indicators, network error handling, or field-level validation feedback. | Built reusable `Loader`, `ErrorState`, `EmptyState`, and `ToastContainer` components with disabled submit buttons during in-flight requests. |
| **Accessibility & Mobile Layout** | Incomplete viewport scaling and missing ARIA roles. | Built mobile-first responsive layout tested across 320px to 1920px viewports with keyboard focus rings, semantic HTML, and screen-reader tags. |
| **SEO Metadata** | Missing OpenGraph, Twitter cards, canonical tags, and structured JSON-LD. | Implemented full OpenGraph, Twitter card tags, `robots.txt`, XML `sitemap.xml`, and Google Event schema structured data. |
