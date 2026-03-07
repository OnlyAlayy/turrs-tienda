import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/store/ProductCard';
import axios from 'axios';

const TOTAL_FRAMES = 154;

const LandingPage = () => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const currentFrameRef = useRef(null);
    const rafRef = useRef(null);
    const imagesRef = useRef([]);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Fetch featured products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/featured`);
                setFeaturedProducts(response.data.slice(0, 4)); // Only show 4 cards as per TC-010
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Load all frames into memory
    useEffect(() => {
        let loadedCount = 0;
        const preloadImages = () => {
            for (let i = 1; i <= TOTAL_FRAMES; i++) {
                const img = new Image();
                const num = String(i).padStart(3, '0');
                img.src = `/frames/ezgif-frame-${num}.jpg`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === TOTAL_FRAMES) {
                        setImagesLoaded(true);
                    }
                };
                imagesRef.current.push(img);
            }
        };
        preloadImages();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const drawFrame = (index) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const img = imagesRef.current[index];
        if (!img || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const canvasW = canvas.width / dpr;
        const canvasH = canvas.height / dpr;

        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = canvasW / canvasH;

        let drawW, drawH, drawX, drawY;

        if (imgRatio > canvasRatio) {
            drawH = canvasH;
            drawW = drawH * imgRatio;
            drawX = (canvasW - drawW) / 2;
            drawY = 0;
        } else {
            drawW = canvasW;
            drawH = drawW / imgRatio;
            drawX = 0;
            drawY = (canvasH - drawH) / 2; // Center vertically correctly
        }

        ctx.clearRect(0, 0, canvasW, canvasH);
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    useEffect(() => {
        if (!imagesLoaded) return;

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const dpr = window.devicePixelRatio || 1;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            if (currentFrameRef.current !== null) {
                drawFrame(currentFrameRef.current);
            } else {
                currentFrameRef.current = 0;
                drawFrame(0);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const unsubscribe = scrollYProgress.on("change", (v) => {
            const index = Math.min(
                Math.floor(v * (TOTAL_FRAMES - 1)),
                TOTAL_FRAMES - 1
            );
            if (index !== currentFrameRef.current) {
                currentFrameRef.current = index;
                if (rafRef.current) cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(() => drawFrame(index));
            }
        });

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            unsubscribe();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [imagesLoaded, scrollYProgress]);

    // Framer Motion transforms for the glowing backgrounds
    const celestialGlowOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const goldGlowOpacity = useTransform(scrollYProgress, [0.65, 1], [0, 1]);

    // Beats Transforms
    // Beat 1: Intro (0 to 15%)
    const beat1OpacityIn = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
    const beat1OpacityOut = useTransform(scrollYProgress, [0.1, 0.15], [1, 0]);
    const beat1Opacity = useTransform(scrollYProgress, (p) => {
        return p <= 0.1 ? beat1OpacityIn.get() : beat1OpacityOut.get();
    });
    const beat1Y = useTransform(scrollYProgress, [0, 0.05], [40, 0]);

    // Beat 2: Identidad (15% to 40%)
    const beat2OpacityIn = useTransform(scrollYProgress, [0.15, 0.2], [0, 1]);
    const beat2OpacityOut = useTransform(scrollYProgress, [0.35, 0.4], [1, 0]);
    const beat2Opacity = useTransform(scrollYProgress, (p) => p <= 0.35 ? beat2OpacityIn.get() : beat2OpacityOut.get());
    const beat2X = useTransform(scrollYProgress, [0.15, 0.25], [-60, 0]);

    // Beat 3: Rotacion (40% to 65%)
    const beat3OpacityIn = useTransform(scrollYProgress, [0.4, 0.45], [0, 1]);
    const beat3OpacityOut = useTransform(scrollYProgress, [0.6, 0.65], [1, 0]);
    const beat3Opacity = useTransform(scrollYProgress, (p) => p <= 0.6 ? beat3OpacityIn.get() : beat3OpacityOut.get());
    const beat3X = useTransform(scrollYProgress, [0.4, 0.5], [60, 0]);

    // Beat 4: Numero 10 (65% to 85%)
    const beat4OpacityIn = useTransform(scrollYProgress, [0.65, 0.7], [0, 1]);
    const beat4OpacityOut = useTransform(scrollYProgress, [0.8, 0.85], [1, 0]);
    const beat4Opacity = useTransform(scrollYProgress, (p) => p <= 0.8 ? beat4OpacityIn.get() : beat4OpacityOut.get());
    const beat4Y = useTransform(scrollYProgress, [0.65, 0.75], [40, 0]);

    // Beat 5: Final CTA (85% to 100%)
    const beat5Opacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
    const beat5Scale = useTransform(scrollYProgress, [0.85, 0.95], [0.95, 1]);



    return (
        <div className="bg-[#050505] relative antialiased selection:bg-[#74ACDF]/30">
            {!imagesLoaded && (
                <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#74ACDF]/30 border-t-[#74ACDF] rounded-full animate-spin" />
                </div>
            )}
            <Navbar />

            {/* Scroll container (600vh total height) */}
            <div
                ref={containerRef}
                className="h-[600vh] relative"
                style={{ pointerEvents: imagesLoaded ? 'auto' : 'none' }}
            >
                <div
                    className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]"
                    style={{
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                    }}
                >

                    {/* Glowing Background Front (Celestial Blue) */}
                    <motion.div
                        style={{ opacity: celestialGlowOpacity }}
                        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_#74ACDF15_0%,_transparent_70%)] z-0"
                    />

                    {/* Glowing Background Back (Warm Gold) */}
                    <motion.div
                        style={{ opacity: goldGlowOpacity }}
                        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_#C9A84C15_0%,_transparent_70%)] z-[1]"
                    />

                    {/* Subtle noise/texture overlay */}
                    <div className="absolute inset-0 pointer-events-none bg-black/20 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjMjIyMiIvPgo8L3N2Zz4=')] z-[2]" />

                    {/* The Sequence Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 z-10"
                        style={{
                            width: '100vw',
                            height: '100vh',
                            display: 'block',
                            imageRendering: 'auto',
                            willChange: 'contents',
                        }}
                    />

                    {/* Dark Overlay over the 3D Canvas to make text pop */}
                    < div className="absolute inset-0 z-[15] bg-black/40 pointer-events-none" />

                    {/* Top subtle radial gradient */}
                    <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,_#050A1A_0%,_#050505_70%)] opacity-20" />

                    {/* Text Overlays - Beat 1 */}
                    <motion.div
                        style={{ opacity: beat1Opacity, y: beat1Y }}
                        className="absolute inset-0 flex flex-col items-center pt-12 text-center z-20 pointer-events-none px-4"
                    >
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter bg-gradient-to-b from-white to-[#74ACDF] bg-clip-text text-transparent mb-4">
                            Argentina 2026
                        </h1>
                        <h2 className="text-xl md:text-2xl lg:text-3xl text-white/80 font-medium mb-3">
                            La camiseta de la historia.
                        </h2>
                        <p className="max-w-xl text-base md:text-lg text-white/60 leading-relaxed font-light">
                            Tres estrellas. Una identidad. El último baile en el escenario más grande del mundo.
                        </p>
                    </motion.div>

                    {/* Text Overlays - Beat 2 */}
                    <motion.div
                        style={{ opacity: beat2Opacity, x: beat2X }}
                        className="absolute inset-0 flex flex-col justify-center items-start pl-8 md:pl-16 lg:pl-32 z-20 pointer-events-none max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-[#74ACDF] bg-clip-text text-transparent mb-6">
                            Hecha para<br />la eternidad.
                        </h2>
                        <p className="text-lg md:text-xl text-white/60 font-light mb-3 leading-relaxed">
                            El escudo dorado que carga el peso de tres mundiales.
                        </p>
                        <p className="text-lg md:text-xl text-white/60 font-light mb-3 leading-relaxed">
                            Las tres estrellas que nadie nos puede quitar.
                        </p>
                        <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                            Una camiseta que va más allá del deporte — es una declaración de identidad.
                        </p>
                    </motion.div>

                    {/* Text Overlays - Beat 3 */}
                    <motion.div
                        style={{ opacity: beat3Opacity, x: beat3X }}
                        className="absolute inset-0 flex flex-col justify-center items-end text-right pr-8 md:pr-16 lg:pr-32 z-20 pointer-events-none w-full"
                    >
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-[#74ACDF] bg-clip-text text-transparent mb-6">
                                Del escudo a<br />la leyenda.
                            </h2>
                            <p className="text-lg md:text-xl text-white/60 font-light mb-3 leading-relaxed">
                                La celeste y blanca que el mundo entero reconoce.
                            </p>
                            <p className="text-lg md:text-xl text-white/60 font-light mb-3 leading-relaxed">
                                En cada fibra, la energía de un país.
                            </p>
                            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                                Una rotación. Dos caras de la misma historia.
                            </p>
                        </div>
                    </motion.div>

                    {/* Text Overlays - Beat 4 */}
                    <motion.div
                        style={{ opacity: beat4Opacity, y: beat4Y }}
                        className="absolute inset-0 flex flex-col justify-end pb-8 items-center text-center z-20 pointer-events-none max-w-4xl mx-auto px-4"
                    >
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-[#74ACDF] bg-clip-text text-transparent mb-6 drop-shadow-2xl">
                            El número que<br />lo dice todo.
                        </h2>
                        <p className="text-xl md:text-2xl text-white/80 font-light mb-4 leading-relaxed">
                            El 10 que definió una generación entera.
                        </p>
                        <p className="text-lg md:text-xl text-white/60 font-light mb-4 leading-relaxed">
                            La última danza en el escenario más grande del mundo.
                        </p>
                        <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
                            Una despedida que no es un final — es inmortalidad.
                        </p>
                    </motion.div>

                    {/* Text Overlays - Beat 5 */}
                    <motion.div
                        style={{ opacity: beat5Opacity, scale: beat5Scale }}
                        className="absolute inset-0 flex flex-col justify-center items-center text-center z-30 px-4 pointer-events-auto"
                    >
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-[#74ACDF] bg-clip-text text-transparent mb-4">
                            Sé parte de la historia.
                        </h2>
                        <h3 className="text-xl md:text-2xl text-white/80 font-medium mb-12">
                            Argentina 2026. La camiseta del último Mundial.
                        </h3>

                        <Link to="/tienda/camiseta-argentina-2026-titular" className="inline-block bg-gradient-to-r from-[#74ACDF] to-[#C9A84C] text-white font-semibold text-lg px-10 py-4 rounded-full hover:scale-105 hover:opacity-90 transition-all duration-300 shadow-xl shadow-[#74ACDF]/30 mb-8 border border-white/10">
                            Conseguí la tuya
                        </Link>

                        <Link to="/tienda" className="inline-block text-sm md:text-base text-white/60 underline underline-offset-4 hover:text-white transition-colors duration-200 mb-4">
                            Ver todos los detalles
                        </Link>

                        <p className="text-xs text-white/40 max-w-md mx-auto">
                            Edición oficial AFA. Stock limitado. Diseñada para durar para siempre.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* RESTORED: Featured Products Collection (Más que una camiseta) */}
            <section className="py-24 px-6 lg:px-12 bg-[#050505] relative z-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-[#C9A84C] text-sm font-bold tracking-widest uppercase mb-2 block">Colección Destacada</span>
                            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Más que una camiseta.
                            </h3>
                        </div>
                        <Link to="/tienda" className="text-white/60 hover:text-white transition-colors underline underline-offset-4 text-sm md:text-base whitespace-nowrap">
                            Ver toda la tienda
                        </Link>
                    </div>

                    {loadingProducts ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-2 border-[#74ACDF]/30 border-t-[#74ACDF] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* NEW: Brand Showcase Grid */}
            <section className="py-24 px-6 lg:px-12 bg-[#050505] relative z-20">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-3xl md:text-5xl font-bold text-white mb-12 tracking-tight">
                        Nuestras Marcas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Nike */}
                        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#0A0A0C]">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff" alt="Nike" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h4 className="text-3xl font-bold text-white mb-2">Nike</h4>
                                <p className="text-white/70">Innovación y rendimiento sin límites.</p>
                            </div>
                        </div>
                        {/* Adidas */}
                        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#0A0A0C]">
                            <img src="https://images.unsplash.com/photo-1518002171953-a080ee817e1f" alt="Adidas" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h4 className="text-3xl font-bold text-white mb-2">Adidas</h4>
                                <p className="text-white/70">La marca de las tres tiras.</p>
                            </div>
                        </div>
                        {/* Fragrances */}
                        <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#0A0A0C]">
                            <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f" alt="Perfumes" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h4 className="text-3xl font-bold text-white mb-2">Fragancias</h4>
                                <p className="text-white/70">Colección exclusiva de diseñador.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: Flagship Perfume Highlights */}
            <section className="py-24 px-6 lg:px-12 bg-black relative z-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <div className="w-full lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-[#0A0A0C]"
                        >
                            <img src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75" alt="Flagship Fragrance" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
                        </motion.div>
                    </div>
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="text-[#C9A84C] text-sm font-bold tracking-widest uppercase mb-4">Fragancia Destacada</span>
                        <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Elegancia.<br />En cada nota.
                        </h3>
                        <p className="text-lg text-white/60 mb-8 leading-relaxed max-w-lg">
                            Descubre la colección de fragancias de diseñador.
                            Notas intensas, duración prolongada y un aura de sofisticación absoluta.
                            Encuentra tu esencia definitiva.
                        </p>
                        <Link to="/coleccion/perfumes" className="self-start px-8 py-4 bg-[#74ACDF] text-[#050505] font-semibold rounded-full hover:bg-white transition-colors">
                            Explorar Colección
                        </Link>
                    </div>
                </div>
            </section>

            {/* Global Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
