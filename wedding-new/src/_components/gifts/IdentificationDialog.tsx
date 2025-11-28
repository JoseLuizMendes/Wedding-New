import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { Input } from "@/_components/ui/input";
import { Label } from "@/_components/ui/label";
import { formatPhoneNumber, isValidPhoneNumber } from "../../lib/phoneUtils";
import { Loader2 } from "lucide-react";
import { AlertDialog } from "@/_components/ui/alert-dialog";

interface IdentificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (name: string, phone: string) => Promise<void>;
  giftName: string;
}

export const IdentificationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  giftName,
}: IdentificationDialogProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", phone: "" });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors({ ...errors, phone: "" });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }
  };

  const validate = () => {
    const newErrors = { name: "", phone: "" };
    let isValid = true;

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = "Nome deve ter no mínimo 3 caracteres";
      isValid = false;
    }

    if (!isValidPhoneNumber(phone)) {
      newErrors.phone = "Telefone inválido. Use (XX) XXXXX-XXXX";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onConfirm(name.trim(), phone);
      // Reset form on success
      setName("");
      setPhone("");
      setErrors({ name: "", phone: "" });
    } catch (error) {
      console.error("Error confirming reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservar Presente</DialogTitle>
          <DialogDescription>
            Você está reservando: <strong>{giftName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              placeholder="Seu nome completo"
              value={name}
              onChange={handleNameChange}
              disabled={loading}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone com DDD *</Label>
            <Input
              id="phone"
              placeholder="(XX) XXXXX-XXXX"
              value={phone}
              onChange={handlePhoneChange}
              disabled={loading}
              maxLength={15}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Os últimos 4 dígitos serão seu código de acesso
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1">
              Cancelar
            </Button>
            <DialogClose>
              <Button
                type="submit"
                variant="default"
                disabled={loading}
                className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  "Confirmar Reserva"
                )}
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};