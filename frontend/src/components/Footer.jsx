import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-turrs-black py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <h3 className="font-turrs-title text-2xl text-turrs-white mb-4">TURRS</h3>
            <p className="font-turrs-text text-turrs-skin">
              Tu tienda de confianza con los mejores productos y atención personalizada.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-turrs-text text-turrs-white font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="/products" className="font-turrs-text text-turrs-skin hover:text-turrs-blue transition-colors">Productos</a></li>
              <li><a href="/about" className="font-turrs-text text-turrs-skin hover:text-turrs-blue transition-colors">Quiénes Somos</a></li>
              <li><a href="/contact" className="font-turrs-text text-turrs-skin hover:text-turrs-blue transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-turrs-text text-turrs-white font-semibold mb-4">Contacto</h4>
            <p className="font-turrs-text text-turrs-skin">Email: info@turrs.com</p>
            <p className="font-turrs-text text-turrs-skin">Teléfono: +54 11 1234-5678</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6">
          <p className="font-turrs-text text-turrs-skin text-center">
            © 2024 TURRS Tienda. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;