import jwt from 'jsonwebtoken';
import validator from 'validator';

// JWT Authentication Middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Input Validation Middleware
export const validateUserRegistration = (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Full name, email, and password are required' 
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format' 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Password must be at least 6 characters' 
    });
  }

  if (fullName.length < 2) {
    return res.status(400).json({ 
      success: false, 
      error: 'Full name must be at least 2 characters' 
    });
  }

  next();
};

// Validate Address
export const validateAddress = (req, res, next) => {
  const { fullName, phone, email, address, city, state, pincode } = req.body;

  if (!fullName || !phone || !email || !address || !city || !state || !pincode) {
    return res.status(400).json({ 
      success: false, 
      error: 'All address fields are required' 
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email format' 
    });
  }

  if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    return res.status(400).json({ 
      success: false, 
      error: 'Phone number must be 10 digits' 
    });
  }

  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Pincode must be 6 digits' 
    });
  }

  next();
};

// Validate Product
export const validateProduct = (req, res, next) => {
  const { name, price, description, category, image } = req.body;

  if (!name || !price || !description || !category || !image) {
    return res.status(400).json({ 
      success: false, 
      error: 'All product fields are required' 
    });
  }

  if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Price must be a positive number' 
    });
  }

  if (name.length < 3) {
    return res.status(400).json({ 
      success: false, 
      error: 'Product name must be at least 3 characters' 
    });
  }

  next();
};

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false, 
      error: 'Validation Error: ' + Object.values(err.errors).map(e => e.message).join(', ') 
    });
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ 
      success: false, 
      error: `${field} already exists` 
    });
  }

  res.status(err.status || 500).json({ 
    success: false, 
    error: err.message || 'Internal Server Error' 
  });
};

// Rate Limiting for sensitive endpoints (called manually)
export const createRateLimiter = (windowMs, maxRequests) => {
  const store = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    
    if (!store.has(key)) {
      store.set(key, []);
    }
    
    const times = store.get(key).filter(time => now - time < windowMs);
    
    if (times.length >= maxRequests) {
      return res.status(429).json({ 
        success: false, 
        error: 'Too many requests. Please try again later.' 
      });
    }
    
    times.push(now);
    store.set(key, times);
    next();
  };
};

export default {
  authenticateToken,
  validateUserRegistration,
  validateAddress,
  validateProduct,
  errorHandler
};
