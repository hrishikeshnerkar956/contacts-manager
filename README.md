# Contacts Manager – CRUD Web Application

## Overview
A simple CRUD web application to manage contacts with name, email, and phone.

## Features
- Create, Read, Update, Delete contacts
- Email uniqueness & format validation
- Phone length validation
- Search by name/email
- Sorting by name/email
- SQLite persistence
- Dockerized backend

## Tech Stack
- Backend: Node.js, Express
- Database: SQLite
- Frontend: HTML, CSS, JavaScript
- Docker

## Setup Instructions

### Without Docker
```bash
cd backend
npm install
npm start

## With Docker
docker-compose up --build

## API Endpoints

- POST /api/contacts
- GET /api/contacts
- GET /api/contacts/:id
- PUT /api/contacts/:id
- DELETE /api/contacts/:id