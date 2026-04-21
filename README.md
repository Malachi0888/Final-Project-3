# Task Management API

A RESTful backend API built with Node.js, Express, Sequelize, SQLite, JWT authentication, and role-based authorization. This project was designed to satisfy a backend final project requiring CRUD operations, relational database models, authentication, authorization, testing, deployment readiness, and documentation.

## Features

- User registration with bcrypt password hashing
- User login with JWT token generation
- Logout endpoint
- Role-based authorization with `admin` and `user`
- Ownership checks so normal users only manage their own data
- Three resource types:
  - Users
  - Categories
  - Tasks
- Full CRUD for tasks
- Category creation, reading, updating, and deleting
- Filtering tasks by status and category
- Pagination for task lists
- Unit/integration tests using Jest and Supertest
- Deployment-ready structure for Render

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- JWT
- bcrypt
- Jest
- Supertest

## Project Structure

```bash
config/
controllers/
middleware/
models/
routes/
tests/
postman/
app.js
server.js
README.md
```

## Installation

1. Clone the repository:

```bash
git clone <your-github-repo-url>
cd task-management-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```env
PORT=3000
JWT_SECRET=your_super_secret_key
DB_STORAGE=database.sqlite
NODE_ENV=development
```

4. Start the server:

```bash
npm run dev
```

Or:

```bash
npm start
```

## Default Admin Account

When the app starts for the first time, it creates a default admin account:

- Email: `admin@example.com`
- Password: `Admin123!`

Change this for production.

## API Endpoints

## Root
- `GET /` - API status message

## Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in and receive a JWT token
- `POST /auth/logout` - Authenticated logout response

### Register Example
```json
{
  "username": "malachi",
  "email": "malachi@example.com",
  "password": "Password123!",
  "role": "user"
}
```

### Login Example
```json
{
  "email": "malachi@example.com",
  "password": "Password123!"
}
```

## Users
- `GET /users` - Admin only; view all users
- `GET /users/:id` - Admin or same user

## Categories
- `POST /categories` - Create category
- `GET /categories` - Get categories
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

## Tasks
- `POST /tasks` - Create task
- `GET /tasks` - Get tasks with optional filtering and pagination
- `GET /tasks/:id` - Get one task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Task Query Parameters
- `status=pending`
- `categoryId=1`
- `page=1`
- `limit=10`

Example:

```bash
GET /tasks?status=pending&page=1&limit=5
```

## Authentication Guide

For protected routes, include the JWT token in the Authorization header:

```bash
Authorization: Bearer your_token_here
```

## Roles and Permissions

### User
- Register and log in
- Create, view, update, and delete their own tasks
- Create and manage their own categories
- View their own profile

### Admin
- View all users
- View all tasks
- Delete or manage any task/category when needed
- Access all user records

## Testing

Run tests with:

```bash
npm test
```

Included tests cover:
- user registration
- user login
- invalid login
- protected route blocking without token
- task creation
- admin-only route access
- user denial for admin-only route

## Deployment on Render

1. Push the project to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Use the following settings:

### Build Command
```bash
npm install
```

### Start Command
```bash
node server.js
```

### Environment Variables
- `JWT_SECRET`
- `PORT`
- `DB_STORAGE`

### Important Note
SQLite may reset in some cloud deployments. For persistent production storage, PostgreSQL is recommended.

## Postman Collection

A Postman collection is included in:

```bash
postman/Task-Management-API.postman_collection.json
```

Import it into Postman and update:
- `baseUrl`
- `token`

## Submission Checklist

- GitHub repository link
- Deployed API URL
- Updated README
- Postman collection

## Future Improvements

- Refresh tokens
- Password reset flow
- Better validation with express-validator
- PostgreSQL deployment
- Swagger/OpenAPI documentation
