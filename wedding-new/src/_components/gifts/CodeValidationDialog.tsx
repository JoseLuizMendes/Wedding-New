"use client";

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/_components/ui/input-otp";
import { Loader2, AlertCircle } from "lucide-react";

interface CodeValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate: (code: string) => Promise<boolean>;
  title: string;
  description: string;
}

export const CodeValidationDialog = ({
  open,
  onOpenChange,
  onValidate,
  title,
  description,
}: CodeValidationDialogProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      setError("Digite os 4 dígitos do código");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isValid = await onValidate(code);
      
      if (isValid) {
        // Reset and close on success
        setCode("");
        setError("");
        onOpenChange(false);
      } else {
        setError("Código inválido. Tente novamente.");
        setCode("");
      }
    } catch (error) {
      console.error("Error validating code:", error);
      setError("Erro ao validar código. Tente novamente.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCode("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={code}
                onChange={(value) => {
                  setCode(value);
                  if (error) setError("");
                }}
                disabled={loading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <p className="text-center text-sm text-muted-foreground">
              Digite os últimos 4 dígitos do seu telefone
            </p>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || code.length !== 4}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};