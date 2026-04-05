# Hotel Management System (Node.js + TypeScript + MongoDB)

## Setup

```bash
npm install
npm run dev
```

## Environment
Create a `.env` file:
```
PORT=5000
DB_URI=mongodb://127.0.0.1:27017/hotel_db
```
### PROJECT STRUCTURE
```json
hotel-management-system/
│
├── src/
│   ├── app.ts
│   ├── server.ts
│
│   ├── config/
│   │   ├── env.ts
│   │   ├── db.ts
│   │   ├── logger.ts
│   │   ├── redis.ts
│   │   └── constants.ts
│
│   ├── modules/
│   │
│   │   ├── auth/                      # 🔐 Authentication & Tokens
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.route.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── auth.utils.ts
│   │   │   └── auth.types.ts
│   │
│   │   ├── user/                      # 👨‍💼 Staff / Admin
│   │   │   ├── user.interface.ts
│   │   │   ├── user.model.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.route.ts
│   │   │   └── user.validation.ts
│   │
│   │   ├── guest/                     # 🧑‍🤝‍🧑 Customers (VERY IMPORTANT)
│   │   │   ├── guest.interface.ts
│   │   │   ├── guest.model.ts
│   │   │   ├── guest.service.ts
│   │   │   ├── guest.controller.ts
│   │   │   ├── guest.route.ts
│   │   │   └── guest.validation.ts
│   │
│   │   ├── hotel/                     # 🏨 Hotel / Branch
│   │   │   ├── hotel.interface.ts
│   │   │   ├── hotel.model.ts
│   │   │   ├── hotel.service.ts
│   │   │   ├── hotel.controller.ts
│   │   │   ├── hotel.route.ts
│   │   │   └── hotel.validation.ts
│   │
│   │   ├── room/                      # 🛏️ Rooms & Room Types
│   │   │   ├── room.interface.ts
│   │   │   ├── room.model.ts
│   │   │   ├── roomType.model.ts
│   │   │   ├── room.service.ts
│   │   │   ├── room.controller.ts
│   │   │   ├── room.route.ts
│   │   │   └── room.validation.ts
│   │
│   │   ├── booking/                   # 📅 Reservation Engine
│   │   │   ├── reservation.interface.ts
│   │   │   ├── reservation.model.ts   # ✅ fixed version (with overlap protection)
│   │   │   ├── stay.model.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.route.ts
│   │   │   ├── booking.validation.ts
│   │   │   └── booking.utils.ts
│   │
│   │   ├── pricing/                   # 💰 Dynamic Pricing Engine
│   │   │   ├── rate.model.ts
│   │   │   ├── pricing.service.ts
│   │   │   └── pricing.utils.ts
│   │
│   │   ├── billing/                   # 🧾 Invoice & Payments
│   │   │   ├── invoice.interface.ts
│   │   │   ├── invoice.model.ts
│   │   │   ├── payment.model.ts
│   │   │   ├── billing.service.ts
│   │   │   ├── billing.controller.ts
│   │   │   ├── billing.route.ts
│   │   │   └── billing.validation.ts
│   │
│   │   ├── service/                   # 🍽️ Add-ons (Spa, Food, etc.)
│   │   │   ├── service.interface.ts
│   │   │   ├── service.model.ts
│   │   │   ├── serviceUsage.model.ts
│   │   │   ├── service.service.ts
│   │   │   ├── service.controller.ts
│   │   │   └── service.route.ts
│   │
│   │   ├── housekeeping/              # 🧹 Cleaning operations
│   │   │   ├── housekeeping.model.ts
│   │   │   ├── housekeeping.service.ts
│   │   │   └── housekeeping.route.ts
│   │
│   │   ├── maintenance/               # 🛠️ Repairs & Issues
│   │   │   ├── maintenance.model.ts
│   │   │   ├── maintenance.service.ts
│   │   │   └── maintenance.route.ts
│   │
│   │   ├── analytics/                 # 📊 Reports & Metrics
│   │   │   ├── analytics.service.ts
│   │   │   └── analytics.controller.ts
│   │
│   │   └── common/                    # ♻️ Shared Core
│   │       ├── base.interface.ts
│   │       ├── auditLog.model.ts      # ✅ FIXED location
│   │       ├── enums.ts
│   │       ├── constants.ts
│   │       └── plugins/
│   │           ├── softDelete.plugin.ts
│   │           └── paginate.plugin.ts
│
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimit.middleware.ts
│
│   ├── routes/
│   │   └── index.ts
│
│   ├── utils/
│   │   ├── catchAsync.ts
│   │   ├── apiResponse.ts
│   │   ├── generateId.ts
│   │   ├── pagination.ts
│   │   ├── date.ts
│   │   └── logger.ts
│
│   ├── types/
│   │   └── express.d.ts
│
│   └── jobs/                         # ⏱️ Background Processing
│       ├── bookingCleanup.job.ts
│       ├── pricingSync.job.ts
│       └── report.job.ts
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── scripts/
│   ├── seed.ts
│   └── migrate.ts
│
├── docs/
│   ├── api.yaml
│   └── architecture.md
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```


