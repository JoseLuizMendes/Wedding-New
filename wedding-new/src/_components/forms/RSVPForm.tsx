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
import { shouldShowInviteAfterRSVP, getSuccessMessage } from "../../config/inviteConfig";
import { openAndDownloadInvite } from "../../utils/inviteUtils";
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

      // Mensagem de sucesso (customizada se convite estiver habilitado)
      const successMessage = shouldShowInviteAfterRSVP(tipo) 
        ? getSuccessMessage(tipo)
        : tipo === "casamento"
          ? "Obrigado por confirmar sua presença! Mal podemos esperar para celebrar com você."
          : "🎉 Obrigado por confirmar presença no nosso chá de panela!";

      toast("✅ Presença confirmada!", {
        description: successMessage,
        action: { label: "Fechar", onClick: () => toast.dismiss() },
        duration: 6000,
      });

      setFormData({ nome_completo: "", contato: "", mensagem: "" });
      setStatus("confirmed");

      // 🎉 SISTEMA DE CONVITES - Abre convite em nova página
      if (shouldShowInviteAfterRSVP(tipo)) {
        // Aguarda um pouco para o usuário ver a mensagem de sucesso
        setTimeout(() => {
          openAndDownloadInvite(validatedData.nome_completo, tipo);
        }, 1500);
      }

      // volta para o estado inicial depois de 3 segundos
      setTimeout(() => setStatus("idle"), 3000);

      onSuccess?.();
    } catch (error) {
      console.error("Erro ao enviar RSVP:", error);
      
      let errorMessage = "Por favor, tente novamente mais tarde.";
      if (error instanceof z.ZodError) {
        errorMessage = error.issues[0].message;
      } else if (error instanceof ApiError) {
        errorMessage = `Erro ${error.status}: ${error.statusText}`;
      }
      
      toast("Erro ao confirmar presença", {
        description: errorMessage,
        action: { label: "Fechar", onClick: () => toast.dismiss() },
        duration: 6000,
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
        <Label htmlFor="contato">Telefone *</Label>
        <Input
          id="contato"
          value={formData.contato}
          onChange={(e) =>
            setFormData({ ...formData, contato: e.target.value })
          }
          required
          placeholder="(00) 00000-0000"
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