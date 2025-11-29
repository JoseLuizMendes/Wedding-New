import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-400 text-background py-8 mt-0">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
          <p className="text-lg playfair-custom text-primary-foreground">
            José Luiz & Márjorie
          </p>
          <Heart className="w-5 h-5 text-primary-foreground fill-primary-foreground" />
        </div>
        <p className="text-sm text-primary-foreground mb-2">
          07 de Setembro de 2026
        </p>
        <p className="text-xs text-primary-foreground">
          Desenvolvido por José Luiz dos Santos Azeredo Mendes
        </p>
      </div>
    </footer>
  );
};