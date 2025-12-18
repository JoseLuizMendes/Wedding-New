"use client";

import { useState } from "react";
import { RSVPForm } from "@/_components/forms/RSVPForm";
import { GiftList } from "@/_components/gifts/GiftList";
import { HeroSection } from "@/_components/hero-section";
import { HoneymoonProgress } from "@/_components/honeymoon/HoneymoonProgress";
import { HoneymoonContribution } from "@/_components/honeymoon/HoneymoonContribution";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { LocationDialog } from "@/_components/ui/LocationDialog";
import { motion } from "framer-motion";
import { Calendar, Clock, Gift, MapPin } from "lucide-react";

const weddingDetails = [
  {
    icon: Calendar,
    title: "Data",
    value: "07 de Setembro de 2026",
    description: "Segunda-feira",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "15:00",
    description: "Cerimônia e Recepção",
  },
  {
    icon: MapPin,
    title: "Local",
    value: "Sítio Pouso do Cristão",
    description: "Cariacica, ES",
  },
];

export const Casamento = () => {
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  return (
    <div className="min-h-screen pb-12">
      <HeroSection />
      <div className="container mx-auto px-4 pt-20">
        {/* Wedding Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 playfair-custom">
          {weddingDetails.map((detail, index) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}>
              {detail.title === "Local" ? (
                <div onClick={() => setShowLocationDialog(true)}>
                  <Card className="text-center h-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10 cursor-pointer">
                    <CardHeader>
                      <detail.icon className="w-12 h-12 text-foreground mx-auto mb-4" />
                      <CardTitle className="text-2xl">{detail.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    <detail.icon className="w-12 h-12 text-foreground mx-auto mb-4" />
                    <CardTitle className="text-2xl">{detail.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
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

        {/* Honeymoon Goal Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20">
          <HoneymoonProgress />
        </motion.section>

        {/* Honeymoon Contribution Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20">
          <HoneymoonContribution />
        </motion.section>

        {/* Gift Registry */}
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
              Se desejar nos presentear, aqui estão algumas sugestões que nos
              ajudarão a começar nossa nova vida juntos
            </p>
          </div>

          <GiftList tipo="casamento" />
        </motion.section>

        {/* RSVP Form */}
        <motion.section
          id="rsvp-form"
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
                Por favor, confirme sua presença até 15 de Maio de 2026
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RSVPForm tipo="casamento" />
            </CardContent>
          </Card>
        </motion.section>
      </div>

      <LocationDialog
        isOpen={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        locationName="Sítio Pouso do Cristão"
        locationAddress="Cariacica, ES"
        googleMapsUrl="https://maps.app.goo.gl/HZuhizgjnL9YGYyw9"
      />
    </div>
  );
};