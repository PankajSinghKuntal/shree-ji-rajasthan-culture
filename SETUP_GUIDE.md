# Shree Ji Rajasthan Culture - Setup Instructions

## Project Overview

This is a full-stack e-commerce platform with:
- **Frontend**: React + TypeScript + Tailwind CSS (Vite)
- **Backend**: Node.js + Express + MongoDB
- **Features**: User authentication, product management, shopping cart, address management, payments, and order management

---

## Database Setup

### MongoDB Connection

Your MongoDB Atlas connection string is configured in `/server/.env`:
```
MONGODB_URI=mongodb+srv://shreeji:Shreeji@123@shreeji-rajasthan.mongodb.net/shreeji-rajasthan?retryWrites=true&w=majority
```

#### Collections Created:
1. **users** - User login details
2. **addresses** - Delivery addresses
3. **products** - Products (default + admin-added)
4. **payments** - Payment transaction records
5. **orders** - Order details and status

---

## Payment Methods Available

1. **Credit Card** - Full card details required
2. **Debit Card** - Full card details required
3. **UPI** - UPI ID required
4. **Net Banking** - Supported by all major Indian banks
5. **Digital Wallet** - Paytm, Amazon Pay, etc.
6. **My Account (PTSBI)** - UPI: `7060785647@ptsbi`
   - Direct transfer to the shop owner's account
7. **Cash on Delivery** - Payment on delivery

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will run on `http://localhost:5173` (default Vite port)

---

## Backend Setup

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Create `.env` File
The `.env` file is already configured with:
```
MONGODB_URI=mongodb+srv://shreeji:Shreeji@123@shreeji-rajasthan.mongodb.net/shreeji-rajasthan?retryWrites=true&w=majority
PORT=5000
```

### 3. Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

The API server will run on `http://localhost:5000`

---

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (admin)
- `DELETE /api/users/:userId` - Delete user

### Addresses
- `POST /api/addresses` - Add delivery address
- `GET /api/addresses/:userId` - Get user addresses

### Products
- `POST /api/products` - Add product (admin)
- `GET /api/products` - Get all products
- `DELETE /api/products/:productId` - Delete product (admin)

### Payments
- `POST /api/payments` - Record payment
- `GET /api/payments/:userId` - Get user payments

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/:userId` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:orderId` - Update order status

### Health
- `GET /api/health` - Check server status

---

## Data Persistence

### Frontend Data:
- **Users & Authentication**: Stored in localStorage
- **Products**: Stored in localStorage (persists after refresh)
- **Cart Items**: Stored in component state (cleared on refresh)

### Backend Data:
- **All user data** (login, addresses): MongoDB
- **All products** (including admin-added): MongoDB & localStorage
- **Payments & Orders**: MongoDB

---

## Admin Features

### Add Products
1. Go to Admin Panel (🔧 Admin button in navbar)
2. Click "Add Product"
3. Fill in product details:
   - Product Name
   - Price
   - Category (Clothes, Jewellery, Flower Tea, Home Decor)
   - Description
   - Image URL
4. Click "Add Product"
5. Product will appear immediately and persist across browser refreshes

### Delete Products
1. In Admin Panel, click "Delete" next to any product
2. Product will be removed from the store

### View All Users
- See registered users in Admin Panel
- Delete user accounts if needed

---

## Checkout Flow

1. **Add to Cart** → Click product's "Add to Cart" button
2. **Cart** → Click 🛒 in navbar to view cart
3. **Proceed to Checkout** → Enter delivery address details
4. **Payment** → Select payment method:
   - Cards (Credit/Debit)
   - UPI
   - Net Banking
   - Wallet
   - My Account (UPI: 7060785647@ptsbi)
   - Cash on Delivery
5. **Confirm Order** → Order is saved to MongoDB

---

## How "My Account" Payment Works

When a customer selects **"My Account (PTSBI)"**:
1. They see the UPI ID: `7060785647@ptsbi`
2. They can use any UPI app to scan/send payment to this account
3. The transaction ID is recorded in MongoDB
4. Order status is "confirmed" and awaits actual payment
5. Once payment is received in the account, mark order as "received"

---

## Troubleshooting

### Backend Connection Issues
```bash
# Check if server is running
curl http://localhost:5000/api/health

# Check MongoDB connection
# Make sure you have internet access
# MongoDB Atlas might block your IP - check IP whitelist
```

### Products Not Persisting
- Products are saved in MongoDB and localStorage
- Clear browser cache if you see old data
- Check browser console for errors

### Payment Issues
- Each payment method has validation
- Check console logs for error messages
- Ensure all required fields are filled

---

## Environment Variables

### `.env` (Server)
```
MONGODB_URI=mongodb+srv://shreeji:Shreeji@123@shreeji-rajasthan.mongodb.net/shreeji-rajasthan?retryWrites=true&w=majority
PORT=5000
```

---

## Technologies Used

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Vite** - Frontend Build Tool
- **Express.js** - Backend Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - MongoDB ODM

---

## Contact

For any issues or questions, check the MongoDB Atlas dashboard or the browser console for error messages.

**Shop Account for Payments**: UPI ID `7060785647@ptsbi`
