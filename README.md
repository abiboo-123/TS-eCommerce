# 🛒 eCommerce Backend (TypeScript, Node.js, MongoDB)

This is a modular, scalable backend API for an eCommerce platform built using **Node.js**, **TypeScript**, and **MongoDB**.

## ✅ Features Completed

### 🔐 Authentication Module

- Register (with role: consumer | business)
- Login with JWT (access + refresh token)
- Logout
- Refresh Token
- Change Password
- Forgot Password with OTP verification
- Reset Password with OTP
- Role-based route protection (business, consumer)

### 🧪 Validations

- Zod schema validation
- Middleware for body/query/param validation

### 📄 API Documentation

- Swagger/OpenAPI support
- Token-based route documentation

---

## 🛠 Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod for validation
- JWT for authentication
- Swagger for API docs
- Prettier + ESLint for code quality

---

## 🚀 Getting Started

1. Clone the repo
2. Run `npm install`
3. Create a `.env` file (see `.env.example`)
4. Run the server:
   ```bash
   npm run dev
   ```

---

## 📁 Folder Structure

```
src/
│
├── config/         # DB & Swagger config
├── controllers/    # Route logic
├── docs/           # Swagger definitions
├── middlewares/    # Reusable middleware
├── models/         # Mongoose models
├── routes/         # Express route declarations
├── services/       # Business logic
├── utils/          # Helpers (JWT, OTP, email, etc.)
├── validations/    # Zod schema validations
└── app.ts          # App entry point
```

---

## 📄 License

This project is licensed under the MIT License.

---
