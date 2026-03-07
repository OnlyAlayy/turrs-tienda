import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  // Reset to login view when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLogin(true);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="auth-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          {/* Backdrop Click Area */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-label="Cerrar fondo"
          />

          {/* Modal Content */}
          <motion.div
            key="auth-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
            className="relative z-[101] w-full max-w-[440px]"
          >
            <div className="relative bg-[#0A0A0C] border border-white/10 p-8 rounded-3xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors z-20"
                aria-label="Cerrar modal"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 13L13 1" />
                  <path d="M13 13L1 1" />
                </svg>
              </button>

              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#74ACDF] to-transparent opacity-50 z-0"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#74ACDF]/10 rounded-full blur-3xl pointer-events-none z-0"></div>

              {/* Toggle Logic */}
              <div className="relative z-10 w-full">
                {isLogin ? (
                  <LoginForm
                    onSwitchToRegister={() => setIsLogin(false)}
                    onClose={onClose}
                  />
                ) : (
                  <RegisterForm
                    onSwitchToLogin={() => setIsLogin(true)}
                    onClose={onClose}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;