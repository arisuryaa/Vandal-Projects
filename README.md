# 🪙 Vandal - Crypto Portfolio Tracker

Vandal is a modern web application for tracking cryptocurrency prices, managing personal portfolios, and monitoring market trends in real-time.  
Built with React, Express, and MongoDB, Vandal provides a smooth, responsive experience for crypto enthusiasts to stay on top of their investments.

> ⚠️ This project is currently under development.

---

## 🚀 Tech Stack

### Frontend

- ⚛️ React (with Vite)
- 💨 TailwindCSS
- 🔄 Redux for state management
- 🔗 Axios for API calls
- 📊 Chart.js for visualizations
- 🧩 React Hook Form & Zod for validation
- 🔔 React Toastify for notifications
- ⏱️ useDebounce for smooth user input handling

### Backend

- 🚀 Express.js
- 🧰 Node.js
- 🧮 MongoDB (via Mongoose)
- 🔥 Firebase Authentication
- 🌐 CoinGecko API integration

### Deployment

- ☁️ Vercel (Frontend & Backend)

---

## ✨ Features

### 🏠 Homepage

Displays all available cryptocurrencies with real-time data.

### 📈 Detail Page

Shows detailed information about each selected coin.

### ⭐ Watchlist

Allows users to save and manage their favorite coins for quick access.

### 💼 Portfolio

Users can manage their holdings — add coins, view total balance, profit/loss, and 24h performance.

---

## 🧰 Environment Variables

Create a `.env` file in both the **frontend** and **backend** directories with the following keys:

### Backend

```bash
MONGODB_URI=your_mongodb_connection_string
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
```
