import React from 'react';
import { CartItem } from './types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = (props: CartProps) => {
  const { isOpen, onClose, items, onRemove, onUpdateQuantity, onCheckout } = props;
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
            <div className="flex items-start justify-between border-b border-rose-100 pb-6">
              <h2 className="text-3xl font-bold royal-font text-rose-950">Your Bag</h2>
              <button 
                onClick={onClose}
                className="p-2 text-rose-400 hover:text-rose-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-8">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <svg className="mx-auto h-12 w-12 text-rose-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="mt-4 text-rose-900 font-medium">Your courtyard is empty...</p>
                </div>
              ) : (
                <ul className="divide-y divide-rose-50">
                  {items.map((item) => (
                    <li key={item.id} className="py-6 flex">
                      <div className="flex-shrink-0 w-24 h-24 border border-rose-100 rounded-md overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-center object-cover" />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-rose-950">
                            <h3 className="royal-font text-lg">{item.name}</h3>
                            <p className="ml-4">₹{item.price * item.quantity}</p>
                          </div>
                          <p className="mt-1 text-xs text-rose-600 uppercase tracking-widest">{item.category}</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center space-x-3 border border-rose-100 rounded-full px-3 py-1">
                            <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-rose-950 hover:text-rose-700">-</button>
                            <span className="font-bold">{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-rose-950 hover:text-rose-700">+</button>
                          </div>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="font-medium text-rose-700 hover:text-rose-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="border-t border-rose-100 py-6 px-4 sm:px-6 bg-rose-50/50">
              <div className="flex justify-between text-lg font-bold text-rose-950">
                <p>Total</p>
                <p>₹{total}</p>
              </div>
              <p className="mt-0.5 text-xs text-rose-700 text-center italic">Includes royal handling and craftsmanship appreciation.</p>
              <div className="mt-6">
                <button 
                  onClick={onCheckout}
                  className="w-full bg-rose-950 text-white px-6 py-4 rounded-xl shadow-lg hover:bg-rose-900 transition-colors font-bold tracking-widest"
                >
                  PROCEED TO CHECKOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;