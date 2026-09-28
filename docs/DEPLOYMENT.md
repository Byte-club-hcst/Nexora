# NEXORA 2026 — Production Deployment Guide

## 1. Domain Architecture
- **Frontend / Main Portal**: `https://nexora.tech` (and `https://www.nexora.tech`) deployed on **Vercel**
- **Backend REST API**: `https://api.nexora.tech` deployed on **Render**
- **Strict HTTPS** everywhere with automatic SSL/TLS termination.

---

## 2. Frontend Deployment (Vercel)

### Step 1: Connect Repository
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project** and import your Git repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables
In Vercel **Settings → Environment Variables**, add:
| Variable Name | Description | Example Value |
|---|---|---|
| `VITE_API_URL` | Production Backend URL | `https://api.nexora.tech` |
| `VITE_FIREBASE_API_KEY` | Client Web API Key | `your_web_api_key_here` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `your-project-id.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | `your-project-id.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `your_messaging_sender_id` |
| `VITE_FIREBASE_APP_ID` | App ID | `your_app_id` |

### Step 3: Domain Mapping
In Vercel **Settings → Domains**, add `nexora.tech` and `www.nexora.tech`. Configure your DNS provider with the CNAME / A records provided by Vercel.

---

## 3. Backend Deployment (Render)

### Option A: Using `render.yaml` (Recommended)
1. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Blueprint**.
2. Select your repository. Render will automatically detect `render.yaml` at the root.
3. Supply the environment values in the Render Web interface.

### Option B: Manual Web Service
1. Click **New +** → **Web Service**.
2. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
3. In **Environment Variables**, define:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render dynamically injects this, but default to 10000)
   - `FRONTEND_URL`: `https://nexora.tech,https://www.nexora.tech`
   - `FIREBASE_PROJECT_ID`: `your-firebase-project-id`
   - `FIREBASE_CLIENT_EMAIL`: `firebase-adminsdk-xxx@your-project-id.iam.gserviceaccount.com`
   - `FIREBASE_PRIVATE_KEY`: Private key string with converted `\n` newlines
   - `R2_ACCOUNT_ID`: Cloudflare Account ID
   - `R2_ACCESS_KEY_ID`: Cloudflare R2 Access Key
   - `R2_SECRET_ACCESS_KEY`: Cloudflare R2 Secret Access Key
   - `R2_BUCKET_NAME`: `nexora-2026-production`
   - `EMAIL_API_KEY`: Transactional email service API key

### Step 4: Custom Subdomain on Render
1. Under **Settings → Custom Domains**, add `api.nexora.tech`.
2. Add a `CNAME` record in your DNS manager:
   - Name: `api`
   - Value: `<your-render-subdomain>.onrender.com`

---

## 4. Cloudflare R2 Private Bucket Setup

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com), go to **R2**.
2. Click **Create Bucket** and name it (e.g. `nexora-2026-production`).
3. Ensure **Public Access is DISABLED** (keep the bucket strictly private).
4. Click **Manage R2 API Tokens** → **Create API Token**:
   - Permissions: **Object Read & Write**
   - Bucket: Apply to `nexora-2026-production`
5. Copy your:
   - **Account ID** (from the R2 overview page)
   - **Access Key ID**
   - **Secret Access Key**
6. Configure bucket CORS policy in Cloudflare R2:
```json
[
  {
    "AllowedOrigins": ["https://nexora.tech", "https://www.nexora.tech"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 5. Firebase Authentication & Firestore Setup

### 5.1 Service Account Generation
1. In the [Firebase Console](https://console.firebase.google.com), open **Project Settings** → **Service Accounts**.
2. Click **Generate new private key**.
3. Copy `project_id`, `client_email`, and `private_key` into backend environment variables.

### 5.2 Firestore Rules
Deploy the restrictive rules in `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // All operations enforced via Admin SDK backend
    }
  }
}
```

### 5.3 Seeding Admin Users
To grant an account administrator privileges:
```bash
# In backend directory
node scripts/makeAdmin.js admin@nexora.tech
```
This sets the trusted custom claim `{ role: "admin" }` on the user's Firebase token.
