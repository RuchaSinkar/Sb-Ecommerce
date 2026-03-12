# Spring Boot + React E-Commerce Application

![Java](https://img.shields.io/badge/Java-21-blue) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen) ![React](https://img.shields.io/badge/React-18-blueviolet) ![License](https://img.shields.io/badge/License-MIT-lightgrey)

A full-stack **Spring Boot + React** e-commerce application with authentication, authorization, and admin/customer functionalities.

---

## Overview

This project is a complete e-commerce solution demonstrating:

- **Backend:** REST APIs with Spring Boot, JWT-based authentication, and role-based access  
- **Frontend:** React SPA for customers and admin dashboard  
- **Functionality:** Product & category management, file uploads, secure login/signup, structured API responses  

---

## Features

### Backend
- JWT-based authentication & role-based authorization  
- User registration and login (USER/ADMIN)  
- CRUD operations for products and categories  
- Upload and serve product images  
- Structured API responses using DTOs  
- Exception handling for invalid requests  

### Frontend
- React-based responsive UI  
- Customer features: view products, add to cart, checkout  
- Admin dashboard: manage products, categories, and orders  
- Integration with backend REST APIs  

---

## Technologies Used

- **Backend:** Java 21, Spring Boot 3.x, Spring Security + JWT, Maven  
- **Frontend:** React 18, Vite, JavaScript, CSS  
- **Database:** H2 / MySQL (configurable via `application.properties`)  
- **Tools:** Postman / Swagger, Git  

---

## Project Structure
│
├─ frontend/
│ └─ ecom-frontend/ # React frontend
│ ├─ src/ # React components and store
│ ├─ public/ # Static files
│ └─ package.json etc.
│
├─ sb-ecom/ # Spring Boot backend
│ ├─ src/ # Java source code
│ │ ├─ config/ # App configuration
│ │ ├─ controller/ # REST controllers
│ │ ├─ exception/ # Custom exceptions
│ │ ├─ model/ # Entities
│ │ ├─ payload/ # DTOs & responses
│ │ ├─ repository/ # JPA repositories
│ │ ├─ security/ # Security & JWT
│ │ └─ service/ # Business logic
│ ├─ images/ # Product images
│ ├─ pom.xml
│ ├─ mvnw, mvnw.cmd
│ └─ application.properties
---

## How to Run

1. Clone the repository:

    ```bash
    git clone https://github.com/RuchaSinkar/sb-ecom.git
    cd sb-ecom
    ```

2. Build the project with Maven:

    ```bash
    mvn clean install
    ```

3. Run the Spring Boot application:

    ```bash
    mvn spring-boot:run
    ```

4. Access secured endpoints:

    - `/api/auth/**` → for login/signup
    - `/api/products/**` → product-related operations
    - `/api/categories/**` → category-related operations

5. Frontend

    ```bash
    cd frontend/ecom-frontend
    npm install
    npm start
    ```
Runs on: http://localhost:5173 (Vite default)

API calls point to backend on port 8080
## Notes

- Configure your database and JWT secret in `application.properties`.
- Passwords are securely stored using BCrypt encoding.
- Use tools like Postman or Swagger to test APIs.
- Frontend can be extended with new components easily

## License

This project is open source and available under the MIT License.
