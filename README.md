# Project Summary

## 1. Frontend

React with React Router — it is a single-page app (SPA).
Main pages/routes include:
- Home, Products, Product Details
- Cart, Checkout, Order History
- Login, Signup, Profile
- Admin Login, Admin Signup, Admin Dashboard, Admin Products, Admin Orders
- Info pages (Help Center, Returns, etc.)
Chatbot is a component visible on user-facing pages.

## 2. Backend

Node.js + Express with a REST API.
Core responsibilities:
- Auth (signup, login, logout, me)
- Products CRUD (admin-only for create/update/delete)
- Cart (add/remove/update)
- Orders (create, list user orders; admin list/update)
- Chatbot endpoint (/api/v1/nexarch.ai)
- Users (admin list users, update profile)

## 3. Database

MongoDB (via Mongoose).
Collections (models) confirmed:
- User (role-based auth)
- Product
- Cart
- Order
Role/auth fields in User:
- role (enum: user, admin, super-admin)
- password, confirmPassword, passwordChangedAt

## 4. Chatbot Engine

Uses an AI model via OpenRouter:
- Model: nvidia/nemotron-3-nano-30b-a3b:free
- API: https://openrouter.ai/api/v1/chat/completions
- Auth: HF_TOKEN
It is a hybrid system: AI response + hardcoded rules for escalation intent.

## 5. Chatbot Features

Handles:
- Product inquiries and recommendations
- General Q&A
Escalation:
- If AI returns JSON intent "call", it triggers WhatsApp escalation.
Memory:
- There is an in-memory store keyed by userId.
Not implemented:
- No persistent chat logs
- No admin chat dashboard
- No explicit "24/7" mechanism beyond being online

## 6. Knowledge Source

AI is instructed to answer only from product context + dummy data.
Sources:
- Live product data from DB (via findProductMatch)
- dummydata.json

## 7. System Flow (Chatbot)

User opens site -> chatbot component renders  
User opens chatbot -> greeting message shown  
User sends message -> POST to /api/v1/nexarch.ai  
Backend:
- Loads product context + memory
- Sends prompt to OpenRouter model
- If AI responds with JSON { "intent": "call", "reply": "..." }, returns WhatsApp escalation
Frontend:
- Shows bot reply
- Only shows WhatsApp button when explicit call intent is detected

## 8. Admin Features

Admin Dashboard:
- KPI cards and charts (revenue bar chart, order status)
Admin can:
- Add/edit/delete products
- View all orders
- Update order status
- View users list
Not implemented:
- Chat logs
- Admin responses to chats

## 9. Security & Constraints

Auth:
- JWT in httpOnly cookies
- protect middleware + role guard
Constraints:
- Chatbot relies on external OpenRouter API -> internet dependency
- OpenRouter free model -> possible rate limits / variability
- Language is mainly English (no multilingual handling in prompt)
