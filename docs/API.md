# NEXORA 2026 — REST API Documentation

Base URL (Production): `https://api.nexora.tech`  
Base URL (Local Development): `http://localhost:5000`

All endpoints return standardized JSON structures:
```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable confirmation"
}
```
or on error:
```json
{
  "success": false,
  "message": "Specific error description",
  "errors": []
}
```

---

## 1. Authentication & User Profile
Header required for protected endpoints: `Authorization: Bearer <Firebase_ID_Token>`

### `POST /api/auth/complete-signup`
- **Auth**: Required
- **Body**: `{ "name": "string", "college": "string", "phone": "string" }`
- **Response**: `201 Created` with created profile document.

### `GET /api/auth/me`
- **Auth**: Required
- **Response**: `200 OK` with user profile, verified email status, and custom role claim (`participant` or `admin`).

---

## 2. Event Configuration & Public Metadata

### `GET /api/event/config`
- **Auth**: Public
- **Response**: Dynamic conference dates (UTC ISO-8601), fee amount, deadlines, venue, registration/submission open statuses.

### `GET /api/event/announcements`
- **Auth**: Public
- **Response**: Array of published announcements sorted chronologically.

### `GET /api/tracks`
- **Auth**: Public
- **Response**: List of 5 official research tracks with scopes and recommended topics.

### `GET /health`
- **Auth**: Public
- **Response**: `{ "status": "healthy", "timestamp": "...", "service": "nexora-2026-api" }`

---

## 3. Participant Registration & Payment

### `POST /api/registration`
- **Auth**: Required (Participant)
- **Body**: `{ "name": "string", "college": "string", "phone": "string", "track": "string" }`
- **Safety**: Atomic Firestore transaction prevents duplicate registrations or race conditions.
- **Response**: `201 Created` with registration object.

### `GET /api/registration/me`
- **Auth**: Required (Participant)
- **Response**: Caller's own registration details, payment status, and authorized signed URL for payment proof (if uploaded).

### `POST /api/registration/payment-proof`
- **Auth**: Required (Participant)
- **Content-Type**: `multipart/form-data`
- **File field**: `proof` (JPEG/PNG only, max 5MB, binary signature verified)
- **Action**: Uploads file to private Cloudflare R2 bucket at `payment-proofs/{uid}/{uuid}.{ext}`, updates status to `Pending Verification`.
- **Response**: `200 OK` with short-lived pre-signed URL.

---

## 4. Abstract & Poster Submission

### `POST /api/submission`
- **Auth**: Required (Participant)
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `title`: string
  - `track`: string (valid track name)
  - `abstract`: string (~150 words)
  - `keywords`: string (comma-separated)
  - `authors`: JSON string array of 1 to 4 author objects `[{ name, course, branch, year }]`
  - `abstractFile`: PDF file (max 10MB, `%PDF` signature verified)
  - `posterFile`: PDF/PNG/JPEG file (max 10MB, binary signature verified)
- **Safety**: Validates registration exists, checks dynamic deadline from `eventConfig`, and executes an atomic Firestore transaction.
- **Response**: `201 Created` with submission record.

### `GET /api/submission/me`
- **Auth**: Required (Participant)
- **Response**: Caller's submission with evaluation status, committee comments, and pre-signed URLs.

---

## 5. Administrative Management (Admin Role Required)
All `/api/admin/*` endpoints strictly require `Authorization: Bearer <token>` where token contains verified Firebase custom claim `{ "role": "admin" }`.

### `GET /api/admin/dashboard`
- Returns aggregate conference analytics: total registrations, payment breakdown (verified, pending, rejected), submission breakdown (accepted, under review, rejected), track distribution, and total fee revenue.

### `GET /api/admin/registrations`
- Query parameters: `?status=...&search=...&limit=20&offset=0`
- Returns paginated list of registrations with total count and hasMore flag.

### `PATCH /api/admin/registrations/:id/verify`
- Body: `{ "status": "Verified | Rejected", "reason": "optional reason string" }`
- Updates registration status, triggers automated transactional email, and logs `PAYMENT_VERIFIED` or `PAYMENT_REJECTED` in auditLogs.

### `GET /api/admin/submissions`
- Query parameters: `?track=...&status=...&search=...&limit=20&offset=0`
- Returns paginated submissions with author rosters.

### `PATCH /api/admin/submissions/:id/review`
- Body: `{ "status": "Accepted | Rejected", "feedback": "string" }`
- Updates submission status and `round2Eligible`, dispatches email notification, and records `SUBMISSION_ACCEPTED` or `SUBMISSION_REJECTED` in auditLogs.

### `GET /api/admin/participant/:uid`
- Returns full participant dossier: registration, payment proof signed URL, submission metadata, and file signed URLs. Records `FILE_ACCESSED` in auditLogs.

### `GET /api/admin/participant/:uid/file-url?fileType=payment-proof|abstract|poster`
- Generates a short-lived (60 min) pre-signed URL for any participant document.

### `GET /api/admin/audit-logs`
- Query parameters: `?limit=50&offset=0`
- Returns chronological audit records with sensitive token redaction.

### `PUT /api/admin/event-config`
- Body: Updated eventConfig properties (deadlines, fee amount, registration open/closed). Emits `EVENT_CONFIG_UPDATED` in auditLogs.

### `POST /api/admin/announcements`
- Body: `{ "title": "string", "content": "string", "priority": "normal|urgent", "category": "general|deadline" }`
- Emits `ANNOUNCEMENT_CREATED` in auditLogs.

### `DELETE /api/admin/announcements/:id`
- Deletes announcement and emits `ANNOUNCEMENT_DELETED` in auditLogs.
