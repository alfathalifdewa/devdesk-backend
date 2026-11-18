# DevDesk Backend

\<p align="center">   \<strong>A RESTful API for managing support tickets, built with Node.js, Express, and PostgreSQL.\</strong> \</p>

\<p align="center">   \<img src="[https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=nodedotjs\&logoColor=white)" alt="Node.js" />   \<img src="[https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white](https://img.shields.io/badge/Express-000000?style=for-the-badge\&logo=express\&logoColor=white)" alt="Express" />   \<img src="[https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge\&logo=postgresql\&logoColor=white)" alt="PostgreSQL" />   \<img src="[https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=black)" alt="JavaScript" /> \</p>

---

## Overview

**DevDesk Backend** is a RESTful API project designed to manage support tickets in a structured and efficient way.

The project focuses on implementing backend fundamentals and practical API development, including CRUD operations, database integration, request validation, pagination, and error handling.

Built with a simple yet maintainable architecture, DevDesk serves as a practical backend engineering project and a foundation for future improvements.

## Features

- **RESTful API** — Structured endpoints for managing support tickets.
- **CRUD Operations** — Create, retrieve, update, and delete tickets.
- **PostgreSQL Integration** — Persistent data storage using PostgreSQL and the `pg` library.
- **Pagination** — Retrieve ticket data in smaller, manageable batches.
- **Input Validation** — Validate request parameters and payloads before database operations.
- **Error Handling** — Handle invalid requests, missing records, and database errors.
- **Health Check** — Check whether the API is running.
- **Environment Configuration** — Keep database credentials and application settings in environment variables.

## Tech Stack

| Technology           | Purpose                         |
| -------------------- | ------------------------------- |
| Node.js              | JavaScript runtime              |
| Express.js 5         | Backend framework               |
| PostgreSQL           | Relational database             |
| node-postgres (`pg`) | PostgreSQL client               |
| dotenv               | Environment variable management |
| Nodemon              | Development server monitoring   |

## Project Structure

```text
devdesk-backend/
│
├── src/
│   ├── config/
│   │   └── database.js
│   │
│   ├── routes/
│   │   └── ticket.routes.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## Getting Started

Follow these steps to run DevDesk Backend locally.

### 1. Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

### 2. Clone the Repository

```bash
git clone https://github.com/alfathalifdewa/devdesk-backend.git
```

Navigate to the project directory:

```bash
cd devdesk-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=devdesk
DB_USER=postgres
DB_PASSWORD=your_password
```

Replace the database credentials with your local PostgreSQL configuration.

### 5. Prepare the Database

Create a PostgreSQL database named `devdesk`.

Make sure your database contains the required `users` and `tickets` tables, including the `user_id` relationship used by the ticket API.

### 6. Run the Application

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The server will start at:

```text
http://localhost:3000
```

## API Documentation

Base URL:

```text
http://localhost:3000/api/v1
```

### Health Check

Check the application status.

| Method | Endpoint  | Description            |
| ------ | --------- | ---------------------- |
| GET    | `/health` | Check API availability |

**Example Response**

```json
{
  "success": true,
  "message": "DevDesk API is running"
}
```

### Ticket Endpoints

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | `/tickets`     | Retrieve all tickets      |
| GET    | `/tickets/:id` | Retrieve a ticket by ID   |
| POST   | `/tickets`     | Create a new ticket       |
| PUT    | `/tickets/:id` | Update an existing ticket |
| DELETE | `/tickets/:id` | Delete a ticket           |

### 1. Get All Tickets

```http
GET /api/v1/tickets?page=1&limit=10
```

Supports pagination through query parameters:

| Parameter | Default | Description                              |
| --------- | ------- | ---------------------------------------- |
| `page`    | 1       | Page number                              |
| `limit`   | 10      | Number of records per page (maximum 100) |

### 2. Get Ticket by ID

```http
GET /api/v1/tickets/1
```

Returns a specific ticket based on its ID.

### 3. Create a Ticket

```http
POST /api/v1/tickets
Content-Type: application/json
```

**Request Body**

```json
{
  "title": "Unable to access dashboard",
  "priority": "high",
  "user_id": 1
}
```

**Priority Options**

- `low`
- `medium`
- `high`

### 4. Update a Ticket

```http
PUT /api/v1/tickets/1
Content-Type: application/json
```

**Request Body**

```json
{
  "title": "Dashboard access issue",
  "priority": "medium",
  "status": "in_progress"
}
```

**Status Options**

- `open`
- `in_progress`
- `resolved`

### 5. Delete a Ticket

```http
DELETE /api/v1/tickets/1
```

Deletes an existing ticket using its ID.

## Response Format

The API uses a consistent JSON response structure.

**Successful Response**

```json
{
  "success": true,
  "message": "Ticket retrieved successfully",
  "data": {
    "id": 1,
    "title": "Unable to access dashboard",
    "priority": "high",
    "status": "open",
    "user_id": 1
  }
}
```

**Error Response**

```json
{
  "success": false,
  "message": "Ticket not found"
}
```

## Development Focus

This project is developed with an emphasis on understanding and applying practical backend engineering concepts:

- RESTful API design and HTTP methods.
- Relational database integration.
- SQL queries and parameterized queries.
- Pagination and query optimization fundamentals.
- Request validation and HTTP status codes.
- Asynchronous JavaScript and error handling.
- Database relationships and foreign key constraints.
- Maintainable project structure.

## Future Improvements

The following features are potential improvements for future development:

- [ ] User authentication and authorization.
- [ ] Role-based access control.
- [ ] Advanced ticket filtering and searching.
- [ ] Sorting and pagination metadata.
- [ ] Middleware-based request validation.
- [ ] Centralized error handling.
- [ ] Automated testing.
- [ ] API documentation with Swagger / OpenAPI.
- [ ] Soft delete functionality.
- [ ] Deployment and production configuration.

## Author

**Alfathalif Dewa Listyoka**

Backend Developer Enthusiast

- GitHub: [@alfathalifdewa](https://github.com/alfathalifdewa)
- Portfolio: [alfathalifdewa.netlify.app](https://alfathalifdewa.netlify.app)

---

\<p align="center">
&#x20; \<sub>Built with Node.js, Express.js, and PostgreSQL.\</sub>
&#x20; \<br />
&#x20; \<sub>Learning, building, and improving one API at a time.\</sub>
\</p>
