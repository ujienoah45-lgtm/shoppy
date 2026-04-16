# Shoppy

![Shoppy Banner](https://img.shields.io/badge/Full-stack%20E-commerce-React%20%2B%20Express-blue)

A modern e-commerce platform built with React + Vite on the frontend and Node.js + Express on the backend. This project includes product browsing, cart/checkout flows, user authentication, admin management, order tracking, and an AI-powered chatbot assistant.

---

## 🚀 Project Overview

Shoppy is a full-stack shopping application with two main parts:

- **Frontend**: React SPA using Vite, React Router, and context-based state management.
- **Backend**: Express REST API with MongoDB/Mongoose, JWT authentication, admin authorization, file uploads, and chatbot integration.

The application also integrates an AI assistant that routes customers to a WhatsApp agent when needed.

---

## 📁 Repository Structure

### Root
- `package.json` — frontend dependencies and Vite scripts
- `vite.config.js` — Vite app configuration
- `README-SETUP.md` — quick local setup guide
- `README.md` — this file

### Frontend
- `src/App.jsx` — main router and layout composition
- `src/main.jsx` — app bootstrap
- `src/context/` — React context providers for user and cart state
- `src/components/` — reusable UI components such as `Header`, `Footer`, `Chatbot`, and `ProductCard`
- `src/pages/` — page-level views like `Home`, `Products`, `Cart`, `Checkout`, and admin pages
- `src/Utils/` — API wrapper functions for cart, user, and products

### Backend
- `Backend/app.js` — Express application and API routing
- `Backend/server.js` — MongoDB connection and server bootstrap
- `Backend/Controllers/` — route controllers for auth, products, cart, orders, users, payments, and AI logic
- `Backend/Routes/` — route definitions for REST endpoints
- `Backend/Models/` — Mongoose data schemas and models
- `Backend/MiddleWare/` — authentication, authorization, and file upload middleware
- `Backend/Services/` — business logic utilities for AI, memory, and sanitizing updates
- `Backend/Utils/` — helper utilities such as prompt construction and query feature parsing
- `Backend/uploads/` — directory for product image uploads

---

## 🧩 Tech Stack

### Frontend
- `React 19` — UI library
- `Vite` — frontend dev server and bundler
- `React Router DOM` — route-based navigation
- `React Toastify` — user notifications
- `React Markdown` — chat response rendering
- CSS modules and custom styles for layout

### Backend
- `Node.js` + `Express` — REST API framework
- `MongoDB` + `Mongoose` — data storage and object modeling
- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT authentication
- `cookie-parser` — cookie support for auth tokens
- `multer` — file upload handling for product images
- `nodemailer` / `twilio` — installed but mostly placeholder/commented for future mail/call integration
- `dotenv` — environment variable management
- `axios` — HTTP requests to external AI endpoint

### AI Chatbot
- `OpenRouter API` — external LLM endpoint at `https://openrouter.ai/api/v1/chat/completions`
- `nvidia/nemotron-3-nano-30b-a3b:free` — current AI model in use
- Local memory store — session-level chat memory keyed by `userId`
- WhatsApp escalation — chatbot can return a call intent and expose a WhatsApp contact link

---

## ✨ Key Features

### Frontend Features
- Product listing, filtering, and details display
- Shopping cart management with add/remove/update quantity
- Checkout flow with order submission
- User authentication and profile management
- Admin portal for managing products and orders
- Persistent recently-viewed products in session storage
- AI chatbot widget for conversational product assistance

### Backend Features
- User signup/login/logout with JWT stored in `httpOnly` cookies
- Admin signup and role-based protection for privileged endpoints
- Product CRUD: create, update, delete, and list active products
- Cart CRUD: add items, remove items, update quantity, clear cart
- Order management: save orders, view user orders, admin order list, status updates
- Payment info retrieval using bank details model
- AI route for chatbot requests and intent-based escalation
- Upload support for product images using `multer`
- Global error handling middleware for consistent API responses

---

## 🛠️ Data Models

### `User`
- `name`, `email`, `phone`, `address`
- `role` — `user`, `admin`, or `super-admin`
- `password`, `confirmPassword`, `passwordChangedAt`
- Passwords are hashed before save via `bcryptjs`
- JWT session protection and password-change detection

### `Product`
- `name`, `description`, `category`, `sizes`, `colors`, `price`, `brand`, `stock`
- `images` array for uploaded product photos
- `rating`, `numReviews`, `isActive`

### `Cart`
- `user` reference to `User`
- `items[]` containing `product` and `quantity`

### `Order`
- `trackingId`, customer details, `date`, `status`
- `items[]` with product references and quantities
- `deliveryFee`, `paymentMethod`, `total`
- Reference to owning `user`

### `ChatMemory`
- `user` identifier for session memory
- `role` (`user`, `assistant`, `system`)
- `content` text history
- `createdAt` timestamp

### `BankDetails`
- `bankName`, `accNumber`, `accName`

---

## 🔌 API Endpoints

### Auth
- `POST /api/v1/auth/signup` — register a regular user
- `POST /api/v1/auth/signup-adm` — register an admin user
- `POST /api/v1/auth/login` — login user and set JWT cookie
- `POST /api/v1/auth/logout` — clear auth cookie
- `GET /api/v1/auth/me` — fetch logged-in user profile

### Products
- `GET /api/v1/products` — list products with filtering, sorting, pagination
- `POST /api/v1/products` — create product (admin only)
- `PATCH /api/v1/products/:productId` — update product (admin only)
- `DELETE /api/v1/products/:productId` — delete product (admin only)

### Cart
- `GET /api/v1/cart` — get current user cart
- `DELETE /api/v1/cart` — clear cart
- `POST /api/v1/cart/add` — add an item to cart
- `DELETE /api/v1/cart/remove/:productId` — delete item from cart
- `PATCH /api/v1/cart/:productId` — update item quantity
- `DELETE /api/v1/cart/:productId` — reduce item quantity

### Orders
- `GET /api/v1/orders` — get orders for authenticated user
- `POST /api/v1/orders` — save checkout order
- `GET /api/v1/orders/admin` — get all orders (admin only)
- `PATCH /api/v1/orders/admin/:trackingId` — update order status (admin only)

### Users
- `PATCH /api/v1/user/update-me` — update logged-in user profile
- `GET /api/v1/user/admin/users` — get all users (admin only)

### Payments
- `GET /api/v1/payments` — fetch bank details for payment instructions

### AI Chatbot
- `POST /api/v1/nexarch.ai` — send user question to AI assistant

---

## 🤖 AI Chatbot Flow

The chatbot is implemented in `src/components/Chatbot.jsx` and uses these concepts:

1. **Session identity**: each visitor gets a persistent `userId` in `localStorage`
2. **User message**: frontend sends `{ userId, question }` to `POST /api/v1/nexarch.ai`
3. **Product matching**: backend uses `Backend/Services/aiHelpers.js` to find relevant products from `dummydata.json`
4. **Memory**: `Backend/Services/memoryStore.js` keeps a temporary memory object for each user session
5. **Prompt building**: `Backend/Utils/askLLM.js` constructs a system-driven prompt instructing the model to answer only from available product context
6. **LLM request**: makes a call to OpenRouter with model `nvidia/nemotron-3-nano-30b-a3b:free`
7. **Intent parsing**: `Backend/Services/aiCallHelpers.js` checks whether the response contains JSON with `{ "intent": "call", "reply": "..." }`
8. **Escalation**: when call intent is detected, backend responds with a WhatsApp contact number and the frontend shows a button.

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (LTS)
- npm
- MongoDB Community Server
- Optional: Git, VS Code, MongoDB Compass

### Install dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd Backend
npm install
```

### Environment variables

Create `Backend/.env` with:
```env
JWT_SECRET=your_secret_here
CON_STR=mongodb://127.0.0.1:27017/shoppy
DOMAIN=/api/v1
HF_TOKEN=your_openrouter_api_key_here
DELIVERYFEE=1500
NODE_ENV=development
```

> `HF_TOKEN` is required for the chatbot AI flow. Keep it secret and never commit it.

### Run the project

#### Start MongoDB
```bash
mongod
```

#### Start backend
```bash
cd Backend
npm start
```

#### Start frontend
```bash
cd ..
npm run dev
```

### Default URLs
- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:8080`

---

## ✅ Development Notes

### Authentication
- JWT is stored in a secure `httpOnly` cookie named `token`
- User sessions are validated in `Backend/MiddleWare/protect.js`
- Admin routes require roles using `protectController.role('admin', 'super-admin')`

### File Uploads
- Product images are uploaded through `multer` and served from `Backend/uploads/`
- Upload rules live in `Backend/MiddleWare/multer.js`

### Query Features
- `Backend/Utils/apiFeatures.js` supports filtering, sorting, field limiting, and pagination for list endpoints

### Product Search and AI Context
- `Backend/Services/aiHelpers.js` performs keyword matching against `dummydata.json`
- AI responses are restricted to product context and dummy data when possible

### Client State Management
- `src/context/UserContext.jsx` handles auth state, session-based persistence and recently viewed products
- `src/context/CartContext.jsx` syncs cart state with backend cart APIs

---

## 🧪 Scripts

### Frontend
- `npm run dev` — start Vite in development mode
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run lint` — run ESLint across the repo

### Backend
- `cd Backend && npm start` — start backend with `nodemon`

---

## 🤝 Collaboration

### Recommended workflow
1. Fork the repository or create a new branch from `main`
2. Add features or fixes in isolated branches
3. Run frontend and backend locally to verify behavior
4. Open a PR with a clear description of changes

### What to include
- Summary of changes
- Relevant routes or components updated
- Testing steps

### Notes for reviewers
- Confirm auth flows work for regular and admin users
- Verify cart state updates correctly after add/remove actions
- Confirm checkout creates orders and admin dashboard reflects order data
- Test chatbot conversation and WhatsApp escalation logic

---

## 📌 Known Limitations

- Chat memory is stored in-memory and is not persisted across server restarts
- AI escalation currently uses a fixed WhatsApp number; real call support is stubbed
- Admin-only routes are enforced via role guard, but there is no admin auditing dashboard yet
- `nodemailer` / `twilio` packages are present but not currently used for active communication flows

---

## 📚 References
- `README-SETUP.md` for a quick local install guide
- `Backend/app.js` for API routing and middleware setup
- `src/App.jsx` for frontend route structure and page layout
- `src/components/Chatbot.jsx` for chatbot UI and user flow
- `Backend/Utils/askLLM.js` for AI prompt and OpenRouter integration

---

## 📝 Final Notes

This repository is designed as a collaborative e-commerce proof of concept with both user-facing and admin-facing experiences. The combination of React state management, Express API structure, MongoDB modeling, and AI-powered chatbot support makes it a strong foundation for further expansion.


### Query Features
- `Backend/Utils/apiFeatures.js` supports filtering, sorting, field limiting, and pagination for list endpoints

### Product Search and AI Context
- `Backend/Services/aiHelpers.js` performs basic keyword matching against `dummydata.json`
- The AI is encouraged to answer only based on the found product context and dummy data

### Client state management
- `src/context/UserContext.jsx` handles auth state and recently viewed products
- `src/context/CartContext.jsx` syncs cart state with backend cart APIs

---

## 🧪 Scripts

### Frontend
- `npm run dev` — start Vite in development mode
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run lint` — run ESLint across the repo

### Backend
- `cd Backend && npm start` — start backend with `nodemon`

---

## 🤝 Collaboration

### Recommended workflow
1. Fork the repository or create a new branch from `main`
2. Add features or fixes in isolated branches
3. Run frontend and backend locally to verify behavior
4. Open a PR with a clear description of changes

### What to include
- Summary of changes
- Relevant routes or components updated
- Testing steps

### Notes for reviewers
- Confirm auth flows work for regular and admin users
- Verify cart state updates correctly after add/remove actions
- Confirm checkout creates orders and admin dashboard reflects order data
- Test chatbot conversation and WhatsApp escalation logic

---

## 📌 Known Limitations

- Chat memory is stored in-memory and is not persisted across server restarts
- AI escalation currently uses a fixed WhatsApp number; real call support is stubbed
- Admin-only routes are enforced via role guard, but there is no admin auditing dashboard yet
- `nodemailer` / `twilio` packages are present but not currently used for active communication flows

---

## 📚 References
- `README-SETUP.md` for a quick local install guide
- `Backend/app.js` for API routing and middleware setup
- `src/App.jsx` for frontend route structure and page layout
- `src/components/Chatbot.jsx` for chatbot UI and user flow
- `Backend/Utils/askLLM.js` for AI prompt and OpenRouter integration

---

## 📝 Final Notes

This repository is designed as a collaborative e-commerce proof of concept with both user-facing and admin-facing experiences. The combination of React state management, Express API structure, MongoDB modeling, and AI-powered chatbot support makes it a strong foundation for further expansion.
