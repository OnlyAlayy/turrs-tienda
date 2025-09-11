import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden text-turrs-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex space-x-6">
        <Link to="/" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
          Inicio
        </Link>
        <Link to="/products" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
          Productos
        </Link>
        <Link to="/about" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
          Quiénes Somos
        </Link>
        <Link to="/contact" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
          Contacto
        </Link>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-turrs-blue shadow-lg">
          <div className="flex flex-col space-y-4 p-4">
            <Link to="/" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
              Inicio
            </Link>
            <Link to="/products" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
              Productos
            </Link>
            <Link to="/about" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
              Quiénes Somos
            </Link>
            <Link to="/contact" className="font-turrs-text text-turrs-white hover:text-turrs-skin transition-colors">
              Contacto
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;