# User & Authentication RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/auth/login` | No | - | Login, returns tokens |
| **POST** | `/api/auth/refresh` | No | - | Get new access token |
| **POST** | `/api/auth/logout` | Yes | any | Logout (no-op in JWT) |
| **GET** | `/api/users` | Yes | admin, manager | List users with pagination |
| **GET** | `/api/users/:id` | Yes | admin, manager, self | Get user by ID |
| **POST** | `/api/users` | Yes | admin, manager | Create new user |
| **PATCH** | `/api/users/:id` | Yes | admin, manager, self | Update user |
| **DELETE** | `/api/users/:id` | Yes | admin | Delete user |
| **POST** | `/api/users/change-password` | Yes | any (self) | Change own password |


# Guest RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/guests` | Yes | admin, manager, receptionist | Create a new guest |
| **GET** | `/api/guests` | Yes | admin, manager, receptionist | List guests (paginated, filterable) |
| **GET** | `/api/guests/:id` | Yes | admin, manager, receptionist | Get guest by ID |
| **GET** | `/api/guests/:id/bookings` | Yes | admin, manager, receptionist | Get guest with booking history |
| **PATCH** | `/api/guests/:id` | Yes | admin, manager, receptionist | Update guest details |
| **DELETE** | `/api/guests/:id` | Yes | **admin only** | Delete guest |



# Hotel RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/hotels` | Yes | admin only | Create a new hotel |
| **GET** | `/api/hotels` | Yes | admin, manager, receptionist | List hotels (paginated, filterable) |
| **GET** | `/api/hotels/:id` | Yes | admin, manager, receptionist | Get hotel by ID |
| **PATCH** | `/api/hotels/:id` | Yes | admin only | Update hotel details |
| **DELETE** | `/api/hotels/:id` | Yes | admin only | Delete hotel (checks dependencies) |



## Room Types RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/room-types` | Yes | admin, manager | Create room type |
| **GET** | `/api/room-types` | Yes | admin, manager, receptionist | List room types |
| **GET** | `/api/room-types/:id` | Yes | admin, manager, receptionist | Get room type by ID |
| **PATCH** | `/api/room-types/:id` | Yes | admin, manager | Update room type |
| **DELETE** | `/api/room-types/:id` | Yes | admin only | Delete room type |

---

## Rooms RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/rooms` | Yes | admin, manager | Create room |
| **GET** | `/api/rooms` | Yes | admin, manager, receptionist | List rooms (filterable) |
| **GET** | `/api/rooms/:id` | Yes | admin, manager, receptionist | Get room by ID |
| **PATCH** | `/api/rooms/:id` | Yes | admin, manager | Update room details |
| **DELETE** | `/api/rooms/:id` | Yes | admin only | Delete room (checks constraints) |
| **PATCH** | `/api/rooms/:id/status` | Yes | admin, manager, receptionist | Update room status (available, occupied, maintenance, cleaning) |
| **PATCH** | `/api/rooms/:id/housekeeping` | Yes | admin, manager, housekeeping | Update housekeeping status |


# Reservations RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/reservations` | Yes | admin, manager, receptionist | Create reservation (with overlap check) |
| **GET** | `/api/reservations` | Yes | admin, manager, receptionist | List reservations (filterable) |
| **GET** | `/api/reservations/:id` | Yes | admin, manager, receptionist | Get reservation details |
| **PATCH** | `/api/reservations/:id` | Yes | admin, manager | Update reservation (dates/rooms) |
| **DELETE** | `/api/reservations/:id` | Yes | admin only | Delete (only cancelled/no-show) |
| **POST** | `/api/reservations/:id/cancel` | Yes | admin, manager, receptionist | Cancel reservation |
| **POST** | `/api/reservations/:id/check-in` | Yes | admin, manager, receptionist | Check-in (creates Stay) |
| **POST** | `/api/reservations/:id/check-out` | Yes | admin, manager, receptionist | Check-out (closes Stay, triggers invoice) |


# Rates & Inventory RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/rates` | Yes | admin, manager | Create a single rate for a specific date |
| **POST** | `/api/rates/bulk` | Yes | admin, manager | Bulk create rates for a date range |
| **GET** | `/api/rates` | Yes | admin, manager, receptionist | List rates (filter by hotel, room type, date range) |
| **GET** | `/api/rates/:id` | Yes | admin, manager, receptionist | Get rate by ID |
| **PATCH** | `/api/rates/:id` | Yes | admin, manager | Update price, inventory, or active status |
| **DELETE** | `/api/rates/:id` | Yes | admin only | Delete a rate |


