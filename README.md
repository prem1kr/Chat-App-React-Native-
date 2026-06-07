# PKChat 💬
A modern real-time chat application built with **React Native (Expo)**, **Node.js**, **Express.js**, **MongoDB**, **Redux Toolkit**, and **Socket.IO**. PKChat provides secure authentication, one-to-one messaging, group chats, real-time communication, profile management, and a scalable architecture for mobile applications.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- Admin Login
- Admin Registration
- JWT Authentication
- Persistent Login using AsyncStorage
- Protected Routes

### 👤 User Management
- User Profiles
- Edit Profile Information
- User Search
- Online/Offline Status

### 💬 Real-Time Chat
- One-to-One Messaging
- Real-Time Message Delivery
- Socket.IO Integration
- Message Persistence
- Chat History
- Message Delivered Tick
- Message Read Tick

### 👥 Group Chat
- Create Groups
- Add/Remove Members
- Group Messaging
- Group Information Management

### ⚡ State Management
- Redux Toolkit
- Global User State
- Profile State Management
- Optimized Data Flow

### 📱 Mobile Features
- Expo Router Navigation
- Responsive UI
- Cross Platform Support
- Android Support
- Web Support

---

# 🏗️ Tech Stack

## Frontend
- React Native
- Expo SDK 56
- Expo Router
- Redux Toolkit
- React Redux
- Axios
- Socket.IO Client
- AsyncStorage
- React Navigation


## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- BcryptJS
- CORS

---

# 📂 Project Structure

## Frontend

```bash
frontend/
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── users/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.jsx
│   │   ├── signup.jsx
│   │   └── welcome.jsx
│   │
│   ├── components/
│   │   ├── appHeader.jsx
│   │   ├── createGroup.jsx
│   │   ├── groupModal.jsx
│   │   ├── loadingButton.jsx
│   │   └── membersModal.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useGroup.js
│   │   ├── useMessage.js
│   │   └── useProfile.js
│   │
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── profileSlice.js
│   │   │   ├── userSlice.js
│   │   │   └── usersSlice.js
│   │   │
│   │   └── store/
│   │       └── store.js
│   │
│   ├── socket/
│   │   └── socket.js
│   │
│   └── global.css
│
├── assets/
├── android/
├── .env
├── app.json
└── package.json
```

---

## Backend

```bash
backend/
│
├── config/
│   ├── db.js
│   └── socket.js
│
├── controllers/
│   ├── authController.js
│   ├── chatController.js
│   ├── groupController.js
│   ├── messageController.js
│   └── profileController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── authModel.js
│   ├── chatModel.js
│   ├── groupModel.js
│   ├── messageModel.js
│   └── profileModel.js
│
├── routes/
│   ├── authRoute.js
│   ├── chatRoute.js
│   ├── groupRoute.js
│   ├── messageRoute.js
│   └── profileRoute.js
│
├── socket/
│   └── socket.js
│
├── .env
├── server.js
└── package.json
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/prem1kr/Chat-App-React-Native-.git

cd Chat-App-React-Native-
```

---

# 🔥 Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/pkchat

JWT_SECRET=your_secret_key
```

Start server:

```bash
npm start
```

Server runs on:

```bash
http://localhost:5000
```

---

# 📱 Frontend Setup

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

```env
EXPO_PUBLIC_API_URL=http://192.168.1.5:5000/api

EXPO_PUBLIC_SOCKET_URL=http://192.168.1.5:5000
```

Start Expo:

```bash
npm start
```

or

```bash
expo start
```

---


---

# 🚀 Running on Android

```bash
npm run android
```

---

# 🌐 Running on Web

```bash
npm run web
```

---

# 📦 Build APK

Generate Android APK:

```bash
npx expo prebuild

cd android

./gradlew assembleRelease
```

APK location:

```bash
https://expo.dev/accounts/prem97344/projects/chat-app/builds/03f03e57-2322-4616-879d-ead718b2d578
```

---

# 🔒 Security

- Password Hashing using BcryptJS
- JWT Authentication
- Protected API Routes
- Environment Variables
- Secure MongoDB Connection

---

# 📈 Future Enhancements

- Voice Calling
- Video Calling
- Push Notifications
- Message Reactions
- Media Sharing
- Message Encryption
- Dark Mode

---

# 👨‍💻 Author

**Prem Kumar**

Full Stack Web Developer and Mobile App Developer 

### Skills

- React Native
- React.js
- Next.js
- Node.js
- Express.js
- MongoDB
- Redux Toolkit
- Socket.IO
- REST APIs
