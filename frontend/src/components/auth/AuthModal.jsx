import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-2xl hover:text-turrs-red"
        >
          ×
        </button>
        
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
  );
};

export default AuthModal;