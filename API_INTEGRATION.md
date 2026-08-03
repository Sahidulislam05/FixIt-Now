# API Integration Map — FixItNow Frontend

This document maps every frontend component/page to the backend endpoint(s) it consumes.
Backend base URL is read from `NEXT_PUBLIC_API_URL` (see `.env.example`), pointing to
`https://fix-it-now-bd.vercel.app` by default.

All requests go through a single wrapper — `lib/api/client.ts` (`apiRequest`) — which:

- Attaches `Authorization: Bearer <accessToken>` automatically when `auth` isn't set to `false`.
- Normalizes every backend error into a single `ApiError` (`message`, `statusCode`, `issues[]`).
- On `401` from an authenticated call, clears tokens and redirects to `/login` (session-expiry handling).

Each `lib/api/*.ts` file is a thin, typed wrapper around one backend module — pages never call `fetch` directly.

---

## Auth — `lib/api/auth.ts`

| Frontend                                                               | Backend endpoint               | Notes                                                                                                                                                           |
| ---------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/forms/login-form.tsx` → `useLogin()` (`hooks/use-auth.ts`) | `POST /api/auth/login`         | On success, stores `accessToken`/`refreshToken` in cookies (`lib/cookies.ts`), fetches `/api/users/me`, redirects by role.                                      |
| `components/forms/register-form.tsx` → `useRegister()`                 | `POST /api/users/register`     | Role is limited to `CUSTOMER`/`TECHNICIAN` in the UI (zod schema `lib/validations/auth.ts`) — matches backend rule that admins are seeded, not self-registered. |
| _(scaffolded, not yet wired)_                                          | `POST /api/auth/refresh-token` | See **Known limitation** below.                                                                                                                                 |
| `hooks/use-auth.ts` → `useLogout()`                                    | — (client-side only)           | Clears cookies + React Query cache, redirects to `/login`.                                                                                                      |

## Users — `lib/api/users.ts`

| Frontend                                                                                                                       | Backend endpoint            |
| ------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| `components/providers/auth-hydration.tsx`, `hooks/use-auth.ts` (`useCurrentUser`)                                              | `GET /api/users/me`         |
| `app/dashboard/customer/profile/page.tsx`, `app/dashboard/technician/profile/page.tsx`, `app/dashboard/admin/profile/page.tsx` | `PUT /api/users/my-profile` |

## Categories — `lib/api/categories.ts`, `lib/api/admin.ts`

| Frontend                                                                                 | Backend endpoint                                                                             |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Home page, `app/(public)/services/page.tsx` (filter sidebar)                             | `GET /api/categories`                                                                        |
| `app/dashboard/technician/services/page.tsx` (category select in Add/Edit Service modal) | `GET /api/categories`                                                                        |
| `app/dashboard/admin/categories/page.tsx`                                                | `GET /api/admin/categories`, `POST /api/admin/categories`, `PATCH /api/admin/categories/:id` |

## Technicians — `lib/api/technicians.ts`

| Frontend                                                           | Backend endpoint                                                       |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `app/(public)/technicians/page.tsx` (paginated + debounced search) | `GET /api/technicians?searchTerm=&page=&limit=`                        |
| `app/(public)/technicians/[id]/page.tsx`                           | `GET /api/technicians/:id`                                             |
| `app/dashboard/technician/profile/page.tsx`                        | `PUT /api/technician/profile`                                          |
| `app/dashboard/technician/availability/page.tsx`                   | `GET /api/technician/availability`, `PUT /api/technician/availability` |

## Services — `lib/api/services.ts`

| Frontend                                                                                            | Backend endpoint                                                                                             |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Home page (featured), `app/(public)/services/page.tsx` (search/category/price filters + pagination) | `GET /api/services?searchTerm=&categoryId=&minPrice=&maxPrice=&page=&limit=`                                 |
| `app/(public)/services/[id]/page.tsx`                                                               | `GET /api/services/:id`                                                                                      |
| `app/dashboard/technician/services/page.tsx`                                                        | `GET /api/services/my-services`, `POST /api/services`, `PATCH /api/services/:id`, `DELETE /api/services/:id` |

## Bookings — `lib/api/bookings.ts`, `lib/api/admin.ts`

| Frontend                                                            | Backend endpoint                                                                                                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `app/(public)/technicians/[id]/page.tsx` (booking form)             | `POST /api/bookings`                                                                                                            |
| `app/dashboard/customer/bookings/page.tsx` (paginated)              | `GET /api/bookings?page=&limit=`                                                                                                |
| `app/dashboard/customer/bookings/[id]/pay/page.tsx`                 | `GET /api/bookings/:id`                                                                                                         |
| `app/dashboard/customer/bookings/page.tsx` ("Cancel" action)        | `PATCH /api/bookings/:id/cancel`                                                                                                |
| `app/dashboard/technician/bookings/page.tsx`                        | `GET /api/technician/bookings`, `PATCH /api/technician/bookings/:id` (Accept/Decline/Start/Complete)                            |
| `app/dashboard/technician/page.tsx` (overview stats)                | `GET /api/technician/bookings`                                                                                                  |
| `app/dashboard/admin/bookings/page.tsx` (status filter + paginated) | `GET /api/admin/bookings?status=&page=&limit=`                                                                                  |
| `app/dashboard/admin/page.tsx` (platform stats)                     | `GET /api/admin/users`, `GET /api/admin/bookings` (multiple filtered/`limit:1` calls, reading `meta.total` for accurate counts) |

## Payments — `lib/api/payments.ts`

| Frontend                                                                                              | Backend endpoint                 | Notes                                                                                                                                                                                                                   |
| ----------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/dashboard/customer/bookings/[id]/pay/page.tsx`                                                   | `POST /api/payments/create`      | Only enabled while `booking.status === "ACCEPTED"` (guards against duplicate payment attempts — see **Payment safety** below). Redirects to the returned `gatewayPageURL`.                                              |
| `app/dashboard/customer/payments/page.tsx` (paginated)                                                | `GET /api/payments?page=&limit=` |
| `app/payment/success`, `/payment/cancel`, `/payment/fail` (`components/features/payment-outcome.tsx`) | `GET /api/bookings/:id`          | Re-fetches the booking by ID (passed back by the gateway redirect as `bookingId`/`booking_id`/`tran_id`) to confirm the **real** status rather than trusting the redirect URL alone. Polls briefly if still `ACCEPTED`. |
| —                                                                                                     | `POST /api/payments/confirm`     | Called server-to-server by SSLCommerz directly, never from the frontend (per backend design — see root `README.md`).                                                                                                    |

