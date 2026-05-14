<div align="center">

# 🛒 ShopLite

### Full-Stack E-Commerce Web Application

_An end-to-end online shopping platform with role-based dashboards, order lifecycle management, OTP-secured delivery, and automated email notifications._

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square&logo=tailwindcss)

</div>

---

## 📖 About the Project

ShopLite is a full-stack e-commerce web application I built during my training to simulate how a real-world online shopping platform works. The goal was to go beyond basic CRUD and actually implement a complete business workflow — from user registration all the way to delivery confirmation and returns.

The platform has three roles — **Admin**, **Customer**, and **Delivery Partner** — each with their own dashboard and workflow. I handled both frontend and backend development completely on my own.

---

## 👨‍💻 About Me

Full-Stack Developer (Trainee)

I worked on this project as part of my training, contributing to both frontend and backend. On the frontend, I built the UI using React and Tailwind CSS. On the backend, I developed REST APIs using Spring Boot, handled authentication with JWT, and managed database operations using JPA with MySQL.

📧 [nehabommireddy14@gmail.com] &nbsp;|&nbsp; 🔗 [Neha Bommireddy](https://www.linkedin.com/in/neha-bommi-reddy/) &nbsp;

---

## 🛠️ Tech Stack

| Layer          | Technology                                                 |
| -------------- | ---------------------------------------------------------- |
| Frontend       | React 19, Tailwind CSS, React Router DOM, Axios            |
| Backend        | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA |
| Database       | MySQL                                                      |
| Authentication | JWT, Google OAuth 2.0                                      |
| Email          | Spring Boot Mail (Gmail SMTP)                              |
| Build Tools    | Vite (frontend), Maven (backend)                           |

---

## 👥 User Roles

### 🛍️ Customer

- Register and log in (email/password or Google)
- Browse products, search and filter by category or brand
- Add items to cart and place orders
- Track orders in real time
- Cancel orders, raise return requests, and create support tickets

### 🖥️ Admin

- Manage products, categories, and inventory
- Monitor all orders and update their status
- Approve or reject delivery partner registrations
- Assign delivery partners to orders
- Handle return requests and support tickets

### 🚚 Delivery Partner

- Register and wait for admin approval
- View assigned deliveries and update status
- Confirm delivery using OTP verification
- Handle return pickups with OTP confirmation

---

## 🔄 How the Application Works

### Authentication

When a customer registers, an OTP is sent to their email for verification. After verifying, they can log in and receive a JWT token. This token is attached to every API request, and the backend validates it to identify who is making the request and what role they have.

For Google login, the user signs in with Google on the frontend, and the token is verified on the backend before a JWT is issued.

### Order Flow

```
Customer places order
       ↓
Admin confirms → packs → ships → assigns delivery partner
       ↓
Delivery partner picks up → heads to customer location
       ↓
OTP sent to customer's email
       ↓
Customer shares OTP → Delivery partner enters it → Order marked Delivered ✓
```

The OTP step at delivery is important — it makes sure the package actually reached the customer and prevents fake delivery markings.

### Return Flow

```
Customer requests return (after delivery)
       ↓
Admin reviews → approves or rejects
       ↓
Admin assigns pickup partner
       ↓
Delivery partner visits customer → OTP verified → item picked up
       ↓
Admin processes refund ✓
```

### Delivery Partner Onboarding

Delivery partners cannot just register and start delivering. After registration, they submit their vehicle details and documents. The admin reviews and either approves or rejects their account. Only approved partners get access to the delivery dashboard.

---

## ✨ Key Features

- **OTP-based email verification** during signup and delivery confirmation
- **Google OAuth 2.0** login for customers
- **JWT authentication** with role-based access control
- **Real-time order tracking** across multiple stages
- **Automated email notifications** at every major event (order placed, status updated, OTP, return status)
- **Return management** with reverse pickup workflow
- **Support ticket system** for customers to report issues
- **Admin dashboard** with order stats and top product insights
- **Delivery partner rating** and completed delivery count tracking

---

## 📁 Project Structure

```
TrainingProject/
├── BackEnd/
│   └── shoplite/               ← Spring Boot project
│       └── src/main/java/
│           └── com/ecommerce/shoplite/
│               ├── config/     ← Security and CORS config
│               ├── controller/ ← REST API endpoints
│               ├── service/    ← Business logic
│               ├── repository/ ← Database operations
│               ├── entity/     ← Database models
│               ├── dto/        ← Request/Response objects
│               └── security/   ← JWT filter and utility
│
└── FrontEnd/
    └── shoplite/               ← React + Vite project
        └── src/
            ├── pages/
            │   ├── user/       ← Customer pages
            │   ├── admin/      ← Admin dashboard pages
            │   └── delivery/   ← Delivery partner pages
            ├── components/     ← Reusable UI components
            ├── context/        ← Cart global state
            └── api/            ← Axios instances
```

---

## ⚙️ How to Run the Project

### Requirements

- Java 21
- Maven
- Node.js and npm
- MySQL

### Backend

1. Create a MySQL database:

```sql
CREATE DATABASE shoplite_db;
```

2. Update `application.properties` with your database and email details:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shoplite_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.mail.username=your_email@gmail.com
spring.mail.password=your_gmail_app_password
```

3. Run the backend:

```bash
cd BackEnd/shoplite
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`

### Frontend

1. Install dependencies:

```bash
cd FrontEnd/shoplite
npm install
```

2. Update `.env`:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Start the app:

```bash
npm run dev
```

Runs on `http://localhost:5173`

---

## 🌱 What I Learned

- How to build and connect a full-stack application from scratch
- How to design a role-based system where each user type has different access
- How to model a real business workflow like order tracking and return management
- How to send automated emails using Spring Boot Mail
- How to integrate Google OAuth on both frontend and backend
