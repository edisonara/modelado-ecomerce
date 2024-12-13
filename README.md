# Luxury Liquor Store

A modern web application for a luxury liquor store with product management and shopping cart functionality.

## Features

- Modern and luxurious UI design
- Product listing with detailed information
- Shopping cart functionality
- Responsive design for all devices

## Tech Stack

- Backend: Node.js, Express, MongoDB
- Frontend: React, Material-UI
- Database: MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed and running locally
- npm or yarn package manager

## Installation

1. Clone the repository
2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

## Running the Application

1. Start MongoDB service

2. Start the backend server:
```bash
cd backend
npm start
```
The backend will run on http://localhost:5000

3. Start the frontend development server:
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

## API Endpoints

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get a single product
- POST /api/products - Create a new product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product

### Cart
- GET /api/cart - Get cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/update/:productId - Update cart item quantity
- DELETE /api/cart/remove/:productId - Remove item from cart
