# 🏬 Warung Nida - Point of Sale System

Mobile-first POS system for small businesses built with React and Firebase.

🔗 **[Live Demo](https://warungnida.netlify.app/)**

## ✨ Features

- **Product Management** - Add, edit, delete, and search products with real-time inventory
- **Transaction Processing** - Shopping cart with automatic stock updates and checkout
- **History & Analytics** - View transaction history with detailed breakdowns
- **User Authentication** - Email login and anonymous access with isolated user data
- **Mobile Responsive** - Optimized for mobile devices with touch-friendly interface

## 🛠️ Tech Stack

React.js • Firebase • CSS Modules • React Router

## 🚀 Quick Start
```bash
git clone https://github.com/portgasalif/warung-nida.git
cd warung-nida
npm install
npm start
```

### Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** and **Authentication** (Email/Password + Anonymous)
3. Copy config from Project Settings → General → Your apps
4. Add to `src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 📱 How to Use

1. **Login** with email/password or anonymous access
2. **Add Products** via "Stok" page - set name, price, stock
3. **Process Sales** - search products, adjust quantities, checkout
4. **View History** - check "Riwayat" for past transactions

## 🚧 Roadmap

Dashboard analytics • Low stock alerts • Product categories • Receipt printing • Data export
