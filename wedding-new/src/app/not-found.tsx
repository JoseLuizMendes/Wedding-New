"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../_components/ui/button";
import { OptimizedImage } from "../_components/ui/OptimizedImage";

const NotFound = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <OptimizedImage
                    src="/assets/nois.png"
                    alt="Casal"
                    fill
                    priority
                    className="object-cover object-center"
                    quality={90}
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="playfair-custom text-8xl md:text-9xl mb-4 text-zinc-50 font-bold">
                        404
                    </h1>

                    <div className="w-24 h-1 bg-zinc-50 mx-auto mb-8" />

                    <p className="text-2xl md:text-3xl text-zinc-50 mb-4 font-light">
                        Página não encontrada
                    </p>

                    <p className="text-lg md:text-xl text-zinc-200 mb-12 max-w-2xl mx-auto">
                        Opa! Parece que o você se perdeu no caminho para o altar.
                    </p>

                    <motion.div
                        className="flex justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/">
                            <Button
                                size="lg"
                                className="group text-lg shadow-xl py-8 px-8 bg-zinc-50 text-foreground hover:bg-zinc-200 transition-colors duration-300"
                            >
                                <ArrowLeft className="mr-2 h-6 w-6 transition-transform group-hover:-translate-x-1" />
                                Voltar para o Início
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default NotFound;
