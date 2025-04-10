# 🚀 E-Commerce Backend API (TypeScript + MongoDB)

**Production-ready** backend for an e-commerce platform with **JWT auth**, **role-based access**, **Zod validation**, and **Swagger docs**.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://www.typescriptlang.org/)  
[![Node.js](https://img.shields.io/badge/Node.js-18.x-68A063.svg)](https://nodejs.org/)

---

## ✨ **Features**

### ✅ **Completed Modules**

| Module           | Key Features                                                                     |
| ---------------- | -------------------------------------------------------------------------------- |
| **Auth**         | Register/login (JWT), OTP password reset, role-based access (`admin`/`consumer`) |
| **User Profile** | CRUD operations, image uploads (Multer)                                          |
| **Addresses**    | Multiple addresses, default address logic                                        |
| **Products**     | Admin-only CRUD, public browsing, image uploads, Zod validation                  |
| **API Docs**     | Interactive Swagger UI at `/api-docs`                                            |

### 🔜 **Upcoming Modules**

- Cart & checkout flow
- Order management
- Admin dashboard APIs
- Global error middleware

---

## 🛠 **Tech Stack**

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Validation**: Zod
- **Security**: JWT, Helmet, CORS
- **Tools**: Multer (file uploads), Swagger (documentation)

---

## 🚀 **Quick Start**

```bash
# 1. Clone and install
git clone https://github.com/TS-eCommerce.git
cd TS-eCommerce
npm install

# 2. Configure environment variables
cp .env.example .env  # Edit with your MongoDB/JWT keys

# 3. Run in dev mode (hot-reload)
npm run dev

# 4. Access Swagger docs
open http://localhost:5000/api-docs
```

---

---

## 📁 Project Structure

```
src/
├── controllers/        # Request handlers
├── docs/               # Swagger documentations
├── services/           # Needed services
├── models/             # Mongoose schemas
├── routes/             # Route definitions
├── validations/        # Zod schemas
├── middlewares/        # Custom middleware
├── utils/              # Helper utils
├── app.ts              # Entry point
```

## 👨‍💻 Author

- GitHub: [abiboo-123](https://github.com/abiboo-123)

---

## 🪪 License

This project is open-source and free to use under the MIT license.
