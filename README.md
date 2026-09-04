# Navjeevan Clinic Management System

A full-stack MERN healthcare management platform designed to connect
patients, doctors, and administrators through a unified digital clinic
management system.


## Overview

Navjeevan Clinic is a healthcare management system developed using the
MERN stack. The platform provides separate dashboards for patients,
doctors, and administrators.

The system supports appointment management, digital prescriptions,
medical records, health trackers, video consultations, reviews,
payments, and an AI-powered chatbot.

## Features

###  Patient

- Patient registration and login
- Email OTP verification
- Patient profile
- Appointment booking
- Appointment rescheduling
- Medical report upload
- Digital prescriptions
- Prescription download
- Period tracker
- Fertility tracker
- Pregnancy tracker
- Wellness tracker
- Video consultations
- Online payments
- Appointment reviews
- AI chatbot

###  Doctor

- Doctor dashboard
- Patient management
- Appointment management
- Patient medical history
- Medical reports
- Digital prescription creation
- Prescription upload
- Video consultation
- Appointment completion
- Patient search

###  Administrator

- Admin dashboard
- Patient management
- Doctor management
- Appointment management
- Review management
- Appointment details
- System monitoring


## Video consultation rules

Video appointments follow a strict server-side lifecycle:

1. A confirmed video appointment has **no exposed meeting URL before the access window**.
2. The video access window opens **5 minutes before the scheduled start time**.
3. The **doctor starts the consultation first**. Starting the consultation creates/activates the room and changes the meeting state to `scheduled`.
4. The patient cannot obtain the meeting URL from the video-access API until the doctor has started the consultation. The patient UI shows a waiting state until the doctor starts.
5. The consultation ends automatically at the configured service duration (for example, the seeded services default to 20 minutes).
6. When the consultation ends, the appointment is marked `completed`, `meetingStatus` becomes `completed`, and the stored meeting URL is cleared. Past video appointments therefore do not display a meeting link.
7. A doctor can start the consultation during the 5-minute pre-start window and throughout the active consultation window.
8. Rescheduling a video appointment resets the video lifecycle and clears the previous room URL.

> The application controls who receives the Jitsi room URL. Jitsi itself is a third-party meeting service; for stronger production-grade lobby/admission guarantees, deploy a Jitsi configuration with authenticated moderators/lobby controls rather than relying on a public room domain alone.

## Notification policy

The application intentionally uses **email only** for OTPs and appointment notifications. Phone numbers are still collected for patient contact and payment checkout where required, but there is no Twilio/SMS notification implementation in this version.

### Email configuration
Configure these values in `server/.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Navjeevan Clinic" <your-email@example.com>
```

For Gmail, use an **App Password** rather than your normal account password when required by Google's account security settings.

## ![Website Screenshots](/screenshots/AboutPage.png)
## ![Website Screenshots](/screenshots/AdminDashboard.png)
## ![Website Screenshots](/screenshots/AIchatbot.png)
## ![Website Screenshots](/screenshots/AppointmentConfirm.png)
## ![Website Screenshots](/screenshots/BookAppointmentForm.png)
## ![Website Screenshots](/screenshots/ContactPage.png)
## ![Website Screenshots](/screenshots/DailyWellnessTracker.png)
## ![Website Screenshots](/screenshots/DoctorDashboard.png)
## ![Website Screenshots](/screenshots/DoctorProfile.png)
## ![Website Screenshots](/screenshots/FertilityTracker.png)
## ![Website Screenshots](/screenshots/HealthTracker.png)
## ![Website Screenshots](/screenshots/HomePage.png)
## ![Website Screenshots](/screenshots/LoginForm.png)
## ![Website Screenshots](/screenshots/MedicalReport.png)
## ![Website Screenshots](/screenshots/MyBookingsPage.png)
## ![Website Screenshots](/screenshots/MyPrescription.png)
## ![Website Screenshots](/screenshots/PatientDashboard.png)
## ![Website Screenshots](/screenshots/PaymentSuccessful.png)
## ![Website Screenshots](/screenshots/PayWithRazorpay.png)
## ![Website Screenshots](/screenshots/PeriodTracker.png)
## ![Website Screenshots](/screenshots/PregnancyTracker.png)
## ![Website Screenshots](/screenshots/PrescriptionPDF.png)
## ![Website Screenshots](/screenshots/ReviewForm.png)
## ![Website Screenshots](/screenshots/ServicesPage.png)
## ![Website Screenshots](/screenshots/ServicesPage.png)
## ![Website Screenshots](/screenshots/SignUpForm.png)
## ![Website Screenshots](/screenshots/VideoConsultationDoctorSide.png)
## ![Website Screenshots](/screenshots/VideoConsultationPatientSide.png)
                           
