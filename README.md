# HabTrack API

A simple REST API built with JavaScript and Express for tracking daily habits.

📚 Full project documentation, including QA strategy, test cases, bug reporting standards and API behavior details, is available in the [Wiki](https://github.com/luancmnt/habtrack/wiki).

## Features

### Authentication
- User registration (`name`, `email`, `password`)
- User login with JWT authentication
- Protected routes using Bearer token
- Logout using in-memory token blacklist

### Habits
- Get all habits for the authenticated user
- Create new habits
- Update existing habits
- Delete habits
- Mark and unmark habits as completed for the current day
- Validation for required fields (like `name`)

## Project structure

```text
.
|-- server.js
|-- src
|   |-- app.js
|   |-- controllers
|   |-- docs
|   |-- middlewares
|   |-- models
|   |-- routes
|   `-- services
`-- README.md
```

## How to configure

### 1. Install dependencies:

```bash
npm install express swagger-ui-express swagger-jsdoc jsonwebtoken
```

### 2. OPTIONAL - Create a .env file in the root of the project:

```bash
PORT=3000
JWT_SECRET=your-secret-dev
```

If JWT_SECRET is not provided, default value will be used - `habtrack-secret-dev`.

## How to run

```bash
npm start
```

The API will be running at:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Test Documentation

The automated test documentation is available in [test/README.md](./test/README.md).

## Main endpoints

### Public routes

- `POST /api/auth/register`
- `POST /api/auth/login`

### Protected routes (require Bearer token)

- `POST /api/auth/logout`
- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/:id`
- `DELETE /api/habits/:id`
- `PATCH /api/habits/:id/today`

## Quick usage example

### 1. Register a user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Luana","email":"luana@email.com","password":"123456"}'
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"luana@email.com","password":"123456"}'
```

### 3. Create a habit

```bash
curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Drink water","description":"2 liters per day"}'
```

### 4. Mark habit as done today

```bash
curl -X PATCH http://localhost:3000/api/habits/1/today \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"completed":true}'
```

### 5. Unmark habit

```bash
curl -X PATCH http://localhost:3000/api/habits/1/today \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"completed":false}'
```

## Notes

- All data is stored in memory only.
- Restarting the server will reset users, habits, and tokens.
