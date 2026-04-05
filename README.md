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
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── nodemon.json
└── README.md
```



# Guest Management API Documentation

| Method | Endpoint | Auth Required | Roles Allowed | Description |
| :--- | :--- | :---: | :--- | :--- |
| **POST** | `/api/guests` | Yes | admin, manager, receptionist | Create a new guest |
| **GET** | `/api/guests` | Yes | admin, manager, receptionist | List guests (paginated, filterable) |
| **GET** | `/api/guests/:id` | Yes | admin, manager, receptionist | Get guest by ID |
| **GET** | `/api/guests/:id/bookings` | Yes | admin, manager, receptionist | Get guest with booking history |
| **PATCH** | `/api/guests/:id` | Yes | admin, manager, receptionist | Update guest details |
| **DELETE** | `/api/guests/:id` | Yes | **admin only** | Delete guest |