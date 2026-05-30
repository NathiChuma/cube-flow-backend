# Cube Flow Backend

Backend API for Cube Flow, a speedcubing performance tracking platform.

The API handles authentication, solve management, statistics calculations, validation, and communication with Firebase Firestore.

## Features

- User registration
- User authentication
- Password hashing using bcrypt
- Password recovery support
- Solve creation and storage
- Solve history retrieval
- User statistics calculation
- Backend validation
- Secure API endpoints

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Firebase Firestore
- bcrypt

## Architecture

The backend follows a layered architecture:

```txt
Routes
  ↓
Controllers
  ↓
Services
  ↓
Firestore
```

### Responsibilities

#### Routes
Handle API endpoint definitions.

#### Controllers
Handle requests and responses.

#### Services
Contain business logic and validation.

#### Firestore
Persistent storage for users and solves.

## Project Structure

```txt
src/
├── routes/
├── controllers/
├── services/
├── middleware/
├── types/
├── config/
└── utils/
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

## Environment Variables

Create a `.env` file.

```env
PORT=5000

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

```

## Authentication

### Registration
Passwords are hashed using bcrypt before storage.

### Login
Submitted passwords are compared against stored hashes.

## Validation

The backend performs validation to ensure:

- Required fields are present
- Duplicate accounts cannot be created
- Invalid data is rejected
- Solve data is valid before storage

## Statistics

The backend supports calculation of:

- Personal Best (PB)
- Average of 5 (Ao5)
- Average of 12 (Ao12)
- Solve counts

Ao5 follows official WCA-style rules:

1. Remove the fastest solve
2. Remove the slowest solve
3. Average the remaining solves

## Deployment

Backend is deployed and connected to Firebase Firestore.

## Author

Nkosinathi Chuma