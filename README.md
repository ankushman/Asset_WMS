# Sankaj Logistics Limited - Enterprise Asset Tracker & Warehouse Management System (WMS)

A full-stack enterprise platform featuring decoupled **Next.js 15 (Frontend)** and **NestJS (Backend)** microservice architectures powered by **MongoDB Atlas** and **Mongoose ODM**.

---

## 🏗️ Project Architecture Overview

```text
Asset_WMS/
├── frontend/                 # Next.js 15 App Router Frontend Project
│   ├── src/                  # Components, Pages, State Store (Zustand), Hooks, UI
│   ├── public/               # Static Assets & Icons
│   ├── .env.local            # Frontend Environment Variables (API endpoints)
│   ├── package.json          # Frontend Dependencies (Next.js, React 19, Tailwind)
│   └── tsconfig.json         # Frontend TypeScript Configuration
│
├── backend/                  # NestJS REST Microservice Backend Project
│   ├── src/                  # Controllers, Services, Schemas, Guards, Filters
│   ├── .env                  # Backend Environment Variables (MongoDB URI, JWT Secret)
│   ├── package.json          # Backend Dependencies (NestJS, Mongoose, Passport JWT)
│   └── tsconfig.json         # Backend TypeScript Configuration
│
└── README.md                 # Project Setup & Developer Guide
```

---

## ⚙️ Environment Variables Setup

### 1. Backend Environment Setup (`backend/.env`)
Create `backend/.env` (see `backend/.env.example`):
```env
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ennea_wms?retryWrites=true&w=majority"
JWT_SECRET="sankaj_logistics_enterprise_secret_key_2026_super_secure"
JWT_EXPIRES_IN="7d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

### 2. Frontend Environment Setup (`frontend/.env.local`)
Create `frontend/.env.local` (see `frontend/.env.local.example`):
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_APP_NAME="Sankaj Logistics Limited WMS"
```

---

## 🚀 Running the Platform Locally

### Running the Backend Service
```bash
cd backend
npm install
npm run start:dev
```
- **Backend API Server**: Runs on `http://localhost:4000`
- **Swagger Documentation**: Available at `http://localhost:4000/api/docs`

### Running the Frontend App
```bash
cd frontend
npm install
npm run dev
```
- **Frontend Dashboard**: Accessible at `http://localhost:3000`

---

## 🔐 Enterprise Features Built-in

1. **MongoDB Atlas & Mongoose ODM**: Complete document models with automated indexing for fast search.
2. **Enterprise Approval Workflow Engine**: Multi-level maker-checker workflow visual designer, business rule engine, action modals, approval timelines, escalation logic, and notification bell system.
3. **Automated Audit Logging**: Captures state-changing API operations into the `audit_logs` collection with diff tracking, IP, and User Agent details.
4. **JWT Authentication & RBAC**: Passport JWT Bearer token authentication and fine-grained permissions matrix.
5. **Rate Limiting & Error Sanitization**: Throttled requests to prevent brute-force attacks and centralized exception filters to redact sensitive keys.
