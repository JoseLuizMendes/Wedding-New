"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface UseGiftReservationProps {
  giftId: string;
  tipo: 'casamento' | 'cha-panela';
  reservedUntil: string | null;
  isBought: boolean;
  onReservationChange: () => void;
}

export const useGiftReservation = ({
  giftId,
  tipo,
  reservedUntil,
  isBought,
  onReservationChange,
}: UseGiftReservationProps) => {
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  // Derive isExpired from reservedUntil instead of using state
  const isExpired = useMemo(() => {
    if (!reservedUntil || isBought) return false;
    return new Date(reservedUntil).getTime() <= new Date().getTime();
  }, [reservedUntil, isBought]);

  const clearReservation = useCallback(async () => {
    try {
      // This would need to be called from the server side or with proper authentication
      // For now, we'll just trigger a refresh
      onReservationChange();
    } catch (error) {
      console.error('Erro ao limpar reserva:', error);
    }
  }, [onReservationChange]);

  // Calculate time remaining
  useEffect(() => {
    if (!reservedUntil || isBought) {
      return;
    }

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const until = new Date(reservedUntil).getTime();
      const diff = until - now;

      if (diff <= 0) {
        setTimeRemaining("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${hours}h ${minutes}m`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [reservedUntil, isBought]);

  // Auto-clear expired reservations
  useEffect(() => {
    if (isExpired && reservedUntil && !isBought) {
      clearReservation();
    }
  }, [isExpired, reservedUntil, isBought, clearReservation]);

  const reserveGift = async (name: string, phone: string) => {
    try {
      const response = await apiClient.reserveGift({ giftId, tipo, name, phone });

      toast({
        title: "Presente reservado!",
        description: `Seu código de acesso: ${response.accessCode || '****'}. Guarde este código para gerenciar sua reserva.`,
      });

      // Optionally save name in localStorage for convenience
      if (name) {
        localStorage.setItem('gift_reservation_name', name);
      }

      onReservationChange();
    } catch (error) {
      console.error('Erro ao reservar presente:', error);
      toast({
        title: "Erro ao reservar",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const markAsBought = async (code: string): Promise<boolean> => {
    try {
      await apiClient.markGiftPurchased({ giftId, tipo, code });

      toast({
        title: "Presente comprado!",
        description: "Obrigado por presentear os noivos!",
      });

      onReservationChange();
      return true;
    } catch (error) {
      console.error('Erro ao marcar como comprado:', error);
      toast({
        title: "Erro ao confirmar compra",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelReservation = async (code: string): Promise<boolean> => {
    try {
      await apiClient.cancelReservation({ giftId, tipo, code });

      toast({
        title: "Reserva cancelada!",
        description: "O presente está disponível novamente.",
      });

      onReservationChange();
      return true;
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      toast({
        title: "Erro ao cancelar reserva",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    reserveGift,
    markAsBought,
    cancelReservation,
    timeRemaining,
    isExpired,
  };
};