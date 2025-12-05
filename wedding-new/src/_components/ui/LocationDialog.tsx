"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/_components/ui/dialog";
import { Button } from "@/_components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

interface LocationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  locationName: string;
  locationAddress: string;
  googleMapsUrl: string;
}

export const LocationDialog = ({
  isOpen,
  onOpenChange,
  locationName,
  locationAddress,
  googleMapsUrl,
}: LocationDialogProps) => {
  const handleOpenLocation = () => {
    // Detecta se é mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // No mobile, usa geo: URL que permite o usuário escolher o app
      // Extrai coordenadas do link do Google Maps se possível, ou usa o endereço
      const address = encodeURIComponent(`${locationName}, ${locationAddress}`);
      window.open(`geo:0,0?q=${address}`, '_blank');
    } else {
      // No desktop, abre direto no Google Maps
      window.open(googleMapsUrl, '_blank');
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Abrir Localização
          </DialogTitle>
          <DialogDescription className="pt-4 space-y-2">
            <p className="font-semibold text-foreground">{locationName}</p>
            <p className="text-sm">{locationAddress}</p>
            <p className="text-sm pt-2">
              Deseja abrir a localização no seu aplicativo de mapas?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleOpenLocation}
            className="w-full sm:w-auto"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Abrir Localização
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
