import React from 'react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-turrs-blue to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-turrs-title text-4xl md:text-6xl text-turrs-white mb-4">
            Bienvenido a TURRS
          </h2>
          <p className="font-turrs-text text-xl text-turrs-white mb-8">
            Descubre nuestra colección exclusiva
          </p>
          <button className="btn-turrs-red text-lg px-8 py-3">
            Ver Productos
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="font-turrs-title text-3xl text-center text-turrs-black mb-12">
            ¿Por qué elegirnos?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-turrs text-center">
              <h4 className="font-turrs-text font-semibold text-lg mb-3">Calidad Premium</h4>
              <p className="font-turrs-text text-gray-600">Productos de la más alta calidad</p>
            </div>
            <div className="card-turrs text-center">
              <h4 className="font-turrs-text font-semibold text-lg mb-3">Envío Rápido</h4>
              <p className="font-turrs-text text-gray-600">Entregas en todo el país</p>
            </div>
            <div className="card-turrs text-center">
              <h4 className="font-turrs-text font-semibold text-lg mb-3">Atención Personalizada</h4>
              <p className="font-turrs-text text-gray-600">Soporte 24/7 para clientes</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;