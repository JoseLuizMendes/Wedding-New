"use client";

import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { CheckCircle, Copy, MapPin } from "lucide-react";
import { useState } from "react";
import { DeliveryAddressDialog } from "./DeliveryAddressDialog";

interface SuccessGiftProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  giftName: string;
  accessCode: string;
}

export const SuccessGift = ({
  open,
  onOpenChange,
  giftName,
  accessCode,
}: SuccessGiftProps) => {
  const [copied, setCopied] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Presente reservado!
          </DialogTitle>
          <DialogDescription className="text-center">
            Você reservou: <strong>{giftName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-center">
              Seu código de acesso:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-2xl font-bold text-foreground tracking-wider bg-background px-4 py-2 rounded border">
                {accessCode}
              </code>
              <Button
                variant="foreground"
                onClick={handleCopyCode}
                className="size-12 bg-foreground">
                <Copy className="text-zinc-50" />
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 text-center animate-in fade-in">
                Código copiado!
              </p>
            )}
          </div>

          <Button
            onClick={() => setShowAddressDialog(true)}
            variant="outline"
            className="w-full group">
            <MapPin className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Ver endereço de entrega
          </Button>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-200 text-center">
              <strong>Importante:</strong> Guarde este código para gerenciar sua
              reserva (marcar como comprado ou cancelar).
            </p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            variant="default">
            Entendi
          </Button>
        </div>
      </DialogContent>

      <DeliveryAddressDialog
        open={showAddressDialog}
        onOpenChange={setShowAddressDialog}
        giftName={giftName}
      />
    </Dialog>
  );
};
