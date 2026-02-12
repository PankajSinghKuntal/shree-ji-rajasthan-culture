import React, { useState } from 'react';
import { CartItem } from '../types';
import AddressModal from './AddressModal';
import PaymentModal from './PaymentModal';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  total: number;
}

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

const Cart: React.FC<CartProps> = (props: CartProps) => {
  const { isOpen, onClose, items, onRemoveItem, onUpdateQuantity, total } = props;
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<AddressDetails | null>(null);

  const handleCheckout = () => {
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = (address: AddressDetails) => {
    setDeliveryAddress(address);
  };

  const handlePaymentSubmit = (paymentMethod: string, transactionId?: string) => {
    const methodName = paymentMethod.replace('-', ' ').toUpperCase();
    alert(`🎉 Payment Successful!\n\nTransaction ID: ${transactionId}\nPayment Method: ${methodName}\n\nOrder Confirmed!\nYour order will be delivered within 5-7 business days.\n\nThank you for shopping with us!`);
    setIsPaymentModalOpen(false);
    setIsAddressModalOpen(false);
    setDeliveryAddress(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Cart Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm sm:max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="border-b-4 border-amber-700 p-4 sm:p-6 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-950">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-amber-700 hover:text-amber-900 text-3xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-amber-700">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-xl font-semibold">Your cart is empty</p>
              <p className="text-sm mt-2">Add some beautiful items!</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-amber-950 text-sm sm:text-base line-clamp-2">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-amber-700">₹{item.price}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 sm:w-7 sm:h-7 bg-amber-200 text-amber-900 rounded hover:bg-amber-300 font-bold text-sm active:bg-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-700"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 sm:w-7 text-center font-bold text-amber-950 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 sm:w-7 sm:h-7 bg-amber-200 text-amber-900 rounded hover:bg-amber-300 font-bold text-sm active:bg-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-700"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="ml-auto text-red-600 hover:text-red-700 font-bold text-xs sm:text-sm active:text-red-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-600 whitespace-nowrap"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-4 border-amber-700 p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold text-amber-950">Total:</span>
              <span className="text-2xl sm:text-3xl font-bold text-amber-900">₹{total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold rounded-lg hover:shadow-lg active:shadow-md transition-all duration-300 uppercase text-sm sm:text-base tracking-widest min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
              aria-label="Proceed to checkout"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
      
      {/* Address Modal */}
      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={handleAddressSubmit}
        onOpenPayment={() => setIsPaymentModalOpen(true)}
        cartTotal={total}
      />

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
        onBack={() => {
          setIsPaymentModalOpen(false);
          setIsAddressModalOpen(true);
        }}
        cartTotal={total}
        address={deliveryAddress}
      />
    </>
  );
};

export default Cart;
