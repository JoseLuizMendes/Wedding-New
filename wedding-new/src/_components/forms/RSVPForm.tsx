"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Textarea } from "@/_components/ui/textarea";
import { Label } from "@/_components/ui/label";
import { rsvpApi } from "@/lib/api/rsvp";
import { ApiError } from "@/lib/api/errors";
import { rsvpSchema } from "@/lib/validations/rsvp";
import { formatPhoneNumber, isValidPhoneNumber } from "@/lib/phoneUtils";
import { toast } from "sonner";

interface RSVPFormProps {
  tipo: "casamento" | "cha-panela";
  onSuccess?: () => void;
}

export const RSVPForm = ({ tipo, onSuccess }: RSVPFormProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "confirmed">("idle");
  const [formData, setFormData] = useState({
    nome_completo: "",
    contato: "",
    mensagem: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, contato: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Validate input
      const validatedData = rsvpSchema.parse(formData);

      if (tipo === "casamento") {
        await rsvpApi.confirmWedding(validatedData);
      } else {
        await rsvpApi.confirmBridalShower(validatedData);
      }

      // Mensagem de sucesso
      const successMessage = tipo === "casamento"
        ? "Obrigado por confirmar sua presença! Mal podemos esperar para celebrar com você."
        : "🎉 Obrigado por confirmar presença no nosso chá de panela!";

      toast.success("✅ Presença confirmada!", {
        description: successMessage,
        duration: 5000,
        style: {
          background: '#bbf7d0',
          border: '2px solid #4ade80',
          color: '#14532d',
        },
      });

      setFormData({ nome_completo: "", contato: "", mensagem: "" });
      setStatus("confirmed");

      // volta para o estado inicial depois de 3 segundos
      setTimeout(() => setStatus("idle"), 3000);

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao enviar RSVP:", error);
      
      let errorMessage = "Por favor, tente novamente mais tarde.";
      const errorTitle = "Erro ao confirmar presença";
      
      if (error instanceof z.ZodError) {
        errorMessage = error.issues[0].message;
      } else if (error instanceof ApiError) {
        // Usa mensagem específica da API se disponível
        if (error.errorMessage) {
          errorMessage = error.errorMessage;
        } else if (error.status === 409) {
          errorMessage = "Já existe uma confirmação com este nome.";
        } else if (error.status === 400) {
          errorMessage = "Dados inválidos. Verifique as informações.";
        } else {
          errorMessage = `Erro ${error.status}: ${error.statusText}`;
        }
      }
      
      toast.error(errorTitle, {
        description: errorMessage,
        duration: 6000,
        style: {
          background: '#fecaca',
          border: '2px solid #f87171',
          color: '#7f1d1d',
        },
      });
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          value={formData.nome_completo}
          onChange={(e) =>
            setFormData({ ...formData, nome_completo: e.target.value })
          }
          required
          placeholder="Seu nome completo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contato">Telefone com DDD *</Label>
        <Input
          id="contato"
          value={formData.contato}
          onChange={handlePhoneChange}
          required
          placeholder="(XX) XXXXX-XXXX"
          maxLength={15}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mensagem">Mensagem (opcional)</Label>
        <Textarea
          id="mensagem"
          value={formData.mensagem}
          onChange={(e) =>
            setFormData({ ...formData, mensagem: e.target.value })
          }
          placeholder="Deixe uma mensagem carinhosa..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        className={`w-full flex items-center bg-slate-400 text-white justify-center gap-2 transition-all ${
          status === "confirmed" ? "bg-emerald-300 text-neutral-800 hover:bg-emerald-700" : ""
        }`}
        disabled={status === "loading" || status === "confirmed"}
      >
        {status === "loading" ? (
          <>
            <div className="w-4 h-4" />
            Confirmando...
          </>
        ) : status === "confirmed" ? (
          "✅ Confirmado!"
        ) : (
          "Confirmar Presença"
        )}
      </Button>
    </form>
  );
};