# Task Manager — Prac 6: Full Stack React + Node + MongoDB

## Running the App

### 1. Backend (Express + MongoDB) — Terminal 1

```bash
cd task-manager-api-24IT091
npm start
```

Runs on **http://localhost:3000**

### 2. Frontend (React + Vite) — Terminal 2

```bash
cd task-manager-api-24IT091/client
npm run dev
```

Runs on **http://localhost:5173**

## Architecture

```
React Frontend (localhost:5173)
       |  fetch calls (api.js)
       v
Express Backend (localhost:3000)
       |  Mongoose
       v
  MongoDB Atlas
```

## Features
- Create, read, update, delete tasks
- Mark tasks complete/incomplete
- Priority levels (low / medium / high)
- Loading and error states on every API call
- Data persisted in MongoDB (survives refresh)
- Confirmation dialog before delete
