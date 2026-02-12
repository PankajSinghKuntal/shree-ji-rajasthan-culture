import React, { useState, ChangeEvent, FormEvent } from 'react';
import { userAPI } from './api';
import { User } from './types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = (props: AuthModalProps) => {
  const { isOpen, onClose, initialMode, onAuthSuccess } = props;
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      if (mode === 'signup') {
        const result = await userAPI.register(fullName, email, password);
        if (result.success) {
          const user: User = {
            id: result.user.id,
            fullName: result.user.fullName,
            email: result.user.email,
            password: '',
            createdAt: result.user.createdAt || new Date().toISOString()
          };
          onAuthSuccess(user);
          onClose();
        } else {
          setError(result.error || 'Registration failed');
        }
      } else {
        const result = await userAPI.login(email, password);
        if (result.success) {
          const user: User = {
            id: result.user.id,
            fullName: result.user.fullName,
            email: result.user.email,
            password: '',
            createdAt: result.user.createdAt || new Date().toISOString()
          };
          onAuthSuccess(user);
          onClose();
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden fade-in border border-rose-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="royal-font text-3xl font-bold text-rose-950">
              {mode === 'login' ? 'Welcome Back' : 'Join the Royalty'}
            </h2>
            <button onClick={onClose} className="text-rose-400 hover:text-rose-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 italic">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-rose-950 mb-1 uppercase tracking-widest">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={fullName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-800 outline-none transition-all"
                  placeholder="Maharaja / Maharani Name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-rose-950 mb-1 uppercase tracking-widest">Email Address</label>
              <input 
                required
                type="email" 
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-800 outline-none transition-all"
                placeholder="palace@heritage.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-rose-950 mb-1 uppercase tracking-widest">Password</label>
              <input 
                required
                type="password" 
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-rose-100 focus:ring-2 focus:ring-rose-800 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full py-4 bg-rose-950 text-white rounded-xl font-bold tracking-widest hover:bg-rose-900 transition-colors shadow-lg mt-6">
              {mode === 'login' ? 'LOGIN TO YOUR ACCOUNT' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone-500">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              className="ml-2 text-rose-950 font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;