# Sakshi Backend (Express + MongoDB)

Install:
1. cd backend
2. npm install

Setup:
- Copy .env.example to .env and set MONGO_URI and JWT_SECRET.

Run:
- npm run dev   (requires nodemon)
- or npm start

Notes:
- Endpoints:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/packages
  - POST /api/packages (admin)
  - GET /api/packages/:id
  - PUT /api/packages/:id (admin)
  - DELETE /api/packages/:id (admin)
  - POST /api/bookings (auth)
  - GET /api/bookings (auth)
