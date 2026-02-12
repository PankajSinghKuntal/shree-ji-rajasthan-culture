# Database Schema & Data Management

## MongoDB Collections

### 1. Users Collection
Stores user registration and login information.

**Schema:**
```javascript
{
  _id: ObjectId,
  id: "user-1707301234567",           // Unique identifier
  fullName: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  createdAt: ISODate("2024-02-07")
}
```

**Indexes:**
- `id` (unique)
- `email` (unique)

---

### 2. Addresses Collection
Stores delivery addresses for users.

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: "user-1707301234567",
  fullName: "John Doe",
  phone: "9876543210",
  email: "john@example.com",
  address: "123 Main Street, Building A",
  landmark: "Near the market",
  city: "Jaipur",
  state: "Rajasthan",
  pincode: "302001",
  isDefault: true,
  createdAt: ISODate("2024-02-07")
}
```

**Use Cases:**
- Multiple delivery addresses per user
- Default address for quick checkout
- Order fulfillment

---

### 3. Products Collection
Stores all products (default + admin-added).

**Schema:**
```javascript
{
  _id: ObjectId,
  id: "prod-unique-id",
  name: "Rajasthani Saree",
  price: 2500,
  category: "Clothes",
  description: "Beautiful traditional Rajasthani saree",
  image: "https://example.com/image.jpg",
  addedBy: "admin",  // "admin" for default, userId for admin-added
  createdAt: ISODate("2024-02-07")
}
```

**Categories:**
- Clothes
- Jewellery
- Flower Tea
- Home Decor

**Important:**
- Products are never deleted from database
- Deleted products can be restored
- Admin can also restore deleted products

---

### 4. Payments Collection
Records all payment transactions.

**Schema:**
```javascript
{
  _id: ObjectId,
  transactionId: "TXN-1707301234567",  // Unique transaction ID
  userId: "user-1707301234567",
  paymentMethod: "upi",  // credit-card, debit-card, upi, netbanking, wallet, my-account, cod
  amount: 7500,
  status: "completed",  // completed, pending, failed
  upiId: "7060785647@ptsbi",  // For UPI/My Account
  cardLast4: "4242",  // For card payments
  createdAt: ISODate("2024-02-07T10:30:00Z")
}
```

**Payment Methods:**
- **credit-card**: Card number, expiry, CVV
- **debit-card**: Card number, expiry, CVV
- **upi**: UPI ID
- **netbanking**: Bank selection
- **wallet**: Wallet ID
- **my-account**: Direct UPI to 7060785647@ptsbi
- **cod**: No payment details needed

---

### 5. Orders Collection
Stores completed orders with all details.

**Schema:**
```javascript
{
  _id: ObjectId,
  orderId: "ORD-1707301234567",
  userId: "user-1707301234567",
  products: [
    {
      id: "prod-unique-id",
      name: "Rajasthani Saree",
      price: 2500,
      quantity: 2,
      image: "https://example.com/image.jpg"
    }
  ],
  addressId: "address-mongo-id",
  paymentId: "TXN-1707301234567",
  totalAmount: 5000,
  status: "confirmed",  // confirmed, shipped, delivered, cancelled
  createdAt: ISODate("2024-02-07T10:35:00Z")
}
```

**Order Status Flow:**
1. **confirmed** - Order placed and payment received
2. **shipped** - Admin marks as shipped
3. **delivered** - Customer or admin marks as delivered
4. **cancelled** - Order cancelled by customer or admin

---

## Data Relationships

```
User (1) ── (Many) Addresses
          ── (Many) Orders
          ── (Many) Payments

Order (1) ── (1) Payment
         ── (1) Address
         ── (Many) Products

Product (Many) ── (Many) Orders
```

---

## Data Persistence Strategies

### Frontend (localStorage)
```javascript
// Products (persist across sessions)
localStorage.setItem('products', JSON.stringify(products));

// Users (login state)
localStorage.setItem('users', JSON.stringify(users));
localStorage.setItem('currentUser', JSON.stringify(currentUser));

// Cart (temporary, cleared on refresh)
// Not persistent - cleared when page refreshes
```

### Backend (MongoDB)
```javascript
// All permanent data:
- Users & Authentication
- Addresses
- All Products (live + deleted)
- Payment Transactions
- Orders & Status
```

---

## Query Examples

### Get All Orders for a User
```javascript
db.orders.find({ userId: "user-1707301234567" })
```

### Get All Payments for a User
```javascript
db.payments.find({ userId: "user-1707301234567" })
```

### Get All Products in a Category
```javascript
db.products.find({ category: "Clothes" })
```

### Get Pending Orders
```javascript
db.orders.find({ status: "confirmed" })
```

### Get Transaction by ID
```javascript
db.payments.findOne({ transactionId: "TXN-1707301234567" })
```

---

## Admin Operations

### Add Product
```javascript
db.products.insertOne({
  id: "prod-new",
  name: "New Product",
  price: 1000,
  category: "Clothes",
  description: "Product description",
  image: "https://...",
  addedBy: "admin-user-id",
  createdAt: new Date()
})
```

### Delete Product (Soft Delete Recommended)
```javascript
// Option 1: Remove completely
db.products.deleteOne({ id: "prod-id" })

// Option 2: Add deleted flag
db.products.updateOne({ id: "prod-id" }, { $set: { deleted: true } })
```

### Update Order Status
```javascript
db.orders.updateOne(
  { orderId: "ORD-1707301234567" },
  { $set: { status: "shipped" } }
)
```

### Get User Statistics
```javascript
db.users.countDocuments()           // Total users
db.orders.countDocuments()          // Total orders
db.payments.aggregate([             // Total revenue
  { $group: { _id: null, total: { $sum: "$amount" } } }
])
```

---

## Backup & Recovery

### MongoDB Atlas Backup
- Automatic daily backups enabled
- Manual backup option available
- Point-in-time recovery (last 35 days)

### Local Data Recovery
If a product is deleted:
1. Check MongoDB Atlas backup
2. Restore from backup point
3. Or export deleted products list and re-add

---

## Security Considerations

### Current Status ⚠️
This is a development setup. For production:

1. **Password Hashing**
   - Implement bcrypt instead of plain text
   - Never store plain passwords

2. **API Authentication**
   - Add JWT tokens
   - Implement role-based access control

3. **Data Validation**
   - Validate all inputs server-side
   - Sanitize user inputs

4. **MongoDB Connection**
   - Use environment variables (✓ already done)
   - Enable SSL/TLS (✓ already enabled in connection string)
   - IP whitelist in MongoDB Atlas (configure as needed)

5. **Payment Information**
   - Never store full card numbers
   - Use tokenization for cards
   - Store only last 4 digits

---

## Monitoring & Maintenance

### Check Connection
```bash
curl http://localhost:5000/api/health
```

### Database Statistics
- Open MongoDB Atlas dashboard
- View database size
- Monitor connection count
- Check slow queries

### Common Issues
- **Connection timeout**: Check internet, IP whitelist in MongoDB Atlas
- **Duplicate entries**: Check unique indexes
- **Missing data**: Check MongoDB backups

---

## Contact & Support

For MongoDB Atlas issues: https://www.mongodb.com/cloud/atlas
For backend errors: Check server logs and browser console
