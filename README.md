# Sakshi Tours & Travels - Fullstack Application

A complete fullstack travel booking application with Express.js backend and React frontend.

## Project Structure

```
sakshi_project/
├── backend/          # Express.js server with MongoDB
├── frontend/         # React (Vite) frontend
└── README.md         # This file
```

## Quick Start

### 1. Start Backend Server
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev           # Starts on http://localhost:5001
```

### 2. Start Frontend Application
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev           # Starts on http://localhost:5173
```

## Environment Configuration

### Backend (.env)
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5001/api
```

## Features

- **User Authentication**: Registration, login with JWT tokens
- **Package Management**: Browse and search travel packages
- **Booking System**: Create and manage bookings
- **Payment Integration**: Stripe payment processing
- **Admin Dashboard**: Manage users, packages, and bookings
- **Email Notifications**: OTP verification and booking confirmations
- **Review System**: Customer reviews and ratings
- **Inquiry Management**: Customer inquiries and support

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Nodemailer for emails
- Stripe for payments

### Frontend
- React 19 with Vite
- React Router for navigation
- Axios for API calls
- React Icons
- Stripe React components

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/packages` - Get all packages
- `POST /api/bookings` - Create booking
- `GET /api/admin/dashboard` - Admin dashboard data

## Development Notes

- Backend runs on port 5001
- Frontend runs on port 5173 (Vite default)
- MongoDB connection required for backend
- Use `--legacy-peer-deps` for frontend npm install due to React 19 compatibility

## Production Deployment

1. Configure production environment variables
2. Set up MongoDB Atlas or managed database
3. Configure CORS for production domains
4. Use secure JWT storage (httpOnly cookies)
5. Set up SSL certificates
6. Configure email service for production
