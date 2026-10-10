# CampusMart

A simple, full-stack campus-only marketplace built with MongoDB, Express, React and Node.js. It is designed to be easy for college students and open-source contributors to understand.

## Features
- College-email registration (`@rbunagpur.in` by default)
- JWT authentication and protected routes
- Create, edit, delete and mark listings as sold
- Multiple image uploads with Multer
- Backend-powered search, filters, sorting and pagination
- Seller contact by college email
- Listing reports and basic admin moderation
- Responsive UI with loading, empty and error states

## Structure
```text
campus-marketplace/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/    # Reusable UI
│       ├── context/        # Authentication state
│       ├── pages/          # Route-level screens
│       └── services/       # Axios/API layer
├── server/                 # Express + MongoDB backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
└── README.md
```

## Prerequisites
- Node.js 20+
- MongoDB Atlas or local MongoDB

## Run backend
```bash
cd server
npm install
copy .env.example .env
npm run dev
```
Set `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` in `.env`.

## Run frontend
```bash
cd client
npm install
copy .env.example .env
npm run dev
```

## API
Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
Listings: `GET/POST /api/items`, `GET/PUT/DELETE /api/items/:id`, `PATCH /api/items/:id/sold`, `GET /api/items/my-listings`
Reports: `POST /api/reports`; admin report routes are under `/api/admin`.

## Admin
For local development, create a normal account first, then set its `isAdmin` field to `true` in MongoDB Atlas. Do not expose an admin-registration route.

## Deployment
Frontend is prepared for Vercel and backend for Render. Set `VITE_API_URL` on Vercel to the deployed Render `/api` URL. Set `CLIENT_URL` on Render to the Vercel URL. MongoDB Atlas is used through `MONGO_URI`.

### Uploads note
Local `server/uploads` storage is suitable for development. Render's filesystem is not intended as permanent image storage, so move uploads to Cloudinary or another object-storage provider before relying on persistent production images. The controller already stores URL-like paths so the storage layer can be replaced later.

## Open-source contribution opportunities
1. **Saved searches / favorites** — add a Favorite model and favorite toggle for listings.
2. **Price-range quick filters** — add preset buttons such as Under ₹500 / ₹1,000 / ₹5,000 with backend query parameters.
3. **Seller rating** — add a small post-sale rating model and seller summary after an item is sold.
4. **Cloud image storage** — replace the local Multer destination with Cloudinary while keeping the existing listing API contract.

Each opportunity should be implemented as a separate issue/PR with tests and README documentation.

## Contributing
1. Fork the repository.
2. Create a focused branch.
3. Run both client and server locally.
4. Make one isolated change.
5. Test authentication, API behavior and responsive UI as relevant.
6. Open a PR describing what changed and how it was tested.

Please avoid unrelated formatting changes and large rewrites.
