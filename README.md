# Ennea – Sangkaj | Enterprise Asset Management Tracker & Warehouse Management System (WMS)

Production-ready Phase 1 (MVP) platform built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, Recharts, and Zustand.

---

## Technical Stack & Architecture

### Frontend
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Navy/Royal Blue Dark & Light Enterprise Theme
- **State Management**: Zustand with persistent storage
- **UI Components**: Modern enterprise data tables, Recharts visualizations, Lucide icons, glassmorphism UI elements
- **Barcode & QR Generator**: Real-time SVG rendering and printable thermal label layouts

### Backend & Database
- **ORM**: Prisma ORM v6 with normalized PostgreSQL relational schema
- **Authentication**: JWT, bcryptjs password hashing, email login, Google SSO integration, 7-day session cookies
- **RBAC**: 8 Granular Roles (`SUPER_ADMIN`, `COMPANY_ADMIN`, `WAREHOUSE_MANAGER`, `SUPERVISOR`, `INVENTORY_EXECUTIVE`, `PICKER`, `PACKER`, `VIEWER`)
- **Microservices Option**: NestJS API architecture located in `/backend` directory for microservice separation on Railway/Render.

---

## Features & Modules

### 1. Landing Page
- Hero Section with interactive live WMS engine mockup
- Feature Grid (Warehouse Management, Asset Tracking, Inventory Control, RBAC, Inbound/Outbound Engines, Reports)
- Testimonials, FAQ Accordions, and Enterprise Footer

### 2. Role-Based Access Control (RBAC) & Dynamic Sidebar
- Dynamic sidebar navigation filtered strictly per user role
- Live Role Context Switcher in header for instant demo/verification
- Route protection middleware preventing unauthorized access

### 3. Executive Control Center & Recharts Analytics
- Real-time KPI stat cards (Warehouses, Assets, Stock Volume, Active Inbound/Outbound)
- Area Chart: Monthly Inventory Stock & Capacity Utilization Trend
- Horizontal Bar Chart: Warehouse Facility Occupancy Heatmap
- Dual Bar Chart: Weekly Inbound vs Outbound Operational Volumes
- Live activity stream log

### 4. Company & Warehouse Hub
- Super Admin CRUD for Company Entities (GST, Phone, Email, Address, Status, Warehouse Count)
- Multi-warehouse network CRUD with capacity meters, Sq Ft area, rental cost, working hours, and facility manager assignment

### 5. Asset Management & EAM Tracking
- Equipment categories: Forklift, Scanner, Printer, Laptop, Desktop, Generator, Camera, Tools, Furniture, Other
- Interactive QR & Barcode generator modal with instant print label capability
- Audit log trail tracking movement history, maintenance checks, and employee assignments

### 6. Inventory Control & Bin Location Register
- SKU tracking down to Rack, Shelf, and Bin locations
- Quantities tracking: Available, Reserved, Damaged, Min/Max stock thresholds
- Safety re-order alerts banner for low stock items

### 7. Visual Inbound Receiving Workflow Engine (9 Steps)
`Vehicle Reporting` -> `Dock Allocation` -> `Unload` -> `Inspection` -> `Counting` -> `GRN Generation` -> `Staging` -> `Put Away` -> `Completed`
- Operator assignment, timestamping, progress bars, and step remarks modal.

### 8. Visual Outbound Dispatch Workflow Engine (7 Steps)
`Invoice` -> `Picking` -> `Packing` -> `Staging` -> `Gate Pass` -> `Dispatch` -> `Completed`
- Picking strategies: Case, Batch, Loose, Pallet, Box.

### 9. Global Search Command Palette (`Ctrl+K`)
- Instant hotkey command menu searching across Assets, Warehouses, Inventory SKUs, and Users.

### 10. Enterprise Reports & Audit Center
- 1-click export to PDF, Microsoft Excel (.xlsx), and CSV for Assets, Inventory, Warehouses, and Inbound GRNs.

---

## Quick Start & Local Execution

### 1. Prerequisites
- Node.js v20+
- PostgreSQL (or Docker)

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Seeding (PostgreSQL)
```bash
# Push Prisma schema to database
npx prisma db push

# Seed sample enterprise data
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## Docker Deployment

To run both PostgreSQL database and Next.js WMS engine via Docker Compose:
```bash
docker-compose up --build -d
```

---

## Default Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@ennea.com` | `password123` |
| **Company Admin** | `deepak@sangkaj.com` | `password123` |
| **Warehouse Manager** | `rajesh.sharma@sangkaj.com` | `password123` |
| **Supervisor** | `priya.s@sangkaj.com` | `password123` |
| **Inventory Exec** | `amit.verma@sangkaj.com` | `password123` |
| **Picker** | `rohan.d@sangkaj.com` | `password123` |
| **Packer** | `suresh.p@sangkaj.com` | `password123` |
| **Viewer** | `viewer@ennea.com` | `password123` |
