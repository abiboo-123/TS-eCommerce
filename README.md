# 🛒 E-Commerce Backend API (TypeScript + MongoDB)

Welcome to the backend repository of a full-featured e-commerce application built using **Node.js**, **TypeScript**, **Express**, **MongoDB**, and
**Zod** for validation. This project supports multiple user roles and focuses on clean architecture, validation, authentication, and scalability.

---

## ✅ Features Implemented

### 🔐 Authentication

- Register, Login with access/refresh JWT tokens
- Forgot password (OTP based) + Reset password
- Change password (protected route)

### 👤 User Profile

- Create profile with image upload (Multer)
- Update profile data and profile picture
- Retrieve profile info

### 📦 Address Management

- Add/update/delete multiple addresses
- Set default address

### 🧾 Validation & Documentation

- Zod validation for all endpoints
- Swagger documentation for every route

### 🔒 Middleware

- Authentication middleware
- Role-based access (admin / consumer)

---

## 🚧 Under Development

- Product module (admin-only product creation, editing, deletion)
- Cart and checkout logic
- Order management
- Admin dashboard APIs
- Global error handling improvements

---

## 🚀 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** + **Mongoose**
- **Zod** (validation)
- **JWT** for authentication
- **Multer** for image uploads
- **Swagger** for documentation

---

## 📁 Folder Structure

```
src/
├── controllers
├── routes
├── models
├── middlewares
├── validations
├── utils
├── config
└── app.ts
```

---

## 📷 Image Uploads

Uploaded files (e.g. profile pictures) are stored in `/uploads/`. Express serves this folder statically, so uploaded files can be accessed via:

```
http://localhost:5000/uploads/profile/filename.jpg
```

---

## 📘 API Documentation

Swagger is available at:

```
http://localhost:5000/api-docs
```

Use it to explore and test all available endpoints with real-time request/response samples.

---

## 🛠 Getting Started

```bash
# Install dependencies
yarn install

# Start in dev mode
yarn dev

# Build and start
yarn build && yarn start
```

Make sure to configure your `.env` file properly (see `.env.example`).

---

## 🌐 Collaboration

This backend is in active development and built with production practices in mind.

🧑‍💻 **If you're a frontend developer and would like to collaborate on the frontend part, feel free to reach out!**

---

## 📫 Contact

If you’re interested in collaborating or have questions, open an issue or contact me directly.

---

_This project is a backend-only build and will later connect to a complete frontend store (React, Next.js, etc.)_
