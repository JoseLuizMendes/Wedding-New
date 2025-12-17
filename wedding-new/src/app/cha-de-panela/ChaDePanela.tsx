"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Gift, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { LocationDialog } from "@/_components/ui/LocationDialog";
import { RSVPForm } from "@/_components/forms/RSVPForm";
import { GiftList } from "@/_components/gifts/GiftList";

const chaDetails = [
  {
    icon: Calendar,
    title: "Data",
    value: "11 de Abril de 2026",
    description: "Sábado",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "15:00",
    description: "Tarde especial",
  },
  {
    icon: MapPin,
    title: "Local",
    value: "Igreja Casa de Oração e Plenitude - COP",
    description: "Rod. Gov. José Henrique Sette, Cariacica - ES",
  },
];

export const ChaDePanela = () => {
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <section className="relative py-20 mb-12 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/assets/cha-de-panela-bg.jpg"
            alt="Chá de Panela Background"
            fill
            priority
            className="object-cover object-center"
            quality={90}
          />
          {/* Gradiente escuro no topo para dar contraste com navegação */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-background/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            <UtensilsCrossed className="w-16 h-16 text-accent mx-auto mb-6" />
            <h1 className="playfair-custom text-5xl md:text-7xl lg:text-8xl mb-4 text-background">
              Chá de Panela
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto mb-6" />
            <p className="text-xl md:text-2xl text-background/90 max-w-2xl mx-auto">
              Venha celebrar conosco esta etapa especial antes do grande dia!
              Será uma tarde recheada de amor, risadas e muita alegria.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Event Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 playfair-custom">
          {chaDetails.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}>
              {detail.title === "Local" ? (
                <div onClick={() => setShowLocationDialog(true)}>
                  <Card className="text-center h-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10 cursor-pointer">
                    <CardHeader>
                      <detail.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                      <CardTitle className="text-2xl">{detail.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-foreground mb-2">
                      <p className="text-2xl font-bold text-foreground mb-2">
                        {detail.value}
                      </p>
                      <p className="text-foreground font-semibold">
                        {detail.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="text-center h-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10">
                  <CardHeader>
                    <detail.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                    <CardTitle className="text-2xl">{detail.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-foreground mb-2">
                    <p className="text-2xl font-bold text-foreground mb-2">
                      {detail.value}
                    </p>
                    <p className="text-foreground font-semibold">
                      {detail.description}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Gift Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20">
          <div className="text-center mb-12">
            <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="playfair-custom text-4xl md:text-5xl mb-4 text-foreground">
              Sugestões de Presentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sua presença já é o maior presente! Mas se quiser nos presentear,
              aqui estão algumas sugestões para nossa cozinha
            </p>
          </div>

          <GiftList tipo="cha-panela" />
        </motion.section>

        {/* RSVP Form */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto">
          <Card className="shadow-[var(--shadow-romantic)] border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="playfair-custom text-4xl md:text-5xl">
                Confirmação de Presença
              </CardTitle>
              <CardDescription className="text-base">
                Por favor, confirme sua presença até 11 de Fevereiro de 2026
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RSVPForm tipo="cha-panela" />
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <LocationDialog
        isOpen={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        locationName="Igreja Casa de Oração e Plenitude - COP"
        locationAddress="Rod. Gov. José Henrique Sette, Cariacica - ES"
        googleMapsUrl="https://maps.app.goo.gl/spuKfJPf8RbLWdXE7"
      />
    </div>
  );
};