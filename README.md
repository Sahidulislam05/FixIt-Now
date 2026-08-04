# 🔧 FixItNow — Frontend

> A modern, production-ready **Next.js 16** frontend for a home service marketplace where customers can find trusted technicians, book services, complete online payments, and manage their bookings through role-based dashboards.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)
![React Query](https://img.shields.io/badge/TanStack_Query-React_Query-FF4154?logo=react-query)
![License](https://img.shields.io/badge/Status-Assignment-success)

---

## 🌐 Live Demo

- **Frontend:** https://fix-it-now-delta.vercel.app
- **Backend API:** https://fix-it-now-bd.vercel.app
- **Backend Repository:** https://github.com/Sahidulislam05/FixItNow-Server

---

# 📖 Overview

FixItNow is a full-featured home service marketplace built with **Next.js App Router**, **TypeScript**, and modern React best practices.

Customers can browse available services, find technicians, create bookings, complete online payments, and leave reviews.

Technicians can manage their profile, services, availability schedule, and booking requests.

Admins can manage users, categories, and monitor the entire platform from a centralized dashboard.

This frontend consumes the REST API built in the previous backend assignment.

---

# ✨ Features

## 🌍 Public Features

- Responsive landing page
- Featured services
- Featured technicians
- Browse all services
- Search services
- Filter by
  - Category
  - Location
  - Rating
  - Price
- Technician profile page
- Booking interface
- Responsive navigation
- Skeleton loading UI
- Error boundaries
- Custom 404 page

---

## 👤 Authentication

- User Registration
- Login
- JWT Authentication
- Role-based authorization
- Protected routes
- Route protection using **Next.js proxy.ts**
- Persistent authentication
- Automatic logout on expired token

---

## 👥 Customer Dashboard

- Dashboard overview
- Booking history
- Booking details
- Cancel eligible bookings
- Payment history
- Online payment
- SSLCommerz integration
- Review submission
- Profile management

---

## 🛠 Technician Dashboard

- Dashboard overview
- Earnings summary
- Booking management
- Accept bookings
- Decline bookings
- Start jobs
- Complete jobs
- Service management
- Availability scheduler
- Profile management

---

## 👑 Admin Dashboard

- Dashboard overview
- Platform statistics
- User management
- Ban / Unban users
- Booking management
- Category management
- Pagination
- Search users

---

# 🎯 Booking Flow

```text
Customer
    │
    ▼
Browse Services
    │
    ▼
Select Technician
    │
    ▼
Choose Time Slot
    │
    ▼
Booking Requested
    │
    ▼
Technician Accepts
    │
    ▼
Customer Pays
    │
    ▼
Job Starts
    │
    ▼
Completed
    │
    ▼
Leave Review
```

---

# 👥 User Roles

## Customer

- Browse services
- Book technicians
- Pay online
- Track bookings
- Leave reviews

---

## Technician

- Create services
- Manage availability
- Accept bookings
- Update booking status
- View earnings

---

## Admin

- Manage users
- Manage categories
- Monitor bookings
- Platform overview

---

# 🛠 Tech Stack

| Category         | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS v4         |
| UI Library       | shadcn/ui               |
| State Management | Zustand                 |
| Server State     | TanStack Query          |
| Forms            | React Hook Form         |
| Validation       | Zod                     |
| Authentication   | JWT                     |
| Payment          | SSLCommerz              |
| HTTP Client      | Fetch API               |
| Notifications    | Sonner                  |
| Icons            | Lucide React            |

---

# 📁 Project Structure

```text
app
├── (auth)
│   ├── login
│   └── register
│
├── (public)
│   ├── services
│   └── technicians
│
├── dashboard
│   ├── admin
│   ├── customer
│   └── technician
│
├── payment
│   ├── success
│   ├── cancel
│   └── fail
│
├── loading.tsx
├── error.tsx
├── global-error.tsx
└── not-found.tsx

components
├── features
├── forms
├── layout
├── providers
├── shared
└── ui

hooks

lib
├── api
├── store
├── validations
├── avatar.ts
├── cookies.ts
└── types.ts

proxy.ts
```

---

# 🔌 Backend API

Base URL

```text
https://fix-it-now-bd.vercel.app
```

For the complete endpoint mapping, see

```text
API_INTEGRATION.md
```

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone https://github.com/Sahidulislam05/FixIt-Now
```

```bash
cd FixIt-Now
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create

```text
.env.local
```

Add

```env
NEXT_PUBLIC_API_URL=https://fix-it-now-bd.vercel.app
```

---

## 4. Run Development Server

```bash
npm run dev
```

Application will run at

```
http://localhost:3000
```

---

# 📦 Production Build

```bash
npm run build
```

```bash
npm start
```

---

# 🧪 Lint

```bash
npm run lint
```

---

# 🔐 Environment Variables

| Variable            | Description     |
| ------------------- | --------------- |
| NEXT_PUBLIC_API_URL | Backend API URL |

---

# 🔒 Route Protection

This project uses **Next.js 16 `proxy.ts`** for route protection.

Protected routes include:

- Customer Dashboard
- Technician Dashboard
- Admin Dashboard

Unauthorized users are redirected automatically.

---

# 💳 Payment

Payment is integrated using **SSLCommerz**.

Flow

```text
Booking
    ↓
Technician Accepts
    ↓
Customer Pays
    ↓
SSLCommerz
    ↓
Success / Cancel / Fail
    ↓
Booking Updated
```

---

# 🖼 Images

The current backend does not provide image upload support.

To keep the UI visually consistent while still using `next/image`, the application generates deterministic avatars using **DiceBear**.

This allows:

- Optimized images
- Stable UI
- No placeholder duplication
- Easy migration to real uploaded images later

---

# ⚠ Known Limitations

## Silent Token Refresh

Currently not implemented.

Access tokens expire after one day.

The frontend logs users out gracefully and redirects them to login.

---

## Booking Slot Validation

The backend does not expose booked time slots.

Available slots are generated from technician availability.

Final booking validation happens on the backend.

---

## Admin Booking Search

Search is currently client-side for the loaded page because the backend does not yet expose a free-text search endpoint.

---

# 🧪 Manual Testing Checklist

## Customer

- Register
- Login
- Browse services
- Create booking
- Cancel booking
- Complete payment
- Leave review

---

## Technician

- Register
- Create profile
- Add services
- Set availability
- Accept booking
- Complete booking

---

## Admin

- Login
- View statistics
- Ban user
- Unban user
- Create category
- Browse bookings

---

# 👨‍💻 Admin Login (Testing)

The admin account is seeded from the backend.

Before sharing this project, replace the placeholders below with the credentials configured in your backend `.env`.

```text
Admin Email:
<ADMIN_EMAIL>

Admin Password:
<ADMIN_PASSWORD>
```

Login from

```text
/login
```

---

# 👨‍💻Author

**Sahidul Islam**  
GitHub: [@Sahidulislam05](https://github.com/Sahidulislam05)

---
