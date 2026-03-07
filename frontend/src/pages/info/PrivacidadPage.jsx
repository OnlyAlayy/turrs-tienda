import React from 'react';
import { motion } from 'framer-motion';

const PrivacidadPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-3xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-2">
                    Política de Privacidad
                </h1>
                <p className="text-white/30 text-sm mb-10">Última actualización: Marzo 2026</p>

                <div className="text-white/60 text-base leading-relaxed">
                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">1. Datos que Recopilamos</h2>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Datos de registro: nombre, email, contraseña (encriptada con bcrypt)</li>
                        <li>Datos de compra: dirección de envío, historial de pedidos</li>
                        <li>Datos de navegación: páginas visitadas, productos vistos (uso interno)</li>
                        <li>Nunca recopilamos datos de tarjetas de crédito (procesados directamente por Stripe)</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">2. Cómo Usamos tus Datos</h2>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Para procesar y enviar tus pedidos</li>
                        <li>Para enviarte confirmaciones y actualizaciones de tus compras</li>
                        <li>Para enviarte novedades si te suscribiste al newsletter (podés darte de baja en cualquier momento)</li>
                        <li>Para mejorar la experiencia del sitio</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">3. Almacenamiento y Seguridad</h2>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Tus datos se almacenan en servidores seguros mediante MongoDB Atlas</li>
                        <li>Las contraseñas se encriptan con bcrypt (nunca se almacenan en texto plano)</li>
                        <li>Las sesiones se gestionan con JWT en cookies seguras (HttpOnly)</li>
                        <li>Utilizamos HTTPS en todas las comunicaciones</li>
                    </ul>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">4. Compartir Datos con Terceros</h2>
                    <p className="mb-2">Compartimos datos únicamente con:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Stripe: para procesar pagos (ver su política en stripe.com/privacy)</li>
                        <li>Transportistas: nombre y dirección de entrega para gestionar el envío</li>
                    </ul>
                    <p className="mb-4">No vendemos ni compartimos tus datos con fines publicitarios.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">5. Tus Derechos</h2>
                    <p className="mb-2">Tenés derecho a:</p>
                    <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Acceder a tus datos personales</li>
                        <li>Corregir datos incorrectos (desde Mi Perfil)</li>
                        <li>Eliminar tu cuenta y datos (contactanos)</li>
                        <li>Desuscribirte del newsletter en cualquier momento</li>
                    </ul>
                    <p className="mb-4">Para ejercer estos derechos contactanos en hola@turrs.com</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">6. Cookies</h2>
                    <p className="mb-4">Utilizamos cookies esenciales para el funcionamiento del sitio (sesión de usuario, carrito de compras). No utilizamos cookies de seguimiento publicitario de terceros.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">7. Contacto</h2>
                    <p className="mb-4">Para consultas sobre privacidad: hola@turrs.com<br />Respondemos en 48 horas hábiles.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default PrivacidadPage;
