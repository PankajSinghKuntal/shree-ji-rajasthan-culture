import React from 'react';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LicenseModal: React.FC<LicenseModalProps> = (props: LicenseModalProps) => {
  const { isOpen, onClose } = props;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden fade-in border-4 border-double border-rose-900">
        <div className="p-10 md:p-16 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-10 border-b border-rose-100 pb-6">
            <h2 className="royal-font text-3xl font-bold text-rose-950 uppercase tracking-widest">
              The Royal License
            </h2>
            <button onClick={onClose} className="text-rose-400 hover:text-rose-950 transition-colors">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="prose prose-rose max-w-none">
            <pre className="whitespace-pre-wrap font-serif text-rose-900 leading-relaxed text-sm italic bg-rose-50/30 p-8 rounded-3xl border border-rose-100">
{`SHREE JI RAJASTHAN CULTURE - ROYAL PLATFORM LICENSE

Copyright (c) 2024 Shree Ji Rajasthan Culture

THE ROYAL PERMISSION

Permission is hereby granted, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the following conditions:

1. THE HERITAGE NOTICE: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2. ARTISAN PROTECTION: The names "Shree Ji", "Shree Ji Rajasthan", and "Shree Ji Rajasthan Culture" are protected trademarks. Use of these names for commercial purposes outside of this Software requires written consent from the Royal Studio.

3. NO WARRANTY: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.

4. CULTURAL INTEGRITY: Users are encouraged to maintain the cultural integrity and respect for the Rajasthani heritage represented within this digital framework.`}
            </pre>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={onClose}
              className="px-12 py-4 bg-rose-950 text-white rounded-full font-bold tracking-widest hover:bg-rose-900 shadow-xl"
            >
              I ACCEPT THE TERMS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseModal;