## Reviews — `lib/api/reviews.ts`

| Frontend                                                                                                                                | Backend endpoint    |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `app/dashboard/customer/bookings/page.tsx` (review modal, only shown when `booking.status === "COMPLETED"` and no `booking.review` yet) | `POST /api/reviews` |

## Admin — `lib/api/admin.ts`

| Frontend                                                              | Backend endpoint                                                                                |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `app/dashboard/admin/users/page.tsx` (search/role filter + paginated) | `GET /api/admin/users?searchTerm=&role=&page=&limit=`, `PATCH /api/admin/users/:id` (ban/unban) |
| `app/dashboard/admin/categories/page.tsx`                             | `GET/POST /api/admin/categories`, `PATCH /api/admin/categories/:id`                             |
| `app/dashboard/admin/bookings/page.tsx`                               | `GET /api/admin/bookings?status=&page=&limit=`                                                  |

---

## Route protection

`proxy.ts` (Next.js 16's renamed `middleware.ts` — same mechanism, new file/export name) runs on every
`/dashboard/*`, `/login`, `/register` request:

- No/expired token on a `/dashboard/*` route → redirect to `/login?redirectTo=...`.
- Wrong-role token on another role's dashboard prefix → redirect to `/unauthorized`.
- Already logged in and visiting `/login` or `/register` → redirect to that role's dashboard.

This is an **optimistic, UX-level check only** (decodes the JWT client-side without verifying the signature,
since that's not safe/necessary on the edge). The backend's own auth middleware remains the actual
authorization boundary for every API call — the frontend never trusts the token payload for anything
security-sensitive.

## Payment safety (double-payment prevention)

1. `/dashboard/customer/bookings/[id]/pay` only renders the "Pay" button when the fetched booking's
   `status === "ACCEPTED"`. Any other status (already `PAID`, `CANCELLED`, etc.) shows a blocked state
   with an explanation instead of a payment button.
2. A `useRef`-based submit lock (synchronous, unlike React state) prevents a fast double-click from firing
   `createPayment` twice before the redirect happens.
3. The bookings list only ever shows a "Pay Now" link for `ACCEPTED` bookings — once the booking flips to
   `PAID` (confirmed server-to-server by SSLCommerz), the link disappears everywhere.
4. `/payment/success` no longer assumes success from the URL — it re-fetches the booking and only shows a
   success state once the booking is verifiably `PAID`/`IN_PROGRESS`/`COMPLETED`.

The backend is still the final authority: even if a user bypasses the UI (e.g., replays an old request),
`POST /api/payments/create` must independently reject creating a second payment for a non-`ACCEPTED`
booking. This frontend guard is defense-in-depth for UX, not a substitute for that server-side check.

## Known limitation — access token refresh

`lib/api/auth.ts` has a scaffolded `refreshAccessToken()` that isn't wired into the request flow yet.
The app currently uses cross-origin `Authorization: Bearer` tokens (not cookies sent to the backend),
while the backend's `/api/auth/refresh-token` route reads the refresh token from an httpOnly cookie on
its own domain — which never reaches it in this architecture. Today, the 1-day access token simply expires
and the user is logged out gracefully (see `lib/api/client.ts`'s 401 handling) rather than silently failing.
To support silent refresh, the backend route would need to also accept the refresh token via the request
body/header, matching the Bearer-token pattern used everywhere else.
