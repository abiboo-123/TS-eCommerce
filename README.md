# 🚀 DTC E-Commerce Backend API (TypeScript + MongoDB)

This is a **production-ready** Direct-to-Consumer (DTC) e-commerce backend built with modern tooling like **TypeScript**, **Express**, **MongoDB**,
and **Zod**.

It includes **JWT authentication**, **admin/consumer roles**, full **cart & order flow**, and is ready for **frontend collaboration**!

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-18.x-68A063.svg)](https://nodejs.org/)

---

## ✨ Features

### ✅ **Completed Modules**

| Module             | Key Features                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| **Auth**           | Register/login (JWT), OTP password reset, refresh tokens                  |
| **User Profile**   | Image upload, edit profile, mobile & name updates                         |
| **Addresses**      | Add/update/delete addresses, with default address handling                |
| **Products**       | Admin CRUD, image uploads, filtering, search                              |
| **Cart**           | Add/remove/update items, calculate total                                  |
| **Checkout**       | Address-based checkout, optional coupons                                  |
| **Orders**         | View, cancel, return orders, restock items                                |
| **Coupons**        | Admin CRUD, usage tracking, fixed/percent logic                           |
| **Admin Panel**    | Dashboard stats, filters on users/orders/products, secure access          |
| **API Docs**       | Fully documented via Swagger (auto-generated routes and schemas)          |
| **Error Handling** | Global structured error responses via `AppError` + centralized middleware |
| **Logging**        | Winston-powered logging system (errors, info, warnings with rotation)     |

### 💡 Upcoming Improvements

- Global search across models
- Rate-limiting and brute-force protection
- Multi-vendor support
- Admin analytics with charting
- PayPal payment integration
- Soft deletes / archival
- Unit tests & test coverage

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Docs**: Swagger (OpenAPI)
- **Security**: JWT Auth, Helmet, CORS, role-based access
- **Uploads**: Multer (file uploads to `uploads/`)
- **Logging**: Winston
- **Error Handling**: Custom middleware + class-based errors

---

## 🚀 **Quick Start**

```bash
# 1. Clone & install dependencies
git clone https://github.com/TS-eCommerce.git
cd TS-eCommerce
npm install

# 2. Configure env
cp .env.example .env   # then fill in your MongoDB URI & JWT secrets

# 3. Start in dev mode
npm run dev

# 4. Visit Swagger UI
http://localhost:5000/api-docs
```

---

## 📁 Project Structure

```
src/
├── controllers/        # Route handlers
├── models/             # Mongoose schemas
├── routes/             # All route files
├── middlewares/        # Auth, error, validation, logging
├── utils/              # Helpers: logger, AppError, etc.
├── services/           # Reusable business logic
├── validations/        # Zod validators
├── docs/               # Swagger docs
├── app.ts              # Express config & entry point
```

## 👨‍💻 Author

### Habib Gouda

- GitHub: [abiboo-123](https://github.com/abiboo-123)

---

## 🤝 Looking to Collaborate?

🎨 **Frontend developers!** If you're excited about building clean, interactive, and responsive UI — this is your moment! This backend is fully
functional and ready for frontend integration. Let’s team up and build something awesome!

---

## 🪪 License

This project is open-source and free to use under the MIT license.
