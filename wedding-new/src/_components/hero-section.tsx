"use client";

import { motion } from "framer-motion";
import { ArrowDown, EyeIcon, Heart, MousePointerClick } from "lucide-react";

import { Button } from "./ui/button";
import { OptimizedImage } from "./ui/OptimizedImage";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const HeroSection = () => {
  const pathname = usePathname();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {pathname === "/" ? (
        <>
          <div className="absolute inset-0">
            <OptimizedImage
              src="/assets/nois.png"
              alt="Casal"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-primary/40 to-background/90" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <Heart className="w-16 h-16 text-accent mx-auto mb-6 fill-accent animate-pulse" />

              <h1 className="playfair-custom text-5xl md:text-7xl lg:text-8xl mb-4 text-background">
                José & Márjorie
              </h1>

              <p className="text-xl md:text-2xl text-zinc-50 mb-4 font-light">
                Nós vamos casar!
              </p>

              <p className="text-lg md:text-xl text-zinc-50 mb-12 max-w-2xl mx-auto">
                Convidamos você para celebrar conosco este momento especial das
                nossas vidas
              </p>
              <motion.div
                className="flex flex-row justify-center items-center"
                whileHover={{ scale: 1.01, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link href="/casamento">
                  <Button
                    size="lg"
                    className="group text-lg shadow-xl py-8 px-12 mt-6 bg-foreground whitespace-normal text-center hover:bg-foreground/90 transition-colors duration-300"
                  >
                    Clique aqui para ver mais detalhes do casamento
                    <MousePointerClick className="size-5 ml-3 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <ArrowDown className="w-8 h-8 mb-8 text-zinc-50 animate-bounce" />
            </motion.div>
          </div>
        </>
      ) : pathname === "/casamento" ? (
        <>
          <div className="absolute inset-0">
            <OptimizedImage
              src="/assets/Wedding.png"
              alt="Casamento"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-primary/40 to-background/90" />
          </div>
          {/* Content (ensure above overlay) */}
          <div className="relative z-10 container mx-auto px-4 text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="playfair-custom text-5xl md:text-7xl lg:text-8xl mb-4 text-white">
                Nosso Grande Dia
              </h1>
              <p className="text-xl text-white max-w-2xl mx-auto">
                Será um prazer compartilhar este momento especial com você
              </p>
            </motion.div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0">
            <OptimizedImage
              src="/assets/Valentines.jpg"
              alt="Nossa História"
              fill
              className="object-cover object-center"
              quality={90}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-primary/40 to-background/90" />
          </div>

          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <Heart className="w-16 h-16 text-white mx-auto mb-6 fill-white animate-pulse" />

              <h1 className="playfair-custom text-5xl md:text-7xl lg:text-8xl mb-4 text-background">
                Nossa História
              </h1>
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