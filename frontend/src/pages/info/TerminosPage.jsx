import React from 'react';
import { motion } from 'framer-motion';

const TerminosPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-3xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-2">
                    Términos y Condiciones
                </h1>
                <p className="text-white/30 text-sm mb-10">Última actualización: Marzo 2026</p>

                <div className="text-white/60 text-base leading-relaxed">
                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">1. Aceptación de los Términos</h2>
                    <p className="mb-4">Al acceder y utilizar TURRS aceptás estos términos. Si no estás de acuerdo, no utilices el sitio.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">2. Descripción del Servicio</h2>
                    <p className="mb-4">TURRS es una tienda online de indumentaria deportiva, calzado y fragancias. Vendemos productos originales de marcas reconocidas exclusivamente dentro de la República Argentina.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">3. Registro de Usuario</h2>
                    <p className="mb-4">Para realizar compras podés hacerlo como invitado o crear una cuenta. Sos responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">4. Productos y Precios</h2>
                    <p className="mb-4">Todos los precios están expresados en dólares estadounidenses (USD). Nos reservamos el derecho de modificar precios sin previo aviso. El precio válido es el que figura al momento de confirmar la compra.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">5. Proceso de Compra</h2>
                    <p className="mb-4">Al confirmar una compra aceptás el precio, las condiciones del producto y la política de envíos. El contrato de compraventa se perfecciona con la confirmación del pago.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">6. Pagos</h2>
                    <p className="mb-4">Los pagos se procesan a través de Stripe. TURRS no almacena datos de tarjetas de crédito. En caso de pago rechazado, la compra no se procesa y no se realiza ningún cargo.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">7. Envíos</h2>
                    <p className="mb-4">Los plazos de entrega son estimativos. TURRS no se responsabiliza por demoras causadas por el transportista, fenómenos climáticos o causas de fuerza mayor.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">8. Devoluciones</h2>
                    <p className="mb-4">Ver nuestra Política de Devoluciones para condiciones completas. El derecho de arrepentimiento aplica según la Ley 24.240 de Defensa del Consumidor (Argentina).</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">9. Propiedad Intelectual</h2>
                    <p className="mb-4">Todo el contenido de TURRS (imágenes, textos, diseños, logotipos) es propiedad de TURRS o sus licenciantes y está protegido por las leyes de propiedad intelectual.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">10. Limitación de Responsabilidad</h2>
                    <p className="mb-4">TURRS no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del sitio o los productos.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">11. Modificaciones</h2>
                    <p className="mb-4">Podemos modificar estos términos en cualquier momento. Los cambios entran en vigencia al ser publicados en el sitio.</p>

                    <h2 className="text-xl font-semibold text-white/80 mt-10 mb-3 tracking-tight">12. Ley Aplicable</h2>
                    <p className="mb-4">Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se someterá a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default TerminosPage;
