# Inventory Management Web Application

A React web application with Node.js backend for managing inventory items.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Modern web browser

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the server directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/inventory_db
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Features

- View inventory items in a table format
- Add new items with a form
- Edit existing items
- Track item quantities and prices
- Categorize items
- Specify item locations

## Project Structure

```
├── client/                 # React frontend
│   ├── components/        # Reusable components
│   ├── screens/           # Screen components
│   ├── App.js            # Main application component
│   └── package.json      # Frontend dependencies
│
└── server/               # Node.js backend
    ├── models/          # MongoDB models
    ├── server.js        # Express server
    └── package.json     # Backend dependencies
```

## API Endpoints

- GET /api/inventory - Get all inventory items
- GET /api/inventory/:id - Get a specific inventory item
- POST /api/inventory - Create a new inventory item
- PUT /api/inventory/:id - Update an existing inventory item
- DELETE /api/inventory/:id - Delete an inventory item