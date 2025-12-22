 "use client";

import { Button } from "@/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Copy, MapPin } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";

interface DeliveryAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  giftName: string;
}

export const DeliveryAddressDialog = ({
  open,
  onOpenChange,
  giftName,
}: DeliveryAddressDialogProps) => {
  const [copied, setCopied] = useState(false);

  const address =
    "Ladeira Doutor Bezerra de Menezes - Vitória, ES\nCEP: 29032-159";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <MapPin className="w-16 h-16 text-foreground" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Endereço de Entrega
          </DialogTitle>
          <DialogDescription className="text-center">
            Para o presente: <strong>{giftName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <Card className="w-full">
              <CardHeader className="flex flex-col items-center">
                <CardTitle className="text-center w-full">
                  <h3 className="text-center font-bold mb-3">
                    Endereço do Presente:
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-foreground font-medium whitespace-pre-line text-center">
                      {address}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="w-full mt-2">
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? "Endereço copiado!" : "Copiar endereço"}
                    </Button>
                    {copied && (
                      <p className="text-xs text-green-600 text-center animate-in fade-in">
                        ✓ Copiado para a área de transferência
                      </p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
              <strong>Lembrete:</strong> Envie o presente para este endereço
              após a compra.
            </p>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
            variant="default">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
