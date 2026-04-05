# Finance Data Processing & Access Control Backend

## Overview

This project is a backend system for a finance dashboard that manages financial records with role-based access control. It provides APIs for handling transactions, user management, and generating analytical insights such as summaries, category breakdowns, and trends.

The system is designed with a focus on clean architecture, maintainability, and real-world backend practices.

---

## Features

### User & Role Management

* User registration and login with JWT authentication
* Role-based access control (Admin, Analyst, Viewer)
* Admin can:

  * Update user roles
  * Activate/deactivate users (`isActive`)
* Inactive users are restricted from accessing the system

---

### Financial Records Management

* Create, update, delete transactions
* Fetch transactions with:

  * Filtering (type, category, date range)
  * Search (category, notes)
  * Pagination support

---

### Dashboard APIs

* Summary:

  * Total income
  * Total expenses
  * Net balance
* Category-wise breakdown (with type separation)
* Monthly trends:

  * Income
  * Expense
  * Net balance
* Recent activity (latest transactions)

---

### Access Control

* Middleware-based authentication
* Role-based authorization:

  * Admin → full access
  * Analyst → read access + analytics
  * Viewer → restricted access

---

### Validation & Error Handling

* Input validation using Zod
* Structured error responses
* Proper HTTP status codes
* Protection against invalid inputs and operations

---

### Data Persistence

* MongoDB with Mongoose
* Structured schemas for Users and Transactions

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT (Authentication)
* Zod (Validation)

---

## Project Structure

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middlewares/
 ├── utils/
 ├── config/
 └── app.js
```

---

## Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/astleligo/zorvyn-backend-assessment.git
cd zorvyn-backend-assessment
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

### 4. Run the server

```
npm run dev
```

---

## API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Users (Admin only)

* `PATCH /api/users/:id/role`
* `PATCH /api/users/:id/status`

### Transactions

* `POST /api/transactions`
* `GET /api/transactions`
* `PUT /api/transactions/:id`
* `DELETE /api/transactions/:id`

Query Params:

* `type`
* `category`
* `startDate`, `endDate`
* `search`
* `page`, `limit`

### Dashboard

* `GET /api/dashboard/summary`
* `GET /api/dashboard/categories`
* `GET /api/dashboard/trends`
* `GET /api/dashboard/recent`

---

## Example Requests & Responses

### Register

**POST /api/auth/register**

```json
{
  "name": "Admin",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

**Response**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "user_id",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

---

### Login

**POST /api/auth/login**

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

**Response**

```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

---

### Create Transaction

**POST /api/transactions**

Headers:

```
Authorization: Bearer <token>
```

```json
{
  "amount": 5000,
  "type": "income",
  "category": "salary",
  "notes": "Monthly salary"
}
```

---

### Get Transactions (Pagination + Search)

```
GET /api/transactions?search=food&page=1&limit=5
```

**Response**

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 20,
    "page": 1,
    "limit": 5,
    "totalPages": 4
  }
}
```

---

### Dashboard Summary

```
GET /api/dashboard/summary
```

**Response**

```json
{
  "totalIncome": 50000,
  "totalExpense": 20000,
  "netBalance": 30000
}
```

---

### Monthly Trends

```
GET /api/dashboard/trends
```

**Response**

```json
[
  {
    "_id": { "month": 1, "year": 2026 },
    "income": 50000,
    "expense": 20000,
    "netBalance": 30000
  }
]
```

---

### Recent Activity

```
GET /api/dashboard/recent
```

**Response**

```json
{
  "success": true,
  "data": [
    {
      "amount": 5000,
      "type": "income",
      "category": "salary"
    }
  ]
}
```

---

## Design Decisions & Assumptions

* Role-based access is enforced via middleware for scalability
* Admin manages roles directly to keep system simple
* `isActive` is used instead of deleting users
* Aggregations are used for efficient dashboard calculations
* Pagination & search simulate real-world APIs

---

## Trade-offs

* No frontend (focus on backend as per assignment)
* No unit tests due to time constraints
* No rate limiting to keep scope focused

---

## Additional Improvements

* Pagination support
* Search functionality
* Recent activity endpoint
* Structured API responses
* Centralized error handling

---

## Conclusion

This project demonstrates backend engineering skills including API design, access control, data modeling, and analytical data processing. The system is built with a focus on clarity, maintainability, and real-world backend practices.

---

## Repository

https://github.com/astleligo/zorvyn-backend-assessment
