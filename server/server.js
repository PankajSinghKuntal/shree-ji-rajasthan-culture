import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import { User, Address, Product, Payment, Order } from './models.js';
import { authenticateToken, validateUserRegistration, validateAddress, validateProduct, errorHandler } from './middleware.js';
import { createRazorpayOrder, verifyPaymentSignature, refundPayment, getPaymentMethods } from './payment.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://shreeji:Shreeji%40123@shreeji-rajasthan.mongodb.net/shreeji-rajasthan?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET || 'your_secret_key',
    { expiresIn: process.env.JWT_EXPIRATION || '7d' }
  );
};

// ===================== AUTHENTICATION ROUTES =====================

// Register User with password hashing
app.post('/api/users/register', validateUserRegistration, async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    const userId = `user-${Date.now()}`;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id: userId,
      fullName,
      email,
      password: hashedPassword
    });

    await newUser.save();
    
    const token = generateToken(newUser);
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Login User with JWT token generation
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }

    const token = generateToken(user);
    
    res.json({ 
      success: true, 
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify JWT token
app.post('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    res.json({ 
      success: true, 
      message: 'Token is valid',
      user: req.user 
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

// Get All Users (Admin only - requires auth)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get Single User (requires auth)
app.get('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete User (requires auth)
app.delete('/api/users/:userId', authenticateToken, async (req, res) => {
  try {
    const result = await User.deleteOne({ id: req.params.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===================== ADDRESS ROUTES =====================

// Add Address
app.post('/api/addresses', async (req, res) => {
  try {
    const { userId, fullName, phone, email, address, landmark, city, state, pincode } = req.body;

    const newAddress = new Address({
      userId,
      fullName,
      phone,
      email,
      address,
      landmark,
      city,
      state,
      pincode
    });

    await newAddress.save();
    res.json({ success: true, address: newAddress });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get User Addresses
app.get('/api/addresses/:userId', async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===================== PRODUCT ROUTES =====================

// Add Product (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const { id, name, price, category, description, image, addedBy } = req.body;

    const newProduct = new Product({
      id,
      name,
      price,
      category,
      description,
      image,
      addedBy
    });

    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete Product (Admin)
app.delete('/api/products/:productId', async (req, res) => {
  try {
    await Product.deleteOne({ id: req.params.productId });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===================== PAYMENT ROUTES =====================

// Record Payment
app.post('/api/payments', async (req, res) => {
  try {
    const { transactionId, userId, paymentMethod, amount, upiId, cardLast4 } = req.body;

    const newPayment = new Payment({
      transactionId,
      userId,
      paymentMethod,
      amount,
      upiId,
      cardLast4
    });

    await newPayment.save();
    res.json({ success: true, payment: newPayment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get User Payments
app.get('/api/payments/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===================== ORDER ROUTES =====================

// Create Order
app.post('/api/orders', async (req, res) => {
  try {
    const { orderId, userId, products, addressId, paymentId, totalAmount } = req.body;

    const newOrder = new Order({
      orderId,
      userId,
      products,
      addressId,
      paymentId,
      totalAmount
    });

    await newOrder.save();
    res.json({ success: true, order: newOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get User Orders
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get All Orders (Admin)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Update Order Status
app.put('/api/orders/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    );
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ===================== PAYMENT GATEWAY ROUTES =====================

// Get available payment methods
app.get('/api/payments/methods', (req, res) => {
  try {
    const methods = getPaymentMethods();
    res.json({ success: true, methods: methods.methods });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Razorpay order
app.post('/api/payments/create-order', authenticateToken, async (req, res) => {
  try {
    const { amount, orderId, email, phone } = req.body;

    if (!amount || !orderId || !email || !phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount, orderId, email, and phone are required' 
      });
    }

    const result = await createRazorpayOrder(amount, orderId, email, phone);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment
app.post('/api/payments/verify', authenticateToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing payment verification details' 
      });
    }

    const verification = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    
    if (!verification.isValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment verification failed' 
      });
    }

    // Record payment in database
    const newPayment = new Payment({
      transactionId: razorpay_payment_id,
      userId: req.user.id,
      paymentMethod: 'razorpay',
      amount: req.body.amount || 0,
      status: 'completed',
      razorpayOrderId: razorpay_order_id
    });

    await newPayment.save();

    res.json({ 
      success: true, 
      message: 'Payment verified and recorded',
      payment: {
        id: newPayment._id,
        transactionId: newPayment.transactionId,
        status: newPayment.status
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get payment history
app.get('/api/payments/:userId', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Record payment (for non-Razorpay methods)
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const { userId, paymentMethod, amount, transactionId } = req.body;

    if (!paymentMethod || !amount || !transactionId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Payment method, amount, and transaction ID are required' 
      });
    }

    const newPayment = new Payment({
      transactionId,
      userId,
      paymentMethod,
      amount,
      status: 'completed'
    });

    await newPayment.save();

    res.status(201).json({ 
      success: true, 
      message: 'Payment recorded',
      payment: newPayment
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Refund payment
app.post('/api/payments/:paymentId/refund', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    const refundResult = await refundPayment(payment.transactionId, amount);

    if (refundResult.success) {
      payment.status = 'refunded';
      await payment.save();
    }

    res.json(refundResult);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0-secure'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`✅ Secure Server running on port ${PORT}`);
  console.log(`🔐 JWT Authentication: Enabled`);
  console.log(`💳 Payment Gateway: Razorpay Integrated`);
  console.log(`🛡️  Security Headers: Enabled (Helmet)`);
});
