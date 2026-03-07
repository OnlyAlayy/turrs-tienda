import React from 'react';
import { motion } from 'framer-motion';

const DevolucionesPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-3xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-12">
                    Devoluciones
                </h1>

                <div className="text-white/60 text-base leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Política de devoluciones — 30 días</h2>
                        <p>
                            Tenés 30 días desde que recibís el producto para iniciar una devolución.
                            El producto debe estar sin uso, sin marcas, con todas las etiquetas originales y en su embalaje original.
                            El costo del envío de devolución es a cargo del cliente, salvo que el producto llegue defectuoso o sea un error nuestro.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Cómo iniciar una devolución</h2>
                        <ol className="list-decimal pl-5 space-y-2">
                            <li>Ingresá a Mis Pedidos desde tu perfil</li>
                            <li>Seleccioná el pedido y el producto a devolver</li>
                            <li>Completá el motivo de la devolución</li>
                            <li>Imprimí la etiqueta de envío que te enviamos</li>
                            <li>Llevá el paquete al correo más cercano</li>
                            <li>El reembolso se acredita en 5-7 días hábiles una vez que recibamos el producto</li>
                        </ol>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Cambios por talle</h2>
                        <p>
                            Si necesitás cambiar el talle contactanos antes de que el pedido sea despachado.
                            Una vez despachado, el cambio se gestiona como devolución y nueva compra.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Productos que NO aplican para devolución</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Perfumes abiertos o sin precinto</li>
                            <li>Ropa interior o medias abiertas</li>
                            <li>Productos marcados como "Liquidación" o "Sin devolución" en la ficha del producto</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white/80 mb-3 tracking-tight">Reembolsos</h2>
                        <p>
                            El reembolso se realiza por el mismo medio de pago original (Stripe/tarjeta).
                            Tiempo estimado de acreditación: 5-7 días hábiles.
                        </p>
                    </section>
                </div>
            </div>
        </motion.div>
    );
};

export default DevolucionesPage;
