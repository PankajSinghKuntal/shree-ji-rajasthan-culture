import React, { useState } from 'react';

interface AddressDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentMethod: string, transactionId?: string) => void;
  onBack: () => void;
  cartTotal: number;
  address: AddressDetails | null;
}

type PaymentMethod = 'credit-card' | 'debit-card' | 'upi' | 'netbanking' | 'wallet' | 'my-account' | 'cod';

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onBack,
  cartTotal,
  address
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUpiForm, setShowUpiForm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const paymentMethods = [
    {
      id: 'credit-card' as PaymentMethod,
      name: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'debit-card' as PaymentMethod,
      name: 'Debit Card',
      icon: '🏦',
      description: 'All major debit cards'
    },
    {
      id: 'upi' as PaymentMethod,
      name: 'UPI',
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm'
    },
    {
      id: 'netbanking' as PaymentMethod,
      name: 'Net Banking',
      icon: '🌐',
      description: 'All major Indian banks'
    },
    {
      id: 'wallet' as PaymentMethod,
      name: 'Digital Wallet',
      icon: '💰',
      description: 'Paytm, Amazon Pay'
    },
    {
      id: 'my-account' as PaymentMethod,
      name: 'My Account (PTSBI)',
      icon: '🏧',
      description: 'Direct transfer to 7060785647@ptsbi'
    },
    {
      id: 'cod' as PaymentMethod,
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay when you receive'
    }
  ];

  const validateCardForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardDetails.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!cardDetails.holderName.trim()) {
      newErrors.holderName = 'Cardholder name is required';
    }

    if (!cardDetails.expiryMonth) {
      newErrors.expiryMonth = 'Expiry month is required';
    }

    if (!cardDetails.expiryYear) {
      newErrors.expiryYear = 'Expiry year is required';
    }

    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpiForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
      newErrors.upiId = 'Invalid UPI ID format (e.g., username@bankname)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setErrors({});
    
    if (method === 'credit-card' || method === 'debit-card') {
      setShowCardForm(true);
      setShowUpiForm(false);
    } else if (method === 'upi') {
      setShowUpiForm(true);
      setShowCardForm(false);
    } else {
      setShowCardForm(false);
      setShowUpiForm(false);
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formatted }));
    } else {
      setCardDetails(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePaymentSubmit = () => {
    if (!selectedMethod) return;

    let isValid = true;
    let transactionId = '';

    if (selectedMethod === 'credit-card' || selectedMethod === 'debit-card') {
      isValid = validateCardForm();
      if (isValid) {
        transactionId = `TXN-${Date.now()}`;
      }
    } else if (selectedMethod === 'upi') {
      isValid = validateUpiForm();
      if (isValid) {
        transactionId = `UPI-${Date.now()}`;
      }
    } else if (selectedMethod === 'cod') {
      transactionId = `COD-${Date.now()}`;
      isValid = true;
    } else {
      transactionId = `TXN-${Date.now()}`;
      isValid = true;
    }

    if (isValid) {
      onSubmit(selectedMethod, transactionId);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={onClose}
        role="presentation"
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 border-b-4 border-amber-700 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
            <div>
              <h2 id="payment-title" className="text-2xl sm:text-3xl font-bold text-amber-950">Select Payment Method</h2>
              <p className="text-xs sm:text-sm text-amber-700 mt-1">Choose how you'd like to pay</p>
            </div>
            <button
              onClick={onBack}
              className="text-amber-700 hover:text-amber-900 text-2xl font-bold p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              title="Go back"
              aria-label="Go back to address"
            >
              ←
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {/* Address Summary */}
            {address && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs text-amber-700 font-semibold mb-2">DELIVERY TO:</p>
                <p className="font-bold text-amber-950 text-sm sm:text-base">{address.fullName}</p>
                <p className="text-xs sm:text-sm text-amber-700">{address.address}</p>
                <p className="text-xs sm:text-sm text-amber-700">{address.city}, {address.state} {address.pincode}</p>
              </div>
            )}

            {/* Payment Methods Grid */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-amber-900 mb-3 sm:mb-4">Payment Methods</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectMethod(method.id)}
                    className={`p-4 sm:p-4 rounded-lg border-2 transition-all text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 min-h-[80px] sm:min-h-auto active:scale-95 ${
                      selectedMethod === method.id
                        ? 'border-amber-700 bg-amber-100'
                        : 'border-amber-200 bg-amber-50 hover:border-amber-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl sm:text-3xl flex-shrink-0">{method.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-amber-950 text-sm sm:text-base">{method.name}</p>
                        <p className="text-xs text-amber-700 leading-tight">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <span className="text-amber-700 text-lg flex-shrink-0">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Form */}
            {showCardForm && (
              <div className="border-2 border-amber-200 rounded-lg p-4 sm:p-6 bg-amber-50 space-y-4">
                <h3 className="font-bold text-amber-950 mb-4 text-base sm:text-lg">
                  {selectedMethod === 'credit-card' ? 'Credit Card Details' : 'Debit Card Details'}
                </h3>

                <div>
                  <label htmlFor="cardNumber" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Card Number *</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    aria-describedby="cardNumber-error"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                      errors.cardNumber ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white focus-visible:border-amber-500'
                    }`}
                  />
                  {errors.cardNumber && <p id="cardNumber-error" className="text-red-600 text-xs mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label htmlFor="holderName" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Cardholder Name *</label>
                  <input
                    type="text"
                    id="holderName"
                    name="holderName"
                    value={cardDetails.holderName}
                    onChange={handleCardChange}
                    placeholder="Name as on card"
                    aria-describedby="holderName-error"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                      errors.holderName ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white focus-visible:border-amber-500'
                    }`}
                  />
                  {errors.holderName && <p id="holderName-error" className="text-red-600 text-xs mt-1">{errors.holderName}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3\">
                  <div>
                    <label htmlFor="expiryMonth" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Month *</label>
                    <select
                      id="expiryMonth"
                      name="expiryMonth"
                      value={cardDetails.expiryMonth}
                      onChange={handleCardChange}
                      aria-describedby="expiryMonth-error"
                      className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors cursor-pointer text-base min-h-[44px] ${
                        errors.expiryMonth ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white focus-visible:border-amber-500'
                      }`}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {errors.expiryMonth && <p id="expiryMonth-error" className="text-red-600 text-xs mt-1">{errors.expiryMonth}</p>}
                  </div>

                  <div>
                    <label htmlFor="expiryYear" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Year *</label>
                    <select
                      id="expiryYear"
                      name="expiryYear"
                      value={cardDetails.expiryYear}
                      onChange={handleCardChange}
                      aria-describedby="expiryYear-error"
                      className={`w-full px-3 sm:px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors cursor-pointer text-base min-h-[44px] ${
                        errors.expiryYear ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white focus-visible:border-amber-500'
                      }`}
                    >
                      <option value="">YY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={String(year).slice(-2)}>
                            {String(year).slice(-2)}
                          </option>
                        );
                      })}
                    </select>
                    {errors.expiryYear && <p id="expiryYear-error" className="text-red-600 text-xs mt-1">{errors.expiryYear}</p>}
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">CVV *</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardDetails.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      inputMode="numeric"
                      aria-describedby="cvv-error"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                        errors.cvv ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white focus-visible:border-amber-500'
                      }`}
                    />
                    {errors.cvv && <p id="cvv-error" className="text-red-600 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* UPI Form */}
            {showUpiForm && (
              <div className="border-2 border-amber-200 rounded-lg p-4 sm:p-6 bg-amber-50 space-y-4">
                <h3 className="font-bold text-amber-950 mb-4 text-base sm:text-lg">UPI Details</h3>

                <div>
                  <label htmlFor="upiId" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">UPI ID *</label>
                  <input
                    type="text"
                    id="upiId"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value);
                      if (errors.upiId) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.upiId;
                          return newErrors;
                        });
                      }
                    }}
                    placeholder="username@bankname"
                    aria-describedby="upiId-error"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                      errors.upiId ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-white focus-visible:border-amber-500'
                    }`}
                  />
                  {errors.upiId && <p id="upiId-error" className="text-red-600 text-xs mt-1">{errors.upiId}</p>}
                  <p className="text-xs sm:text-sm text-amber-700 mt-2">Examples: yourname@okhdfcbank, yourname@okicici, yourname@okaxis</p>
                </div>
              </div>
            )}

            {/* COD Info */}
            {selectedMethod === 'cod' && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 sm:p-5">
                <p className="text-green-800 font-semibold text-base sm:text-lg">✓ Cash on Delivery Selected</p>
                <p className="text-sm text-green-700 mt-2">You can pay with cash when your order is delivered to your doorstep.</p>
              </div>
            )}

            {/* My Account Info */}
            {selectedMethod === 'my-account' && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 sm:p-5">
                <p className="text-blue-800 font-semibold text-base sm:text-lg">✓ My Account (PTSBI)</p>
                <p className="text-sm text-blue-700 mt-2">UPI: <span className="font-mono font-bold text-base">7060785647@ptsbi</span></p>
                <p className="text-sm text-blue-700 mt-2">Transfer the amount using your UPI app and your order will be confirmed after receiving the payment.</p>
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-amber-100 border-2 border-amber-700 rounded-lg p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <p className="text-sm text-amber-900 font-semibold">Order Amount</p>
                  <p className="text-3xl sm:text-4xl font-bold text-amber-950">₹{cartTotal.toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm text-amber-800 font-semibold">Secure Payment</p>
                  <p className="text-sm text-amber-900">🔒 SSL Encrypted</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 sm:pt-6 border-t-2 border-amber-100">
              <button
                onClick={onBack}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 border-2 border-amber-700 text-amber-950 font-bold rounded-lg hover:bg-amber-50 active:bg-amber-100 transition-colors text-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                aria-label="Back to address selection"
              >
                Back to Address
              </button>
              <button
                onClick={handlePaymentSubmit}
                disabled={!selectedMethod}
                className={`w-full py-3 sm:py-4 px-4 sm:px-6 font-bold rounded-lg uppercase tracking-widest transition-all duration-300 text-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 ${
                  selectedMethod
                    ? 'bg-gradient-to-r from-amber-700 to-amber-900 text-white hover:shadow-lg active:shadow-md'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                aria-label={`Pay ₹${cartTotal.toLocaleString()}`}
              >
                Pay ₹{cartTotal.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentModal;