# Billing & Payments API Documentation

## Invoices RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/billing/invoices/generate/:reservationId` | Yes | admin, manager, receptionist | Generate invoice from reservation |
| **GET** | `/api/billing/invoices` | Yes | admin, manager, receptionist | List invoices (filterable) |
| **GET** | `/api/billing/invoices/:id` | Yes | admin, manager, receptionist | Get invoice with payments |
| **PATCH** | `/api/billing/invoices/:id` | Yes | admin, manager | Update invoice (due date, notes) |
| **POST** | `/api/billing/invoices/:id/cancel` | Yes | admin, manager | Cancel invoice |
| **DELETE** | `/api/billing/invoices/:id` | Yes | admin only | Delete invoice (if not paid) |

---

## Payments RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/billing/payments` | Yes | admin, manager, receptionist | Record a payment against invoice |
| **GET** | `/api/billing/payments` | Yes | admin, manager, receptionist | List payments (filterable) |
| **GET** | `/api/billing/payments/:id` | Yes | admin, manager, receptionist | Get payment details |
| **PATCH** | `/api/billing/payments/:id` | Yes | admin, manager | Update payment (status, ref) |
| **DELETE** | `/api/billing/payments/:id` | Yes | admin only | Delete payment |


# Services & Service Usages API Documentation

## Services RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/services` | Yes | admin, manager | Create a service |
| **GET** | `/api/services` | Yes | admin, manager, receptionist | List services (filter by hotel, category) |
| **GET** | `/api/services/:id` | Yes | admin, manager, receptionist | Get service by ID |
| **PATCH** | `/api/services/:id` | Yes | admin, manager | Update service details |
| **DELETE** | `/api/services/:id` | Yes | admin only | Delete service (if no usage exists) |

---

## Service Usages RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/services/usages` | Yes | admin, manager, receptionist | Add a service charge to a stay |
| **GET** | `/api/services/usages` | Yes | admin, manager, receptionist | List all service usages (paginated) |
| **GET** | `/api/services/usages/by-stay/:stayId` | Yes | admin, manager, receptionist | Get all usages for a specific stay |
| **GET** | `/api/services/usages/:id` | Yes | admin, manager, receptionist | Get a single usage by ID |
| **PATCH** | `/api/services/usages/:id` | Yes | admin, manager | Update quantity or usedAt |
| **DELETE** | `/api/services/usages/:id` | Yes | admin, manager | Delete a service usage |



# Housekeeping RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/housekeeping` | Yes | admin, manager | Create a new cleaning task |
| **GET** | `/api/housekeeping` | Yes | admin, manager, housekeeping, receptionist | List tasks (filter by status, priority, room) |
| **GET** | `/api/housekeeping/:id` | Yes | admin, manager, housekeeping, receptionist | Get task details |
| **PATCH** | `/api/housekeeping/:id` | Yes | admin, manager | Update task (assign, reschedule, notes) |
| **DELETE** | `/api/housekeeping/:id` | Yes | admin only | Delete a task |
| **POST** | `/api/housekeeping/:id/start` | Yes | admin, manager, housekeeping | Mark task as in progress, set startedAt |
| **POST** | `/api/housekeeping/:id/complete` | Yes | admin, manager, housekeeping | Complete task, update room housekeepingStatus |
| **POST** | `/api/housekeeping/:id/inspect` | Yes | admin, manager | Inspect completed task (pass/fail) |



# Maintenance RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/maintenance` | Yes | admin, manager, receptionist | Report a maintenance issue (sets room to maintenance) |
| **GET** | `/api/maintenance` | Yes | admin, manager, maintenance, receptionist | List issues (filter by status, priority, type) |
| **GET** | `/api/maintenance/:id` | Yes | admin, manager, maintenance, receptionist | Get issue details |
| **PATCH** | `/api/maintenance/:id` | Yes | admin, manager | Update issue (description, priority, notes) |
| **DELETE** | `/api/maintenance/:id` | Yes | admin only | Delete an issue (handles room status cleanup) |
| **POST** | `/api/maintenance/:id/assign` | Yes | admin, manager | Assign to maintenance staff, set status to `in_progress` |
| **POST** | `/api/maintenance/:id/resolve` | Yes | admin, manager, maintenance | Mark as resolved, record cost and notes |
| **POST** | `/api/maintenance/:id/close` | Yes | admin, manager | Close issue, revert room status to `available` if no other open issues |



# Analytics & Reports RESTful APIs

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **GET** | `/api/analytics/occupancy` | Yes | admin, manager | Occupancy report (daily/weekly/monthly) |
| **GET** | `/api/analytics/revenue` | Yes | admin, manager | Revenue breakdown (room vs service, tax, discount) |
| **GET** | `/api/analytics/dashboard` | Yes | admin, manager | Real-time KPI dashboard (ADR, RevPAR, occupancy, top services) |