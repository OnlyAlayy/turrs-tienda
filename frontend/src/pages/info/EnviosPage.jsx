import React from 'react';
import { motion } from 'framer-motion';

const EnviosPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-3xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-12">
                    Envíos y Entregas
                </h1>

                <div className="text-white/60 text-base leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Zonas de entrega</h2>
                        <p className="mb-2">Enviamos a todo el territorio argentino.</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>CABA y Gran Buenos Aires: 2-3 días hábiles</li>
                            <li>Provincia de Buenos Aires: 3-5 días hábiles</li>
                            <li>Interior del país (Córdoba, Rosario, Mendoza, Tucumán, Salta, y demás ciudades): 5-7 días hábiles</li>
                            <li>Zonas remotas y localidades pequeñas: hasta 10 días hábiles</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Costos de envío</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Compras de $100 USD o más: envío GRATIS a todo el país</li>
                            <li>Compras menores a $100 USD: $8 USD tarifa fija</li>
                        </ul>
                        <p className="mt-2">Sin costo adicional por zona dentro de Argentina.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Transportistas</h2>
                        <p>
                            Trabajamos con Andreani, OCA y Correo Argentino según la zona de entrega.
                            El transportista se asigna automáticamente al procesar tu pedido.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Seguimiento de pedido</h2>
                        <p>
                            Al confirmar el pago recibís un email con el número de seguimiento.
                            También podés ver el estado desde Mis Pedidos.
                            El link de tracking te redirige directamente al sitio del transportista.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Días y horarios de despacho</h2>
                        <p>
                            Despachamos de lunes a viernes en días hábiles.
                            Los pedidos realizados antes de las 14hs se despachan el mismo día.
                            Los pedidos realizados después de las 14hs o en fin de semana se despachan el día hábil siguiente.
                        </p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default EnviosPage;
