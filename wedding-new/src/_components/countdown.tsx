"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/_components/ui/card";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = () => {
  const weddingDate = useMemo(() => new Date("2026-09-07T16:11:00").getTime(), []);
  
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const difference = weddingDate - new Date().getTime();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [weddingDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const timeUnits = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  if (!isMounted) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {timeUnits.map((unit) => (
          <Card key={unit.label} className="p-6 text-center bg-card/80 backdrop-blur-sm border-primary/20 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              00
            </div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              {unit.label}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 text-center bg-card/80 backdrop-blur-sm border-primary/20 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300">
            <motion.div
              key={unit.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-primary mb-2"
            >
              {unit.value.toString().padStart(2, "0")}
            </motion.div>
            <div className="text-sm md:text-base text-muted-foreground font-medium">
              {unit.label}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};