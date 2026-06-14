# Spring Boot E-Commerce Application

A full-stack **Spring Boot** project implementing authentication, authorization, and basic e-commerce functionality.

---

## Overview

This project demonstrates a backend for an e-commerce application with the following features:

- **Authentication & Authorization** using Spring Security and JWT
- **User Management** with roles and secure login/signup
- **Product & Category Management**
- **File Upload/Download** for product images
- Structured API responses with DTOs

---

## Features

- User registration and login (JWT-based)
- Role-based access control (e.g., USER, ADMIN)
- Add, update, and view products and categories
- Upload product images
- Clean API response structure using DTOs
- Exception handling for invalid requests

---

## Technologies Used

- Java 21
- Spring Boot 3.x
- Spring Security + JWT
- Maven
- H2 or MySQL (configurable via `application.properties`)
- Lombok

---

## Project Structure

com.ecommerce.project
├─ config/ # Application configurations
├─ controller/ # REST controllers (Auth, Product, Category)
├─ exception/ # Custom exceptions
├─ model/ # Entities (User, Role, Product, Category, Address)
├─ payload/ # DTOs & response models
├─ repository/ # JPA Repositories
├─ security/ # Security configurations
│ ├─ jwt/ # JWT utilities and filters
│ ├─ request/ # Authentication requests (Login, Signup)
│ └─ response/ # Auth-related response DTOs
├─ service/ # Business logic & service implementations


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

## Notes

- Configure your database and JWT secret in `application.properties`.
- Passwords are securely stored using BCrypt encoding.
- Use tools like Postman or Swagger to test APIs.

## License

This project is open source and available under the MIT License.
