"use client";

import { motion } from "framer-motion";
import { ArrowDown, Heart } from "lucide-react";

import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const HeroSection = () => {
  const pathname = usePathname();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {pathname === "/" ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: `url(/assets/nois.png)` }}
          />
          {/* Gradiente escuro no topo para dar contraste com navegação */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-background/90" />

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <Heart className="w-16 h-16 text-white mx-auto mb-6 fill-white animate-pulse" />

              <h1 className="font-bodoni text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-white">
                José Luiz & Márjorie
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-24 h-1 bg-white mx-auto mb-8"
              />

              <p className="text-xl md:text-2xl text-white mb-4 font-light">
                Nós vamos casar!
              </p>

              <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                Convidamos você para celebrar conosco este momento especial das
                nossas vidas
              </p>

              <Link href="/casamento">
                <Button variant="default" size="lg" className="text-lg px-8 py-6">
                  Ver Detalhes do Casamento
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <ArrowDown className="w-8 h-8 text-white animate-bounce" />
            </motion.div>
          </div>
        </>
      ) : pathname === "/casamento" ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: `url(/assets/Wedding.png)` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-foreground/70 via-primary/40 to-background/90" />
          {/* Content (ensure above overlay) */}
          <div className="relative z-10 container mx-auto px-4 text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white">
                Nosso Grande Dia
              </h1>
              <div className="w-24 h-1 bg-white mx-auto mb-6" />
              <p className="text-xl text-white max-w-2xl mx-auto">
                Será um prazer compartilhar este momento especial com você
              </p>
            </motion.div>
          </div>
        </>
      ) : pathname === "/cha-de-panela" ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: `url(/assets/cha-de-panela-bg.jpg)` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-foreground/70 via-primary/40 to-background/90" />
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-white">
                Chá de Panela
              </h1>
              <div className="w-24 h-1 bg-white mx-auto mb-6" />
              <p className="text-xl text-white max-w-2xl mx-auto">
                Celebre conosco esse momento especial
              </p>
            </motion.div>
          </div>
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: `url(/assets/Valentines.jpg)` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-foreground/70 via-primary/40 to-background/90" />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <Heart className="w-16 h-16 text-white mx-auto mb-6 fill-white animate-pulse" />

              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-4 text-background">
                Nossa História
              </h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-24 h-1 bg-white mx-auto mb-8"
              />

              <p className="text-xl text-white max-w-2xl mx-auto">
                Uma jornada de amor, cumplicidade e sonhos compartilhados
              </p>
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
};