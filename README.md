# 🛠️ QR-Based Asset Tracker System for Factory Tools

A full-stack application designed to manage and monitor factory tools using QR codes for real-time tracking. Built with the MERN stack, this system provides mobile and web interfaces for different user roles with secure, role-based access.

---

## 📌 Overview

This system simplifies factory tool tracking by:
- Generating and scanning QR codes for assets
- Allowing factory staff to check tools in/out via mobile devices
- Giving admins insight into tool usage, maintenance, and movement

---

## 🔧 Tech Stack

| Layer        | Technology      |
|--------------|------------------|
| Frontend     | React.js         |
| Backend      | Node.js + Express.js |
| Database     | MongoDB Atlas    |
| Authentication | JWT + OTP     |
| QR Scanning  | QR libraries (e.g., `qrcode`, `react-qr-scanner`) |
| Communication | Email (Nodemailer) + SMS (Twilio) |

---

## 🔐 Environment Variables

This project uses the following `.env` variables (not included in the repo):

```env
MONGO_URI=your_mongo_connection_uri
PORT=5000
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email_user
EMAIL_PASS=your_email_app_password

TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

##  🔑 Core Features
✅ QR code generation for each asset

✅ Real-time tool check-in/check-out

✅ OTP-based mobile login

✅ Role-based dashboards:

  -  SLT Admin

  -  Company Admin

  -  Maintenance Staff

  -  Factory Workers

✅ Asset location tracking and logs

✅ Web dashboard for admins, mobile UI for factory staff



## 🚀 Getting Started

Clone the repository

```
git clone https://github.com/your-username/qr-assets-tracker.git
cd qr-assets-tracker
```
Install dependencies

```
npm install
cd client
npm install
```

Set up your .env file in the root directory
Run the project

```
# Start the backend
npm run dev

# In another terminal, start the frontend
cd client
npm run dev

```
