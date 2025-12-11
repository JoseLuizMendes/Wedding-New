import { motion } from "framer-motion";
import { Heart, Sparkles, Rose, Calendar, Plane, HeartHandshake, Gem, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_components/ui/card";
import BackgroundMusic from "@/_components/bg-music";
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
    description: "Um mês depois, nos vimos novamente em outro evento, dessa vez na praia. Apesar da distância, começamos a perceber sutilmente alguns pontos em comum entre nós.",
    color: "text-accent",
  },
  {
    icon: Calendar,
    year: "2024",
    title: "O Retiro da Família",
    description: "Durante o retiro da igreja, começamos a interagir com mais frequência. E tivemos a oportunidade de nos conhecer melhor, tivemos uma conversa espontânea e profunda. Foi o pontapé inicial para o que viria a seguir.",
    color: "text-primary",
  },
  {
    icon: Flame,
    year: "2024",
    title: "Adorando Lado a Lado",
    description: "Nosso primeiro encontro oficial foi em um culto de jovens. Durante um momento de adoração a Deus, sentimos uma conexão inegável e a certeza de que era bom estar lado a lado. Ali, na presença d'Ele, percebemos o alinhamento de nossos corações.",
    color: "text-primary",
  },
  {
    icon: Rose,
    year: "2024",
    title: "A Primeira Surpresa",
    description: "Descobri que ela teria uma programação na minha cidade e decidi aparecer de surpresa. Foi a primeira vez que demonstrei o quanto ela já era importante pra mim e o quanto eu estava disposto a fazer por nós. Foi um momento especial que ficou marcado em nossas memórias.",
    color: "text-accent",
  },
  {
    icon: Plane,
    year: "2024",
    title: "Primeira Viagem Juntos",
    description: "Fomos ao evento 'Discípulo Radical' e tivemos experiências incríveis com Deus. Essa viagem nos aproximou e reforçou a conexão que já existia. Compartilhamos na volta os momentos indivíduais que Deus falou conosco, fortalecendo ainda mais nosso vínculo e a certeza de eramos o presente de Deus na vida um do outro.",
    color: "text-primary",
  },
  {
    icon: HeartHandshake,
    year: "2024",
    title: "Servindo Lado a Lado",
    description: "Participamos juntos do evento 'Encontro com o Amor de Deus'. Servir ao lado dela foi uma experiência que nos uniu ainda mais. Vimos como nossas habilidades e corações se complementam quando trabalhamos juntos para um propósito maior. Nesse momento, percebemos que estávamos construindo algo sólido e significativo. Contagem regressiva para o pedido de namoro!",
    color: "text-accent",
  },
  {
    icon: Gem,
    year: "2024",
    title: "O Pedido de Namoro",
    description: "No dia 28 de setembro, convidei a Marjorie para ir à minha casa. Arquitetei todo o cenario para tornar aquele momento inesquecível. Fomos pra orla, e lá estava nós e o violão que estava me acompanhando desde o início da nossa história. Toquei umas músicas especiais, conversamos e, ao final, fiz o pedido de namoro. Ela disse sim! Foi um momento que marcou o início do nosso compromisso sério um com o outro.",
    color: "text-primary",
  },
  {
    icon: Sparkles,
    year: "2025",
    title: "Nosso Noivado",
    description: "Um ano depois, celebramos o nosso noivado. Foi um momento de muita alegria e emoção, onde reafirmamos nosso compromisso de caminhar juntos rumo ao casamento. Estamos crescendo juntos em amor e fé, prucurando ser melhores pro outro todos os dias e sendo aquilo que Deus nos criou para ser.",
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
                      <CardTitle className="playfair-custom text-2xl md:text-3xl">
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
                &quot;Acima de tudo, porém, revistam-se do amor, que é o elo perfeito.
                <br />
                O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha. Tudo sofre, tudo crê, tudo espera, tudo suporta.&quot;
              </p>
              <p>
                &quot;A partir de agora nós ajudaremos um ao outro a chegar no céu!&quot;
                <br /><br />
              </p>
              <p className="text-lg playfair-custom text-muted-foreground font-medium">
                - José & Márjorie
                <br />
                (Colossenses 3:14 e 1 Coríntios 13:4, 7)
              </p>
            </CardContent>
          </Card>

        </motion.div>
      </div>
       <BackgroundMusic />
    </div>
  );
};