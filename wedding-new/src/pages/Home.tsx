import { motion } from "framer-motion";
import { Button } from "@/_components/ui/button";
import { Countdown } from "@/_components/countdown";
import { Heart } from "lucide-react";

import { HeroSection } from "@/_components/hero-section";
import Link from "next/link";



export const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection/>
      {/* Countdown Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Faltam apenas...
            </h2>
            <p className="text-lg text-muted-foreground">
              Contagem regressiva para o nosso grande dia
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Countdown />
          </motion.div>
        </div>
      </section>

      {/* Invitation Section */}
      <section className="py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Você está Convidado!
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Será uma honra e uma alegria compartilhar este momento tão especial com você. 
              Sua presença é o maior presente que poderíamos receber.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/casamento">
                <Button variant="default" size="lg">
                  Confirmar Presença
                </Button>
              </Link>
              <Link href="/nossa-historia">
                <Button variant="outline" size="lg">
                  Nossa História
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};