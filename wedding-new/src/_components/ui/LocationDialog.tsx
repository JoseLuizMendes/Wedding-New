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
    // Detecta se é mobile (iOS ou Android)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isIOS) {
      // No iOS, usa o link do Google Maps que permite escolher o app
      // O iOS vai perguntar se quer abrir no Apple Maps, Google Maps, Waze, etc
      window.open(googleMapsUrl, '_blank');
    } else if (isAndroid) {
      // No Android, usa geo: que mostra a lista de apps de mapas disponíveis
      const address = encodeURIComponent(`${locationName}, ${locationAddress}`);
      const geoUrl = `geo:0,0?q=${address}`;
      
      // Tenta abrir, se não funcionar, abre o Google Maps
      const opened = window.open(geoUrl, '_blank');
      if (!opened) {
        window.open(googleMapsUrl, '_blank');
      }
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
