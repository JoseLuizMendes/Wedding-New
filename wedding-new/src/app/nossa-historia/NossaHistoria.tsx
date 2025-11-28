import { motion } from "framer-motion";
import { Heart, Sparkles, CircleDot, Calendar, Plane, HeartHandshake, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
//import BackgroundMusic from "@/_components/BackgroundMusic";
import { HeroSection } from "@/_components/hero-section";

const timeline = [
  {
    icon: Sparkles,
    year: "2024",
    title: "Como Tudo Começou",
    description: "Nos conhecemos em um evento de jovens. Foi quando tivemos nossa primeira conversa — e, sem saber, provei uma torta de limão feita por ela. Foi ali que algo diferente começou.",
    color: "text-primary",
  },
  {
    icon: Heart,
    year: "2024",
    title: "O Reencontro na Praia",
    description: "Um mês depois, nos vimos novamente em outro evento, dessa vez na praia. Apesar da distância, aquele dia marcou mais um passo na nossa história.",
    color: "text-accent",
  },
  {
    icon: Calendar,
    year: "2024",
    title: "O Retiro da Família",
    description: "Durante o retiro da igreja, voltamos a conversar. Um simples gesto — eu esperá-la — fez a diferença. A conversa que tivemos naquele dia mudou tudo.",
    color: "text-primary",
  },
  {
    icon: CircleDot,
    year: "2024",
    title: "A Primeira Surpresa",
    description: "Descobri que ela teria um treino na minha cidade e decidi aparecer de surpresa. Foi a primeira vez que demonstrei o quanto ela já era importante pra mim.",
    color: "text-accent",
  },
  {
    icon: Plane,
    year: "2024",
    title: "Primeira Viagem Juntos",
    description: "Fomos ao evento 'Discípulo Radical' e tivemos experiências incríveis com Deus. Essa viagem nos aproximou e reforçou a conexão que já existia.",
    color: "text-primary",
  },
  {
    icon: HeartHandshake,
    year: "2024",
    title: "Servindo Lado a Lado",
    description: "Participamos juntos do evento 'Encontro com o Amor de Deus'. Servir juntos foi especial e nos fez perceber o quanto seguimos o mesmo propósito.",
    color: "text-accent",
  },
  {
    icon: Gem,
    year: "2024",
    title: "O Pedido de Namoro",
    description: "No dia 28 de setembro, convidei a Marjorie para ir à minha casa. Conversamos, rimos e, com o coração tranquilo, pedi que ela fosse minha namorada.",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    year: "2025",
    title: "Nosso Noivado",
    description: "Um ano depois, celebramos o nosso noivado. Hoje seguimos firmes, com amor, fé e a certeza de que Deus está guiando cada passo até o altar.",
    color: "text-accent",
  },
];

export const NossaHistoria = () => {
  return (
    <div className="min-h-screen pb-12">
      <HeroSection/>
      <div className="container mx-auto px-4 pt-20">
        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          {timeline.map((event, index) => (
            <motion.div
              key={`timeline-${index}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-12 last:mb-0"
            >
              <Card className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ${event.color}`}>
                      <event.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-grow">
                      <div className={`text-sm font-bold ${event.color} mb-1`}>
                        {event.year}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl">
                        {event.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Closing Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20 max-w-3xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-[var(--shadow-romantic)]">
            <CardContent className="pt-12 pb-12">
              <Heart className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse fill-primary" />
              <p className="text-xl md:text-2xl font-serif text-foreground mb-4 leading-relaxed">
                "E agora, estamos prontos para escrever o próximo capítulo da nossa história... juntos, para sempre."
              </p>
              <p className="text-lg text-muted-foreground font-medium">
                - José Luiz & Márjorie
              </p>
            </CardContent>
          </Card>

        </motion.div>
      </div>
       {/*<BackgroundMusic />*/}
    </div>
  );
};
