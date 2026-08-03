# FixItNow — Frontend

A production-grade **Next.js 16 (App Router) + TypeScript** frontend for the FixItNow home-services
marketplace, consuming the [FixItNow backend API](https://fix-it-now-bd.vercel.app).

See [`API_INTEGRATION.md`](./API_INTEGRATION.md) for the full frontend-component ↔ backend-endpoint map.

---

## ⚠️ Admin login for testing

The admin account isn't created by this frontend — it's seeded on the **backend** via `npm run seed`,
using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` values set in the backend's own `.env` file (see the backend
`README.md` → _Admin Credentials_).

**Fill in the actual seeded values here before sharing/submitting this project:**

```
Admin email:    <put the ADMIN_EMAIL you configured on the backend here>
Admin password: <put the ADMIN_PASSWORD you configured on the backend here>
```

Log in at `/login` with these credentials to reach `/dashboard/admin`.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                            |
| ------------ | --------------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Turbopack, `proxy.ts` for route protection)   |
| Language     | TypeScript                                                            |
| Styling      | Tailwind CSS v4 + shadcn/ui (Radix primitives)                        |
| Server state | TanStack Query (React Query)                                          |
| Client state | Zustand (current-user cache only — JWT cookie is the source of truth) |
| Forms        | react-hook-form + zod                                                 |
| Payment      | SSLCommerz (redirect-based checkout)                                  |

## 📁 Project Structure

```
app/
├── (auth)/login, (auth)/register        # Public auth pages
├── (public)/services, (public)/technicians  # Public browse + detail pages
├── dashboard/
│   ├── customer/                        # Bookings, payments, profile
│   ├── technician/                      # Overview, bookings, services, availability, profile
│   └── admin/                           # Overview, users, categories, bookings, profile
├── payment/success | cancel | fail      # SSLCommerz redirect targets (verify real status via API)
├── unauthorized/                        # Shown when a role hits another role's dashboard
├── loading.tsx / error.tsx / not-found.tsx / global-error.tsx
components/
├── forms/        # react-hook-form + zod login/register forms
├── layout/       # Navbar, Footer
├── features/     # Cross-page feature components (e.g. payment-outcome verification)
├── shared/       # Reusable primitives (e.g. SimplePagination)
├── providers/    # React Query provider, auth hydration, toaster
└── ui/           # shadcn/ui primitives
hooks/            # useAuth, useDebouncedValue, etc.
lib/
├── api/          # One typed wrapper file per backend module — all requests go through client.ts
├── store/        # Zustand auth store
├── validations/  # zod schemas
├── avatar.ts     # Deterministic avatar/illustration URLs (see note below)
├── cookies.ts    # Token storage
└── types.ts      # Types mirroring the backend Prisma models/API envelope
proxy.ts          # Next.js 16's renamed middleware.ts — role-based route protection
```

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local
# NEXT_PUBLIC_API_URL এ ব্যাকএন্ড API URL বসাও (ডিফল্ট: প্রোডাকশন ব্যাকএন্ড)
npm run dev
```

Runs at `http://localhost:3000`.

```bash
npm run build   # production build
npm start       # run the production build
npm run lint    # ESLint
```

## 🔐 Environment Variables

| Key                   | Description                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Base URL of the FixItNow backend API (e.g. `https://fix-it-now-bd.vercel.app`) |

## 🖼️ On images / `next/image`

The backend's data model (`User`, `TechnicianProfile`, `Service`, `Category`) currently has **no image
upload fields at all** — there's no profile-picture or service-photo storage on the backend. To still
satisfy the "optimized images via `next/image`" requirement meaningfully rather than leaving the UI
without any imagery, `lib/avatar.ts` generates deterministic, license-free illustration URLs (via
DiceBear) from each user's/category's id or name, rendered through `next/image` (see
`next.config.ts` → `images.remotePatterns`). The same user always gets the same image, so the UI stays
stable across reloads. If the backend later adds a real photo-upload field (e.g. `avatarUrl`), only
`lib/avatar.ts`'s callers need to switch to that field — no other component needs to change.

## 🔑 Known limitations (see `API_INTEGRATION.md` for details)

- **Silent token refresh isn't wired up yet.** The access token is valid for 1 day; after that, the user
  is logged out gracefully (not silently broken) and asked to log in again. Wiring up
  `POST /api/auth/refresh-token` for silent refresh needs a small backend change (accepting the refresh
  token via the request body/header instead of only an httpOnly cookie), since this frontend uses
  cross-origin `Authorization: Bearer` tokens rather than shared cookies with the backend domain.
- **Admin bookings search** is client-side-only on the currently loaded page, because
  `GET /api/admin/bookings` doesn't accept a free-text `searchTerm` parameter today (only
  `status`/`page`/`limit`). Status filtering and pagination are fully server-side.
- **Booking time slots** are generated from each technician's saved weekly availability
  (`GET /api/technician/availability`) split into 1-hour blocks. The backend has no endpoint to report
  which slots are _already booked_ by other customers, so the UI can prevent booking outside a
  technician's declared working hours, but a last-mile double-booking check still relies on the backend's
  booking-creation validation.

## 🧪 Manual test checklist

1. Register as **Customer** → browse `/services` → open a technician → book a service → see it under
   `/dashboard/customer/bookings` as `REQUESTED`.
2. Register a second account as **Technician** → set availability → add a service → go to
   `/dashboard/technician/bookings` → Accept the request.
3. Back as Customer → `Pay Now` on the now-`ACCEPTED` booking → complete the SSLCommerz sandbox checkout →
   confirm you land on `/payment/success` showing a _verified_ `PAID` status, and that the booking list
   shows `PAID` without a reload.
4. Try navigating back to the same `/pay/[id]` URL after paying — confirm it now blocks re-payment instead
   of letting you pay twice.
5. As Technician → mark `IN_PROGRESS` → `COMPLETED`. As Customer → leave a review; confirm the review
   button disappears afterward.
6. Log in as **Admin** (see credentials above) → ban a user, create a category, page through
   `/dashboard/admin/users` and `/dashboard/admin/bookings`.

## 👤 Author

**Sahidul Islam**  
GitHub: [@Sahidulislam05](https://github.com/Sahidulislam05)
