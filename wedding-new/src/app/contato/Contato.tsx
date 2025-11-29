import { motion } from "framer-motion";
import { Phone, MessageCircleMore  } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";

const contacts = [
  {
    icon: MessageCircleMore ,
    title: "WhatsApp",
    description: "Márjorie",
    value: "(27) 98800-9223",
    link: "https://wa.me/5527988009223",
    color: "text-green-600",
    bgColor: "from-green-500/10 to-green-600/10",
  },
];

export const Contato = () => {
  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 space-y-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 p-20"
        >
          <Phone className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 text-foreground">
            Entre em Contato
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6" />
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ficou com alguma dúvida? Quer enviar uma mensagem especial? 
            Estamos aqui para conversar com você!
          </p>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-[var(--shadow-romantic)]">
            <CardContent className="pt-8 pb-8 text-center">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                Informações Importantes
              </h3>
              <div className="space-y-4 text-left max-w-xl mx-auto">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Confirmação de Presença:</strong> Por favor, confirme sua presença até as datas indicadas em cada evento!
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Posso levar acompanhante?</strong> Os convites são individuais — nos preocupamos em fazer um convite especialmente para você!
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Crianças são bem-vindas?</strong> São sim! Só pedimos que, durante a cerimônia, fiquem tranquilas e não corram ou andem pelo espaço pra não atrapalhar o momento!
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">E se eu não puder ir depois de confirmar?</strong> Acontece! Só pedimos que avise assim que souber, pra conseguirmos organizar tudo direitinho!
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Dúvidas?</strong> Entre em contato conosco através de qualquer um dos canais acima!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

         {/* Contact Cards */}
        <div className="max-w-5xl mx-auto mb-16">
          {contacts.map((contact, index) => (
            <motion.div
              key={contact.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-romantic)] transition-all duration-300 border-primary/10 group">
                <CardHeader className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${contact.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <contact.icon className={`w-10 h-10 ${contact.color}`} />
                  </div>
                  <CardTitle className="text-2xl">{contact.title}</CardTitle>
                  <CardDescription className="text-base">
                    {contact.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-medium text-foreground mb-4">
                    {contact.value}
                  </p>
                  <a href={contact.link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full group/btn">
                      Entrar em Contato
                      <contact.icon className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};