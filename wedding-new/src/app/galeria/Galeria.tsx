import { motion } from "framer-motion";
import { Camera, Image as ImageIcon } from "lucide-react";
import { Card } from "@/_components/ui/card";
import Image from "next/image";

// Placeholder images - these would be replaced with real photos
const photos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  alt: `Foto do casal ${i + 1}`,
  placeholder: `https://images.unsplash.com/photo-${
    [
      '1519741497674-611481863552', // couple
      '1465495976277-4387d4b0b4c6', // wedding
      '1511285560929-80b456fea0bc', // couple portrait
      '1529634597168-2f1c6c30e0f8', // wedding details
      '1606800052428-0c2d0ca97808', // couple outdoor
      '1522413452208-996ff3a3d8e3', // romantic
      '1525258090186-0461fc6bbc51', // couple dancing
      '1510869886599-88aa0e1e3acb', // wedding rings
      '1532712938310-34e887e93346', // couple laughing
      '1522673607209-0e37d3db5d4b', // romantic moment
      '1523438097201-512ae7d59c44', // couple nature
      '1520854221256-17451cc331bf', // wedding celebration
    ][i]
  }?auto=format&fit=crop&w=800&q=80`,
}));

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
                  <Image
                    src={photo.placeholder}
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