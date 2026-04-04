# SkillSync Internship Platform

SkillSync is a full-stack internship matching platform for students and admins.
Students can register and view internship matches based on their skills, and admins can manage internships and users through dedicated dashboards.

## Overview

- Frontend: React + React Router + Tailwind/CSS
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT-based role-aware authorization
- Roles: `Student`, `Admin`

## Key Features

- User registration and login
- Role-based dashboards for students and admins
- Internship CRUD management (add, update, delete, list)
- Skill-based internship suggestion engine
- Admin Users Dashboard with update/delete workflows
- Admin password confirmation for sensitive user operations
- Validation for user and internship fields on frontend and backend
- Last login tracking (`lastLoginAt`)

## Project Structure

```text
skillsync-internship-platform/
├── Backend/
│   ├── App.js
│   ├── Controllers/
│   │   ├── InternshipControllers.js
│   │   └── UserControllers.js
│   ├── Middleware/
│   │   └── authMiddleware.js
│   ├── Models/
│   │   ├── InternshipModel.js
│   │   └── UserModel.js
│   └── Routes/
│       ├── InternshipRoutes.js
│       └── UserRoutes.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── Components/
│       ├── Pages/
│       └── Utils/
└── README.md
```

## API Endpoints

Base URL: `http://localhost:5000`

### User Routes (`/users`)

- `POST /users/register` - Register user
- `POST /users/login` - Login user and return JWT
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by id
- `PUT /users/:id` - Update user (admin only + admin password required)
- `DELETE /users/:id` - Delete user (admin only + admin password required)
- `POST /users` - Add user (legacy/create route)

### Internship Routes (`/internships`)

- `GET /internships` - Get all internships
- `POST /internships` - Add internship
- `PUT /internships/:id` - Update internship
- `DELETE /internships/:id` - Delete internship
- `GET /internships/suggestions/:userId` - Get matched internships for a user

## Validation Rules (Implemented)

### User Validation

- `fullName`: required, cannot contain numbers
- `gmail`: required, must start with a letter, valid email format
- `password`: required, minimum 6 characters
- `age`: required, must be between 16 and 60
- `address`: required, cannot be only numbers
- `phoneNo`: required, exactly 10 digits, leading zero allowed
- `skills`: optional, if provided cannot be only numbers
- `education`: required, cannot be only numbers
- `experience`: required, cannot be only numbers

### Internship Validation

- `title`: required, cannot start with a number, must include letters
- `company`: required, cannot start with a number, must include letters
- `location`: required, cannot start with a number, must include letters
- `duration`: required
- `skillsRequired`: required, cannot start with a number, must include letters
- `deadline`: required, must be a future date

## Local Setup

### Prerequisites

- Node.js 18+
- npm 9+
- MongoDB Atlas (or local MongoDB)

### 1. Install Dependencies

From project root:

```bash
npm install
```

Install backend and frontend dependencies:

```bash
cd Backend
npm install

cd ../frontend
npm install
```

### 2. Configure Backend

Current backend connection is defined directly in `Backend/App.js`.
Recommended improvement: move secrets and DB URL to `.env`.

Example `.env` for backend:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 3. Run the App

Run backend:

```bash
cd Backend
npm start
```

Run frontend in a second terminal:

```bash
cd frontend
npm start
```

Frontend default: `http://localhost:3000`  
Backend default: `http://localhost:5000`

## Scripts

### Backend (`Backend/package.json`)

- `npm start` - Run backend with nodemon

### Frontend (`frontend/package.json`)

- `npm start` - Run CRA dev server
- `npm dev` - Run Vite dev server
- `npm build` - Build (Vite)
- `npm test` - Run tests

## Security Notes

- Passwords are currently compared/stored as plain text in this codebase.
- Before production, implement `bcrypt` hashing and stronger auth hardening.
- Move hardcoded secrets (DB URL, JWT secret fallbacks) to environment variables.

## Known Improvements

- Add centralized auth middleware usage for all protected routes
- Add proper pagination/filtering for large user/internship lists
- Add automated tests for API and UI flows
- Add `.env.example` for easier setup

## Author

- Tharuki
- Harindie
- Shashini
- Ayesha

