"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { Card } from "@/_components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/_components/ui/dialog";

// Caminho confirmado pelo seu teste (.jpeg)
const photos = [
  { id: 1, src: "/assetsGaleria/foto-1.jpeg", alt: "José Luiz e Márjorie" },
  // Adicione as outras fotos aqui...
];

export const Galeria = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-20">
        
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Camera className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
            Galeria de Fotos
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Momentos especiais capturados ao longo da nossa jornada juntos
          </p>
        </motion.div>

        {/* Grade de Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              layoutId={`photo-${photo.id}`}
              onClick={() => setSelectedPhoto(photo)}
              className="cursor-pointer"
            >
              <Card className="overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10 group h-full">
                {/* Mantivemos o aspect-square do Tailwind, mas usamos a tag img
                    EXATAMENTE como no teste que funcionou (style inline), 
                    removendo 'loading=lazy' que pode estar bugando.
                */}
                <div className="aspect-square bg-muted relative">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay Escuro ao passar o mouse */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                     <Camera className="w-8 h-8 text-white drop-shadow-md transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mensagem Final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-[var(--shadow-romantic)] p-8">
            <Camera className="w-10 h-10 text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground leading-relaxed">
              Estamos ansiosos para adicionar ainda mais momentos memoráveis à nossa coleção.
              Mal podemos esperar para compartilhar nosso dia especial com você!
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Modal / Lightbox */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none flex justify-center items-center outline-none">
            
            <DialogTitle className="sr-only">
                Visualização da foto
            </DialogTitle>

            <div className="relative w-auto h-auto max-w-[95vw] max-h-[90vh]">
                <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPhoto(null);
                    }}
                    className="absolute -top-12 right-0 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors focus:outline-none backdrop-blur-sm"
                    title="Fechar"
                >
                    <X className="w-6 h-6" />
                    <span className="sr-only">Fechar</span>
                </button>

                {selectedPhoto && (
                    <motion.div
                        layoutId={`photo-${selectedPhoto.id}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative flex items-center justify-center"
                    >
                        <img
                            src={selectedPhoto.src}
                            alt={selectedPhoto.alt}
                            className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
                        />
                    </motion.div>
                )}
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};