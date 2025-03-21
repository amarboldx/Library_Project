# 📚 Library Management System

## Overview

The Library Management System is a full-stack web application designed to streamline library operations. Built with Java Spring Boot on the backend and React.js on the frontend, it provides an intuitive and efficient way to manage books, users, and transactions. The system uses MongoDB as the database and implements JWT authentication for secure access.

## ✨ Features

- 📖 **Book Management**: Add, update, delete, and search for books.
- 👥 **User Authentication**: Secure login and registration using JWT.
- 🎨 **Modern UI**: Built with React.js and styled with Ant Design (Antd).
- 🛠 **Admin Dashboard**: Manage users, books, and transactions.
- 🔍 **Search & Filtering**: Easily find books and manage library resources.
- 📡 **RESTful API**: Efficient API endpoints for frontend-backend communication.

## 🛠️ Tech Stack

### Backend
- **Java Spring Boot**: Backend framework
- **Spring Security**: Authentication & authorization
- **MongoDB**: NoSQL database
- **JWT (JSON Web Token)**: Secure authentication

### Frontend
- **React.js**: Frontend library
- **Ant Design (Antd)**: UI framework for styling
- **Axios**: HTTP client for API requests

### Other Technologies
- **Git & GitHub**: Version control

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js & npm
- MongoDB cluster installed & running
- Git installed
- IDE of your choice

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/amarboldx/Library_Project.git
cd Library_Project
```

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 3️⃣ Frontend Setup (React.js)
```bash
cd frontend
npm install
npm start
```

## 🔒 Environment Variables

### On Windows (using `setx`):
1. Open Command Prompt and run:
   ```bash
   setx MONGODB_URI "your_mongodb_connection_string"
   ```
2. Restart your Command Prompt to apply the changes.

### On Linux/Mac (using export):
1. Open your terminal and add the following lines to your ~/.bashrc or ~/.zshrc file:
    ```bash
    export MONGODB_URI="your_mongodb_connection_string"
    ```
2. After adding the lines, run:
    ```bash
    source ~/.bashrc  # or source ~/.zshrc for zsh users
    ```

Once set, these environment variables will be available to your backend application.

For the frontend, you can still configure API endpoints in src/config.js as required.

    Library_Project/frontend/src/components/Config/src.jsx

