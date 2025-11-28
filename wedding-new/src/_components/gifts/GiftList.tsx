"use client";

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/card";
import { Button } from "@/_components/ui/button";
import { ExternalLink, Gift as GiftIcon, Clock, ShoppingCart, AlertCircle, X } from "lucide-react";
import { apiClient } from "../../lib/api-client";
import { motion } from "framer-motion";
import { useGiftReservation } from "../../hooks/useGiftReservation";
import { Badge } from "@/_components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/_components/ui/tabs";
import { GiftListSkeleton } from "./GiftListSkeleton";
import { IdentificationDialog } from "./IdentificationDialog";
import { CodeValidationDialog } from "./CodeValidationDialog";

interface Gift {
  id: string;
  nome: string;
  descricao: string | null;
  link_externo: string;
  reservado: boolean;
  ordem: number;
  reserved_until: string | null;
  is_bought: boolean;
  reserved_by: string | null;
  reserved_phone_display: string | null;
  reserved_at: string | null;
  purchased_at: string | null;
  imagem: string | null;
}

interface GiftListProps {
  tipo: 'casamento' | 'cha-panela';
}

export const GiftList = ({ tipo }: GiftListProps) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'reserved' | 'bought'>('all');

  useEffect(() => {
    fetchGifts();
  }, [tipo]);

  const fetchGifts = async () => {
    try {
      const data = await apiClient.getGifts(tipo);
      setGifts(data || []);
    } catch (error) {
      console.error('Erro ao carregar presentes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GiftListSkeleton />;
  }

  const getGiftStatus = (gift: Gift): 'available' | 'reserved' | 'bought' => {
    if (gift.is_bought) return 'bought';
    if (gift.reservado && gift.reserved_until) {
      const isExpired = new Date(gift.reserved_until) < new Date();
      return isExpired ? 'available' : 'reserved';
    }
    return 'available';
  };

  const filteredGifts = gifts.filter(gift => {
    const status = getGiftStatus(gift);
    if (activeFilter === 'all') return true;
    return status === activeFilter;
  });

  const giftStats = {
    total: gifts.length,
    available: gifts.filter(g => getGiftStatus(g) === 'available').length,
    reserved: gifts.filter(g => getGiftStatus(g) === 'reserved').length,
    bought: gifts.filter(g => g.is_bought).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center hover-scale">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{giftStats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="text-center hover-scale">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-green-600">{giftStats.available}</p>
            <p className="text-sm text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>
        <Card className="text-center hover-scale">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-primary">{giftStats.reserved}</p>
            <p className="text-sm text-muted-foreground">Reservados</p>
          </CardContent>
        </Card>
        <Card className="text-center hover-scale">
          <CardContent className="pt-6">
            <p className="text-3xl font-bold text-muted-foreground">{giftStats.bought}</p>
            <p className="text-sm text-muted-foreground">Comprados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as never)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="reserved">Reservados</TabsTrigger>
          <TabsTrigger value="bought">Comprados</TabsTrigger>
        </TabsList>
        <TabsContent value={activeFilter} className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {filteredGifts.map((gift, index) => {
              const status = getGiftStatus(gift);
              
              return (
                <GiftCard 
                  key={gift.id}
                  gift={gift}
                  status={status}
                  tipo={tipo}
                  index={index}
                  onUpdate={fetchGifts}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GiftCardProps {
  gift: Gift;
  status: 'available' | 'reserved' | 'bought';
  tipo: 'casamento' | 'cha-panela';
  index: number;
  onUpdate: () => void;
}

const GiftCard = ({ gift, status, tipo, index, onUpdate }: GiftCardProps) => {
  const [showIdentificationDialog, setShowIdentificationDialog] = useState(false);
  const [showMarkPurchasedDialog, setShowMarkPurchasedDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const { 
    reserveGift, 
    markAsBought, 
    cancelReservation,
    timeRemaining 
  } = useGiftReservation({
    giftId: gift.id,
    tipo,
    reservedUntil: gift.reserved_until,
    isBought: gift.is_bought,
    onReservationChange: onUpdate,
  });

  // Calcular tempo restante em minutos
  const getTimeRemainingInMinutes = () => {
    if (!gift.reserved_until) return 0;
    const diff = new Date(gift.reserved_until).getTime() - new Date().getTime();
    return Math.floor(diff / 1000 / 60);
  };

  const minutesRemaining = getTimeRemainingInMinutes();
  const isExpiringSoon = minutesRemaining > 0 && minutesRemaining <= 10;

  const getStatusConfig = () => {
    switch (status) {
      case 'bought':
        return {
          badge: { label: "Comprado", variant: "secondary" as const },
          icon: GiftIcon,
          iconColor: "text-muted-foreground",
          cardClass: "opacity-60",
          showWarning: false,
        };
      case 'reserved':
        return {
          badge: { label: `Reservado - ${timeRemaining}`, variant: "default" as const },
          icon: Clock,
          iconColor: isExpiringSoon ? "text-orange-500" : "text-primary",
          cardClass: isExpiringSoon ? "border-orange-500/50" : "",
          showWarning: isExpiringSoon,
        };
      default:
        return {
          badge: { label: "Disponível", variant: "outline" as const },
          icon: ShoppingCart,
          iconColor: "text-green-600",
          cardClass: "",
          showWarning: false,
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className={`h-full hover:shadow-romantic transition-all duration-300 ${config.cardClass}`}>
          <CardHeader>
            {gift.imagem?.trim() && !imageLoadError && (
              <div className="mb-4 -mx-6 -mt-6">
                <img 
                  src={gift.imagem} 
                  alt={gift.nome}
                  className="w-full h-48 object-cover rounded-t-lg"
                  onError={() => setImageLoadError(true)}
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-xl flex-1">{gift.nome}</CardTitle>
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-5 h-5 ${config.iconColor} ${isExpiringSoon ? 'animate-pulse' : ''}`} />
                <Badge variant={config.badge.variant}>
                  {config.badge.label}
                </Badge>
              </div>
            </div>
            {config.showWarning && (
              <div className="flex items-center gap-2 text-orange-500 text-sm mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>Reserva expirando em breve!</span>
              </div>
            )}
            {gift.descricao && (
              <CardDescription>{gift.descricao}</CardDescription>
            )}
            {status === 'reserved' && gift.reserved_phone_display && (
              <div className="text-sm text-muted-foreground mt-2">
                Reservado por: {gift.reserved_phone_display}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {status === 'available' && (
              <>
                <Button 
                  onClick={() => setShowIdentificationDialog(true)}
                  className="w-full"
                  variant="default"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Quero Presentear
                </Button>
                <Button 
                  asChild 
                  className="w-full"
                  variant="outline"
                >
                  <a 
                    href={gift.link_externo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Ver Detalhes
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </>
            )}
            
            {status === 'reserved' && (
              <>
                <Button 
                  onClick={() => setShowMarkPurchasedDialog(true)}
                  className="w-full"
                  variant="default"
                >
                  <GiftIcon className="w-4 h-4 mr-2" />
                  Marcar como Comprado
                </Button>
                <Button 
                  asChild 
                  className="w-full"
                  variant="outline"
                >
                  <a 
                    href={gift.link_externo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    Finalizar Compra
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button 
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full"
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar Reserva
                </Button>
              </>
            )}

            {status === 'bought' && (
              <Button 
                asChild 
                className="w-full"
                variant="secondary"
                disabled
              >
                <div className="flex items-center justify-center gap-2">
                  <GiftIcon className="w-4 h-4" />
                  Já Comprado
                </div>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <IdentificationDialog
        open={showIdentificationDialog}
        onOpenChange={setShowIdentificationDialog}
        onConfirm={reserveGift}
        giftName={gift.nome}
      />

      <CodeValidationDialog
        open={showMarkPurchasedDialog}
        onOpenChange={setShowMarkPurchasedDialog}
        onValidate={markAsBought}
        title="Marcar como Comprado"
        description="Digite seu código de acesso para confirmar a compra"
      />

      <CodeValidationDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onValidate={cancelReservation}
        title="Cancelar Reserva"
        description="Digite seu código de acesso para cancelar a reserva"
      />
    </>
  );
};