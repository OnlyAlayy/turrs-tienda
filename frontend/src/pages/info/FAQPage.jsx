import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
    {
        section: "PRODUCTOS",
        items: [
            { q: "¿Los productos son originales?", a: "Sí, todos los productos son 100% originales y certificados. Trabajamos directamente con distribuidores autorizados de Adidas, Nike, AFA y las marcas de perfumería." },
            { q: "¿Las camisetas de Argentina son oficiales?", a: "Sí, son camisetas oficiales de la AFA (Asociación del Fútbol Argentino) para el Mundial 2026." },
            { q: "¿Los perfumes son originales o imitaciones?", a: "Son 100% originales, importados directamente. Nunca vendemos imitaciones ni réplicas." }
        ]
    },
    {
        section: "COMPRAS Y PAGOS",
        items: [
            { q: "¿Qué medios de pago aceptan?", a: "Aceptamos todas las tarjetas de crédito y débito a través de Stripe (Visa, Mastercard, American Express). El pago es 100% seguro." },
            { q: "¿Puedo pagar en cuotas?", a: "Sí, dependiendo de tu banco y tarjeta podés acceder a cuotas sin interés. Las opciones se muestran al finalizar la compra en la pantalla de pago de Stripe." },
            { q: "¿Es seguro pagar en TURRS?", a: "Totalmente. Utilizamos Stripe como procesador de pagos, uno de los más seguros del mundo. Nunca almacenamos datos de tu tarjeta en nuestros servidores." }
        ]
    },
    {
        section: "ENVÍOS",
        items: [
            { q: "¿Cuánto tarda en llegar mi pedido?", a: "CABA y GBA: 2-3 días hábiles. Interior del país: 5-7 días hábiles. Despachamos de lunes a viernes." },
            { q: "¿Tienen envío gratis?", a: "Sí. Todas las compras de $100 USD o más tienen envío gratis a todo el país. Para compras menores, el costo es $8 USD." },
            { q: "¿Cómo rastro mi pedido?", a: "Te enviamos un email con el número de seguimiento cuando despachamos tu pedido. También podés verlo en Mis Pedidos desde tu perfil." }
        ]
    },
    {
        section: "DEVOLUCIONES",
        items: [
            { q: "¿Puedo devolver un producto?", a: "Sí, tenés 30 días desde que recibís el producto para iniciar una devolución. El producto debe estar sin uso y con sus etiquetas originales." },
            { q: "¿Puedo cambiar el talle?", a: "Si el pedido no fue despachado, contactanos y lo cambiamos sin problema. Si ya fue despachado, gestionamos el cambio como devolución y nueva compra." },
            { q: "¿En cuánto tiempo recibo el reembolso?", a: "En 5-7 días hábiles una vez que recibimos el producto devuelto." }
        ]
    }
];

const FAQPage = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    let globalIndex = 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#050505] min-h-screen text-white pt-24 pb-16"
        >
            <div className="max-w-3xl mx-auto px-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#74ACDF] bg-clip-text text-transparent mb-8">
                    Preguntas Frecuentes
                </h1>

                <div>
                    {faqData.map((section, sIdx) => (
                        <div key={sIdx} className="mb-8">
                            <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mt-10 mb-4 font-semibold">
                                {section.section}
                            </h3>
                            <div>
                                {section.items.map((item, iIdx) => {
                                    const currentIndex = globalIndex++;
                                    const isOpen = openIndex === currentIndex;

                                    return (
                                        <div key={iIdx} className="bg-[#0A0A0C] border-b border-white/5 rounded-2xl overflow-hidden mb-2">
                                            <button
                                                onClick={() => toggleAccordion(currentIndex)}
                                                className="w-full flex justify-between items-center text-left py-4 px-6 text-white/80 hover:text-white font-medium transition"
                                            >
                                                <span>{item.q}</span>
                                                <svg
                                                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="px-6 pb-4 text-white/50 text-sm leading-relaxed">
                                                            {item.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default FAQPage;