## Technology

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, bcrypt and email OTP
- **Email:** Nodemailer / SMTP
- **Payments:** Razorpay API and signature verification
- **Video:** Jitsi Meet room URLs with application-level server-side authorization and time gating

## Project structure

```text
Navjeevan_Clinic_Project/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── services/
│       └── types/
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repository/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── templates/
│   └── utils/
|__screenshots/
├── .gitignore
├── package.json
├── start-backend.bat
├── start-frontend.bat
└── README.md
```

## Local setup

### Requirements

- Node.js 18+ (Node.js 20+ recommended)
- MongoDB running locally or a MongoDB Atlas connection
- An SMTP account if real email delivery is required
- Razorpay credentials if online payments are required

### 1. Install dependencies

From the project root:

```bash
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

`node_modules` is intentionally excluded from Git.

### 2. Configure backend environment

Copy `server/.env.example` to `server/.env` and fill in the required values:

```bash
cd server
copy .env.example .env
```

At minimum, configure:
- `MONGODB_URI`
- a strong `JWT_SECRET`
- `EMAIL_USER` and `EMAIL_PASS` for real OTP/notification delivery

For payments, configure:
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET` when webhook verification is enabled

Never commit `server/.env`.

### 3. Optional seed data

```bash
cd server
npm run seed:all
```

The seed scripts create the service catalog and the configured admin/doctor records used by the project. Use your own credentials/configuration before deploying.

> **⚠️ Dummy data notice:** The admin (`admin@navjeevanclinic.com`) and doctor (`doctor@navjeevanclinic.com`) email addresses, phone numbers, and default passwords in `server/seed/createAdmin.js` and `server/seed/createDoctor.js` are **placeholder values only**. Replace them with your own real details in those files (and update the default passwords) before running the seed scripts and deploying the project. Do not commit real personal email addresses, phone numbers, or credentials to a public repository.

### 4. Start the project

Backend:

```bash
cd server
npm run dev
```

Frontend in another terminal:

```bash
cd client
npm run dev
```

Or use the provided Windows batch files from the project root.

## Quality checks

Before pushing changes, run:

```bash
cd client
npm run typecheck
npm run lint
npm run build
```

For the backend, validate the application by starting it with a valid `.env` and exercising the API routes with Postman or the frontend.

## Important security notes

- Do not commit `.env` files, credentials, JWT secrets, SMTP passwords or payment secrets.
- Use HTTPS in production.
- Use a strong random `JWT_SECRET`.
- Configure MongoDB authentication, network restrictions and backups.
- Razorpay payment signatures are verified server-side.
- Patient appointment ownership is checked server-side.
- Video access is checked server-side for the authenticated patient/doctor.
- The patient never receives a video room URL from the normal appointment list before the 5-minute access window, and completed video appointments have their room URL cleared.
- Review functionality has deliberately not been changed in this update.

## GitHub checklist

Before the first push:

```bash
git init
git add .
git status
git commit -m "Navjeevan Clinic Project"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

Confirm with `git status` that no `.env` or `node_modules` files are staged.
