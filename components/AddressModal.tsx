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

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (address: AddressDetails) => void;
  onOpenPayment: () => void;
  cartTotal: number;
}

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onSubmit, onOpenPayment, cartTotal }) => {
  const [formData, setFormData] = useState<AddressDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onOpenPayment();
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      address: '',
      landmark: '',
      city: '',
      state: '',
      pincode: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal'
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
        onClick={handleClose}
        role="presentation"
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="address-title">
        <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto sm:rounded-2xl">
          {/* Header */}
          <div className="sticky top-0 border-b-4 border-amber-700 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
            <div>
              <h2 id="address-title" className="text-2xl sm:text-3xl font-bold text-amber-950">Delivery Address</h2>
              <p className="text-xs sm:text-sm text-amber-700 mt-1">Please enter your delivery details</p>
            </div>
            <button
              onClick={handleClose}
              className="text-amber-700 hover:text-amber-900 text-2xl sm:text-3xl font-bold p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700 rounded-lg"
              aria-label="Close dialog"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
            {/* Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  aria-describedby="fullName-error"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                    errors.fullName ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                  }`}
                />
                {errors.fullName && <p id="fullName-error" className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  aria-describedby="phone-error"
                  inputMode="tel"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                    errors.phone ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                  }`}
                />
                {errors.phone && <p id="phone-error" className="text-red-600 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                aria-describedby="email-error"
                inputMode="email"
                className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                }`}
              />
              {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No., Building Name, Street, etc."
                rows={3}
                required
                aria-describedby="address-error"
                className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors resize-none text-base min-h-[100px] ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                }`}
              />
              {errors.address && <p id="address-error" className="text-red-600 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Landmark */}
            <div>
              <label htmlFor="landmark" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Landmark (Optional)</label>
              <input
                type="text"
                id="landmark"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark (optional)"
                className="w-full px-4 py-3 border-2 border-amber-200 bg-amber-50 rounded-lg focus-visible:outline-none focus-visible:border-amber-500 transition-colors text-base min-h-[44px]"
              />
            </div>

            {/* City, State, Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city name"
                  required
                  aria-describedby="city-error"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                    errors.city ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                  }`}
                />
                {errors.city && <p id="city-error" className="text-red-600 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">State *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  aria-describedby="state-error"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors cursor-pointer text-base min-h-[44px] ${
                    errors.state ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p id="state-error" className="text-red-600 text-xs mt-1">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="pincode" className="block text-sm sm:text-base font-bold text-amber-900 mb-2">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  required
                  aria-describedby="pincode-error"
                  inputMode="numeric"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus-visible:outline-none transition-colors text-base min-h-[44px] ${
                    errors.pincode ? 'border-red-500 bg-red-50' : 'border-amber-200 bg-amber-50 focus-visible:border-amber-500'
                  }`}
                />
                {errors.pincode && <p id="pincode-error" className="text-red-600 text-xs mt-1">{errors.pincode}</p>}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 sm:p-5 mt-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <p className="text-sm sm:text-base text-amber-700 font-semibold">Order Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-amber-950">₹{cartTotal.toLocaleString()}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-amber-700">Ready to deliver</p>
                  <p className="text-sm sm:text-base font-semibold text-amber-900">within 5-7 business days</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-amber-100">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 border-2 border-amber-700 text-amber-950 font-bold rounded-lg hover:bg-amber-50 active:bg-amber-100 transition-colors text-base sm:text-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                aria-label="Cancel address entry"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold rounded-lg hover:shadow-lg active:shadow-sm transition-all duration-300 uppercase tracking-widest text-base sm:text-base min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700\"
                aria-label="Confirm address and proceed to payment"
              >
                Confirm & Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressModal;
