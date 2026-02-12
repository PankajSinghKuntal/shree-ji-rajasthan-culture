import React, { useState, ChangeEvent, FormEvent } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, fullName?: string) => boolean;
  allUsers: User[];
}

const AuthModal: React.FC<AuthModalProps> = (props: AuthModalProps) => {
  const { isOpen, onClose, onLogin, allUsers } = props;

  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      // Signup validation
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('All fields are required');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Check if email already exists
      if (allUsers.some(u => u.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      onLogin(formData.email, formData.password, formData.fullName);
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      const success = onLogin(formData.email, formData.password);

      if (!success) {
        setError('Invalid email or password');
        return;
      }
    }

    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">
              {isSignup ? 'Create Account' : 'Login'}
            </h2>
            <button
              onClick={onClose}
              className="text-white text-2xl hover:bg-amber-800 rounded w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-amber-900 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm font-bold text-amber-900 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:outline-none focus:border-amber-700"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-900 text-white font-bold rounded-lg hover:shadow-lg transition-all uppercase tracking-widest"
            >
              {isSignup ? 'Sign Up' : 'Login'}
            </button>

            <div className="text-center pt-4 border-t border-amber-200">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                  setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
                }}
                className="text-amber-700 font-semibold hover:text-amber-900"
              >
                {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
