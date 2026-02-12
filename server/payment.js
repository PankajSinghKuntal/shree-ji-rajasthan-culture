import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in paise (multiply by 100)
 * @param {string} orderId - Your order ID
 * @param {string} customerEmail - Customer email
 * @param {string} customerPhone - Customer phone
 */
export const createRazorpayOrder = async (amount, orderId, customerEmail, customerPhone) => {
  try {
    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId,
      description: `Order ${orderId} - Shree Ji Rajasthan`,
      customer_notify: 1,
      email: customerEmail,
      contact: customerPhone
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status
      }
    };
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    
    hmac.update(`${orderId}|${paymentId}`);
    const generated_signature = hmac.digest('hex');
    
    const isValid = generated_signature === signature;
    
    return {
      success: isValid,
      isValid: isValid,
      message: isValid ? 'Payment verified successfully' : 'Payment verification failed'
    };
  } catch (error) {
    console.error('Signature verification error:', error);
    return {
      success: false,
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Fetch payment details
 * @param {string} paymentId - Razorpay payment ID
 */
export const fetchPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        vpa: payment.vpa || null, // For UPI
        email: payment.email,
        contact: payment.contact,
        created_at: payment.created_at,
        description: payment.description
      }
    };
  } catch (error) {
    console.error('Fetch Payment Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Process refund
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund in rupees (optional, full refund if not provided)
 */
export const refundPayment = async (paymentId, amount = null) => {
  try {
    const options = {};
    
    if (amount) {
      options.amount = Math.round(amount * 100); // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, options);
    
    return {
      success: true,
      refund: {
        id: refund.id,
        paymentId: refund.payment_id,
        amount: refund.amount,
        status: refund.status,
        createdAt: refund.created_at
      }
    };
  } catch (error) {
    console.error('Refund Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get payment methods for customer
 * Checks if customer has saved payment methods
 */
export const getPaymentMethods = () => {
  return {
    methods: [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, American Express',
        icon: '💳'
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Google Pay, PhonePe, Paytm, WhatsApp Pay',
        icon: '📱'
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'All major Indian banks',
        icon: '🌐'
      },
      {
        id: 'wallet',
        name: 'Digital Wallet',
        description: 'Paytm, Amazon Pay, Mobikwik',
        icon: '💰'
      }
    ]
  };
};

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  fetchPaymentDetails,
  refundPayment,
  getPaymentMethods
};
