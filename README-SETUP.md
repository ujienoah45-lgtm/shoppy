# Shoppy React - Local Setup Guide

This project is a React (Vite) single-page app with a Node.js + Express backend and MongoDB. The full stack runs locally except the chatbot, which calls an external AI API.

## 1) Required Software (Install These)

- **Node.js (LTS)**: https://nodejs.org  
  Includes `npm`.
- **MongoDB Community Server**: https://www.mongodb.com/try/download/community  
  Runs locally on your machine.
- **Git** (optional but recommended): https://git-scm.com/downloads  
  For cloning the project.

Optional:
- **MongoDB Compass** (GUI): https://www.mongodb.com/products/compass
- **VS Code** or another editor

## 2) Project Dependencies

Install dependencies in **two places**:

### Frontend (root folder)
```bash
npm install
```

### Backend (Backend folder)
```bash
cd Backend
npm install
```

Note: Backend uses `nodemon` in its `npm start` script. If you don’t already have it:
```bash
npm install -g nodemon
```
or run the server with:
```bash
npx nodemon server.js
```

## 3) Environment Variables

Create a `.env` file inside `Backend/` with these values:

```env
JWT_SECRET=your_secret_here
CON_STR=mongodb://127.0.0.1:27017/shoppy
DOMAIN=/api/v1
HF_TOKEN=your_openrouter_api_key_here
DELIVERYFEE=1500
NODE_ENV=development
```

Notes:
- `HF_TOKEN` is required for the chatbot (external API).
- Do **not** commit your real API key.

## 4) Start MongoDB

### Windows (Service)
If installed as a service, it usually starts automatically.  
If not, run:
```bash
mongod
```

### macOS/Linux
```bash
mongod
```

## 5) Run the Backend

Open a new terminal:
```bash
cd Backend
npm start
```
If `nodemon` is not installed globally:
```bash
npx nodemon server.js
```

Backend runs at:
```
http://127.0.0.1:8080
```

## 6) Run the Frontend

Open another terminal at project root:
```bash
npm run dev
```

Frontend runs at:
```
http://127.0.0.1:5173
```

## 7) Admin Access (Local)

- Admin signup: `http://127.0.0.1:5173/vault/ops/signup`
- Admin login: `http://127.0.0.1:5173/vault/ops/login`

## 8) Quick Start (All Commands in One Place)

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd Backend
npm install
npm start

# Terminal 3: Frontend
cd ..
npm install
npm run dev
```

## 9) Troubleshooting

- **Chatbot not responding**: check `HF_TOKEN` and internet connection.
- **Backend won’t start**: ensure MongoDB is running and `.env` is correct.
- **CORS or auth issues**: use `http://127.0.0.1:5173` and ensure cookies are enabled.

---
If you need help, open the project and check the `Backend/server.js` and `vite.config.js` for ports and proxy settings.
