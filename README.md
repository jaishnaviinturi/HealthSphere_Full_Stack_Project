# 🩺 HealthSphere: AI-Powered Healthcare Management Platform

HealthSphere is a full-stack, AI-powered healthcare platform designed to connect *patients*, *doctors*, and *hospitals* in a seamless digital ecosystem. Built with modern web technologies and modular microservices, it provides a secure, role-based experience with advanced AI-driven features like disease prediction, medical report analysis, and personalized health recommendations.

> 🚀 A comprehensive solution for healthcare management, integrating cutting-edge AI with user-friendly interfaces.



## 🔗 Live Demo

Explore HealthSphere in action:  
👉 **[Live Link](https://health-sphere-frontend.vercel.app/)**


## 📸 Project Preview

### Landing Page
![Landing Page](https://github.com/user-attachments/assets/db0d8e51-463d-452c-a70c-a3bd89446c3b)
*Modern, welcoming interface for HealthSphere users.*

### Login / Signup
![3 Interfaces](https://github.com/user-attachments/assets/fa8bd6d4-5a8c-4f21-afd2-0393760e2e57)
![Login](https://github.com/user-attachments/assets/7e85ccec-3614-47ff-a31b-04b10653d00f)

*Secure authentication for patients, doctors, and hospital admins.*

### 🩺 Patient Dashboard
Manage appointments, medical records, pill reminders, AI-driven health insights like disease prediction from X-rays, personalized fitness and nutrition plans, chatbot support, SOS emergency features, and insurance recommendations.
![Patient Dashboard](https://github.com/user-attachments/assets/e79aaebf-e0fe-40a2-9ec9-8090ab5247c3)
![Patient Features](https://github.com/user-attachments/assets/a19d2c40-529a-47e6-92f9-e7f245f33c68)
![Patient Features](https://github.com/user-attachments/assets/d74d74d5-4a24-4011-8364-467de4f67227)


### 🩼 Doctor Dashboard
Handle appointments, patient records, and e-prescriptions with ease.
![Doctor Dashboard](https://github.com/user-attachments/assets/259b90f8-6acd-494e-8c46-1fa2843dce1d)


### 🏥 Hospital Dashboard
Oversee staff, appointments, bed management, and hospital analytics.
![Hospital Dashboard](https://github.com/user-attachments/assets/3eb2c658-2489-43e1-ada3-a051e5ab654c)


### ✨ Key Features
Explore AI-powered tools like X-ray analysis, symptom prediction, and personalized fitness plans.
![X-Ray Analysis](https://github.com/user-attachments/assets/8e523bdc-a528-4603-846d-79e6a02e9b23)
![Syptom Based Disease Prediction](https://github.com/user-attachments/assets/433e5f79-b462-406a-8b5a-ef08873206f0)
![Chatbot](https://github.com/user-attachments/assets/6fdedd02-4570-46d8-9a31-3181d5ab6278)
![Fitness & Diet](https://github.com/user-attachments/assets/5ee09d1a-06df-4519-92c6-b7936e70d8e3)

---

## 🔑 Key Features

### Patient Portal
- 📅 **Appointment Booking**: Schedule and manage appointments with doctors.
- 📋 **Medical Records**: Securely access and view medical history and reports.
- 🩻 **AI Disease Prediction**: Analyze X-rays, eye, and brain images for disease detection using TensorFlow/Keras.
- ⏰ **Pill Reminders**: Set up medication schedules with SMS notifications via Twilio.
- 🥗 **Fitness & Nutrition Plans**: Generate personalized diet and workout plans using Google Gemini.
- 💬 **Chatbot & Mood Detection**: Get conversational support and mood-based YouTube video suggestions via HuggingFace.
- 🆘 **SOS Emergency**: Quick access to emergency services.
- 🛡️ **Insurance Recommendations**: AI-driven suggestions for health insurance plans.
- - 🔒 **Secure Access**: Only patients can log in. Hospitals onboard doctors to ensure only authorized personnel have access.

### Doctor Portal
- 📆 **Appointment Management**: View and manage patient appointments.
- 📝 **Patient Records**: Access and update medical records securely.
- 💊 **E-Prescriptions**: Generate and send electronic prescriptions.

### Hospital Portal
- 👩‍⚕️ **Staff Management**: Manage doctors and hospital staff.
- 🏨 **Bed & Stock Management**: Track hospital beds and inventory.
- 📊 **Analytics Dashboard**: Monitor hospital operations and performance metrics.

### AI & Automation Services
- 📄 **Medical Report Analysis**: Extract and analyze text from PDFs/images using PyMuPDF, pytesseract, and Google Gemini.
- 🤖 **Chatbot**: Provides health query support and emotional assistance.
- 🩺 **Disease Prediction**: Deep learning models for X-ray, eye, and brain diagnostics.
- 📲 **Pill Reminder Service**: Automated SMS reminders for medication adherence.

---

## 🌍 Real-World Impact

HealthSphere empowers users by:

- 🩺 Providing *patients* with AI-driven health insights and seamless access to healthcare services.
- 👨‍⚕️ Enabling *doctors* to manage patient care efficiently with secure, real-time data.
- 🏥 Helping *hospitals* streamline operations and improve resource management.
- 🤖 Leveraging AI for personalized healthcare, from disease prediction to emotional support.

By integrating advanced AI and modern web technologies, HealthSphere creates a *unified, secure, and intelligent healthcare ecosystem*.

---

## 💻 Tech Stack

| Component                | Technologies Used                                      |
|--------------------------|-------------------------------------------------------|
| **Frontend**            | React, TypeScript, Tailwind CSS, Vite, Recharts, React Router |
| **Backend**             | Node.js, Express, MongoDB, Mongoose, JWT, Multer, CORS, dotenv |
| **AI & Automation**     | Python, Flask, Flask-CORS, TensorFlow/Keras, Google Gemini, HuggingFace, PyMuPDF, pytesseract, Twilio, threading, schedule |
| **Deployment**          | Vercel (frontend), Render (backend and Flask services) |

---

## ⚙️ .env Variables

Create `.env` files in the respective directories (`Backend` and `Flask`) with the following variables:

### Backend (.env in `Backend` folder)
```
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
VITE_BACKEND_URL=your_backend_url_here
```

### Flask Microservices (.env in `Flask` folder)
```
GEMINI_API_KEY=your_gemini_api_key_here
HF_API_KEY=your_huggingface_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
TESSERACT_CMD=your_tesseract_cmd_path
```

---

## 🚀 Project Setup

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or cloud)
- Vercel CLI (for frontend deployment)
- Render account (for backend and Flask deployment)
- API keys for Twilio, Google Gemini, HuggingFace, and YouTube API

### Install Dependencies

#### Frontend
```bash
cd Frontend
npm install
```

#### Backend
```bash
cd Backend
npm install
```

#### Flask Microservices
```bash
cd Flask
pip install -r requirements.txt
```

### Start the Application Locally

#### Backend (Node.js/Express)
```bash
cd Backend
npm run start
```

#### Frontend (React/Vite)
```bash
cd Frontend
npm run dev
```

#### Flask Microservices
```bash
cd Flask
python app.py
```

*Note*: Ensure each Flask microservice (e.g., pill reminder, chatbot) runs on its designated port as configured.

### Deploy to Render (Backend and Flask)

#### Backend
1. Create a new Web Service on Render.
2. Connect your GitHub repository and select the `Backend` folder.
3. Set the runtime to `Node`, and add the following build command:
   ```bash
   npm install
   ```
4. Set the start command:
   ```bash
   npm run start
   ```
5. Add the `.env` variables (MONGO_URI, JWT_SECRET,VITE_BACKEND_URL) in Render's environment settings.

#### Flask Microservices
1. Create a new Web Service on Render.
2. Connect your GitHub repository and select the `Flask` folder.
3. Set the runtime to `Python`, and add the following build command:
   ```bash
   pip install -r requirements.txt
   ```
4. Set the start command:
   ```bash
   python app.py
   ```
5. Add the `.env` variables (GEMINI_API_KEY, HF_API_KEY, YOUTUBE_API_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, TESSERACT_CMD) in Render's environment settings.

### Deploy Frontend to Vercel
```bash
cd Frontend
vercel
```

---

## 👥 Contributors

This project was developed by:  
- [I. Jaishnavi](https://github.com/jaishnaviinturi)  
- [A. Abhijith Reddy](https://github.com/abhijithreddy05)  

---
