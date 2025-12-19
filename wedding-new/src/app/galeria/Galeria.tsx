import { motion } from "framer-motion";
import { Camera, Image as ImageIcon } from "lucide-react";
import { Card } from "@/_components/ui/card";
import Image from "next/image";

// Fotos do casal - adicione suas imagens em public/assetsGaleria
// Nomeie as imagens como: foto-1.jpg, foto-2.jpg, foto-3.jpg, etc.
const photos = [
  { id: 1, src: "/assetsGaleria/foto-1.jpeg", alt: "José Luiz e Márjorie - Foto 1" },
  // { id: 2, src: "/assetsGaleria/foto-2.png", alt: "José Luiz e Márjorie - Foto 2" },
  // { id: 3, src: "/assetsGaleria/foto-3.png", alt: "José Luiz e Márjorie - Foto 3" },
  // { id: 4, src: "/assetsGaleria/foto-4.png", alt: "José Luiz e Márjorie - Foto 4" },
  // { id: 5, src: "/assetsGaleria/foto-5.png", alt: "José Luiz e Márjorie - Foto 5" },
  // { id: 6, src: "/assetsGaleria/foto-6.png", alt: "José Luiz e Márjorie - Foto 6" },
  // { id: 7, src: "/assetsGaleria/foto-7.png", alt: "José Luiz e Márjorie - Foto 7" },
  // { id: 8, src: "/assetsGaleria/foto-8.png", alt: "José Luiz e Márjorie - Foto 8" },
  // { id: 9, src: "/assetsGaleria/foto-9.png", alt: "José Luiz e Márjorie - Foto 9" },
  // { id: 10, src: "/assetsGaleria/foto-10.png", alt: "José Luiz e Márjorie - Foto 10" },
  // { id: 11, src: "/assetsGaleria/foto-11.png", alt: "José Luiz e Márjorie - Foto 11" },
  // { id: 12, src: "/assetsGaleria/foto-12.png", alt: "José Luiz e Márjorie - Foto 12" },
];

export const Galeria = () => {
  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 pt-20">
        {/* Header */}
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

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10 group">
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  {/* Use standard img tag to debug loading issues */}
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Message */}
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
    </div>
  );
};