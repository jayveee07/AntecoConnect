# ANTECO CONNECT

**Enterprise Digital Utility Management Platform** for Anteco Electric Cooperative — a complete multi-platform system for billing, payments, outage reporting, field operations, and utility analytics.

## 🏗 System Architecture

```
anteconect/
├── backend/              # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/    # API Controllers (Auth, Billing, Outage, etc.)
│   │   ├── Http/Middleware/          # Custom middleware
│   │   ├── Models/                   # Eloquent models
│   │   └── Services/                 # Business logic services
│   ├── database/migrations/          # 10 migration files (all core tables)
│   ├── routes/api.php                # 80+ API endpoints
│   └── config/                       # App configuration
│
├── mobile/
│   ├── consumer/                     # Flutter Consumer App
│   │   ├── lib/
│   │   │   ├── config/               # Theme, AppConfig
│   │   │   ├── models/               # User, Bill, Outage, Transaction, etc.
│   │   │   ├── services/             # API, Auth, Dashboard, Outage, etc.
│   │   │   ├── providers/            # State management (Auth, Dashboard, Theme)
│   │   │   ├── screens/              # 20+ screens
│   │   │   └── widgets/              # Reusable components
│   │   └── pubspec.yaml
│   │
│   └── technician/                   # Flutter Technician App
│       └── lib/
│           ├── main.dart             # Technician dashboard, work orders, meter reading
│           └── pubspec.yaml
│
└── web/
    ├── consumer/                     # React + Tailwind Consumer Portal
    │   ├── src/
    │   │   ├── components/           # Layout, shared components
    │   │   ├── pages/                # 10 pages
    │   │   └── index.css             # Tailwind styles
    │   └── package.json
    │
    └── admin/                        # React + Tailwind Admin Portal
        ├── src/
        │   ├── components/           # AdminLayout
        │   └── pages/                # 13 management pages
        └── package.json
```

## 🚀 Quick Start

### Backend (Laravel 12)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --host=0.0.0.0 --port=8000
```

### Flutter Mobile App

```bash
# Consumer App
cd mobile/consumer
flutter pub get
flutter run

# Technician App
cd mobile/technician
flutter pub get
flutter run
```

### React Web Portal

```bash
# Consumer Web Portal
cd web/consumer
npm install
npm run dev

# Admin Web Portal
cd web/admin
npm install
npm run dev
```

## 📱 Features by Platform

### Consumer Mobile App (Flutter)
| Module | Features |
|--------|----------|
| **Dashboard** | Welcome card, current bill, quick actions, consumption chart, alerts |
| **Billing** | Current bill, billing breakdown, billing history, PDF download |
| **Payments** | GCash, Maya, Bank Transfer, Credit Card, QR payment, transaction history |
| **Consumption** | Daily/weekly/monthly/yearly charts, AI forecast, saving tips |
| **Outages** | Report outage, track status, timeline, interruption notices |
| **Services** | New connection, reconnection, change ownership, status tracking |
| **Support** | Live chat, ticketing, FAQs, hotline access |
| **Profile** | Personal info, account details, settings |
| **Settings** | Dark/light mode, biometric login, notifications, password |

### Technician Mobile App (Flutter)
| Module | Features |
|--------|----------|
| **Dashboard** | Today's schedule, stats (assigned/pending/completed) |
| **Work Orders** | Accept, start, complete jobs, upload photos, capture signature |
| **Meter Reading** | Scheduled meters, submit readings, GPS validation, offline mode |

### Consumer Web Portal (React + Tailwind)
| Module | Features |
|--------|----------|
| **Dashboard** | Full overview with charts and KPIs |
| **Billing** | Detailed breakdown, history, PDF export |
| **Payments** | Multiple payment methods, history |
| **Consumption** | Interactive charts, AI forecast, saving tips |
| **Outages** | Report, track, view interruptions |
| **Services** | Apply for services, track status |
| **Support** | FAQs, ticketing, contact |

### Admin Web Portal (React + Tailwind)
| Module | Features |
|--------|----------|
| **Executive Dashboard** | Revenue trends, outage stats, KPI cards, activity feed |
| **Consumer Management** | CRUD, search, filter, status management |
| **User Management** | Roles, permissions, MFA status |
| **Billing Management** | Generate bills, adjustments, rebilling, rate config |
| **Payment Management** | Verify payments, collection reports |
| **Meter Reading** | Schedule, validate readings, GPS tracking |
| **Outage Management** | Track, assign teams, priority management |
| **Work Orders** | Create, assign, track field operations |
| **Service Requests** | Approve/reject applications |
| **Announcements** | Create and manage broadcast messages |
| **Reports** | Generate PDF/Excel/CSV reports |
| **GIS Mapping** | Consumer locations, poles, transformers, feeders |
| **Settings** | System config, security, API keys |

## 🗄 Database Schema (PostgreSQL)

**10 Migration Files** covering:
- `users` - Consumers, staff with roles and OTP
- `consumer_accounts` - Account/meter details, rates
- `bills` - Complete billing with breakdown
- `transactions` - Payments with gateway integration
- `outages` - Power interruption tracking
- `service_requests` - Connection applications
- `work_orders` - Field technician assignments
- `meter_reading_schedule` - Route-based reading plans
- `gis_tables` - Electric poles, transformers, feeders, service areas
- `consumption_data` - Historical usage with AI predictions
- `notifications` - Push, SMS, email campaigns
- `reports` - Generated report records
- `documents` - Polymorphic document storage

## 🔐 API Endpoints

**80+ RESTful endpoints** organized as:
- `POST /auth/*` - Registration, login, password reset, OTP
- `GET/PUT /profile` - User profile management
- `GET /dashboard` - Consumer dashboard data
- `GET/POST /bills`, `/payments`, `/consumption` - Billing operations
- `POST /outages/report`, `GET /outages/track/*` - Outage management
- `CRUD /service-requests`, `/support-tickets` - Service operations
- `GET /notifications` - Push notification history
- `POST /reports/generate` - Report generation
- `admin/*` - Full admin CRUD operations
- `technician/*` - Field operations API

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Consumer** | View bills, pay, report outages, service requests |
| **Cashier** | Process payments, generate receipts |
| **Meter Reader** | Submit readings, upload photos |
| **Field Technician** | Accept/complete work orders |
| **Supervisor** | Approve workflows, monitor teams |
| **Administrator** | Full system management |
| **General Manager** | Executive dashboards, analytics |

## 🎨 Design System

- **Primary**: `#0057B8` (Trustworthy Blue)
- **Accent**: `#FFC107` (Electric Yellow)
- **Dark Mode**: Deep grays with electric blue accents
- **Components**: Cards, badges, stats, charts, tables
- **Charts**: Recharts (Web) + fl_chart (Mobile)
- **Icons**: Lucide React (Web) + Material Icons (Mobile)

## 📊 AI Features

- Consumption forecast (next bill prediction)
- Peak usage analysis
- Energy saving recommendations
- Automated outage priority classification
- Revenue prediction for management

## 🔒 Security

- JWT authentication via Laravel Sanctum
- OTP verification for mobile
- Role-Based Access Control (RBAC)
- Multi-Factor Authentication ready
- Audit logging for all operations
- Data encryption at rest and in transit
- Session management with token rotation
