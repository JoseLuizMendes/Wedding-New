"use client";

import { OptimizedImage } from "@/_components/ui/OptimizedImage";
import { Badge } from "@/_components/ui/badge";
import { Button } from "@/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/_components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/_components/ui/pagination";
import { Skeleton } from "@/_components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_components/ui/tabs";
import { Gift, giftsApi } from "@/lib/api/gifts";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  ExternalLink,
  Filter,
  Gift as GiftIcon,
  ShoppingCart,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGiftReservation } from "../../hooks/useGiftReservation";
import { CodeValidationDialog } from "./CodeValidationDialog";
import { GiftListSkeleton } from "./GiftListSkeleton";
import { IdentificationDialog } from "./IdentificationDialog";
import { PixContributionCard } from "./PixContributionCard";
import { SuccessGift } from "./SuccessGift";

interface GiftListProps {
  tipo: "casamento" | "cha-panela";
}

export const GiftList = ({ tipo }: GiftListProps) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "available" | "reserved" | "bought"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const fetchGifts = useCallback(async () => {
    try {
      const data = await giftsApi.getByEvent(tipo);
      setGifts(data || []);
    } catch (error) {
      console.error("Erro ao carregar presentes:", error);
    } finally {
      setLoading(false);
    }
  }, [tipo]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts]);

  if (loading) {
    return <GiftListSkeleton />;
  }

  const getGiftStatus = (gift: Gift): "available" | "reserved" | "bought" => {
    if (gift.is_bought) return "bought";
    if (gift.reservado && gift.reserved_until) {
      const isExpired = new Date(gift.reserved_until) < new Date();
      return isExpired ? "available" : "reserved";
    }
    return "available";
  };

  const filteredGifts = gifts
    .filter(gift => !gift.nome.includes("Contribuição Pix")) // Filtrar os cards PIX antigos
    .filter(gift => {
      const status = getGiftStatus(gift);
      if (activeFilter === "all") return true;
      return status === activeFilter;
    });

  const giftStats = {
    total: gifts.length,
    available: gifts.filter(g => getGiftStatus(g) === "available").length,
    reserved: gifts.filter(g => getGiftStatus(g) === "reserved").length,
    bought: gifts.filter(g => g.is_bought).length,
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div>
        <Tabs
          value={activeFilter}
          onValueChange={v => {
            setActiveFilter(v as never);
            setCurrentPage(1);
          }}
          className="flex-1">
          {/* Desktop - Todos os filtros visíveis */}
          <TabsList className="hidden md:grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos ({giftStats.total})</TabsTrigger>
            <TabsTrigger value="available">
              Disponíveis ({giftStats.available})
            </TabsTrigger>
            <TabsTrigger value="reserved">
              Reservados ({giftStats.reserved})
            </TabsTrigger>
            <TabsTrigger value="bought">
              Comprados ({giftStats.bought})
            </TabsTrigger>
          </TabsList>

          {/* Mobile - Apenas "Todos" + Dropdown com os outros */}
          <div className="md:hidden flex items-center gap-2 w-full">
            <TabsList className="flex-1 grid grid-cols-1">
              <TabsTrigger value="all">Todos ({giftStats.total})</TabsTrigger>
            </TabsList>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setActiveFilter("available")}>
                  Disponíveis ({giftStats.available})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("reserved")}>
                  Reservados ({giftStats.reserved})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveFilter("bought")}>
                  Comprados ({giftStats.bought})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <TabsContent value={activeFilter} className="mt-6">
            {/* Card PIX Flexível - Sozinho na linha */}
            <div className="mb-6">
              <PixContributionCard tipo={tipo} index={0} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {(() => {
                const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PER_PAGE;
                const paginatedGifts = filteredGifts.slice(
                  startIndex,
                  endIndex
                );

                return paginatedGifts.map((gift, index) => {
                  const status = getGiftStatus(gift);

                  return (
                    <GiftCard
                      key={gift.id}
                      gift={gift}
                      status={status}
                      tipo={tipo}
                      index={startIndex + index + 1} // +1 por causa do card PIX
                      onUpdate={fetchGifts}
                    />
                  );
                });
              })()}
            </div>

            {/* Paginação */}
            {filteredGifts.length > ITEMS_PER_PAGE &&
              (() => {
                const totalPages = Math.ceil(
                  filteredGifts.length / ITEMS_PER_PAGE
                );

                return (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage(prev => Math.max(1, prev - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map(page => {
                          // Mostra primeira, última e páginas próximas à atual
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => setCurrentPage(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer">
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        })}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage(prev =>
                                Math.min(totalPages, prev + 1)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                );
              })()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface GiftCardProps {
  gift: Gift;
  status: "available" | "reserved" | "bought";
  tipo: "casamento" | "cha-panela";
  index: number;
  onUpdate: () => void;
}

const GiftCard = ({ gift, status, tipo, index, onUpdate }: GiftCardProps) => {
  const [showIdentificationDialog, setShowIdentificationDialog] =
    useState(false);
  const [showMarkPurchasedDialog, setShowMarkPurchasedDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [reservationData, setReservationData] = useState<{
    giftName: string;
    accessCode: string;
  } | null>(null);

  const { reserveGift, markAsBought, cancelReservation, timeRemaining } =
    useGiftReservation({
      giftId: gift.id,
      tipo,
      reservedUntil: gift.reserved_until,
      isBought: gift.is_bought,
      onReservationChange: onUpdate,
    });

  const handleReserveGift = async (name: string, phone: string) => {
    try {
      const result = await reserveGift(name, phone);
      if (result?.success && result.accessCode) {
        setReservationData({
          giftName: gift.nome,
          accessCode: result.accessCode,
        });
        setShowIdentificationDialog(false);
        setShowSuccessDialog(true);
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

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
      case "bought":
        return {
          badge: { label: "Comprado", variant: "secondary" as const },
          icon: GiftIcon,
          iconColor: "text-muted-foreground",
          cardClass: "opacity-60",
          showWarning: false,
        };
      case "reserved":
        return {
          badge: {
            label: `Reservado - ${timeRemaining}`,
            variant: "default" as const,
          },
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
        transition={{ delay: index * 0.1 }}>
        <Card
          className={`h-full flex flex-col hover:shadow-romantic transition-all duration-300 ${config.cardClass}`}>
          <CardHeader className="flex-shrink-0">
            {gift.imagem?.trim() && (
              <div className="mb-4 -mx-6 -mt-6 relative h-48">
                <OptimizedImage
                  src={gift.imagem}
                  alt={gift.nome}
                  fill
                  className="object-cover rounded-t-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={80}
                  fallback={<Skeleton className="w-full h-48 rounded-t-lg" />}
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-xl flex-1">{gift.nome}</CardTitle>
              <div className="flex items-center gap-2">
                <StatusIcon
                  className={`w-5 h-5 ${config.iconColor} ${
                    isExpiringSoon ? "animate-pulse" : ""
                  }`}
                />
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
            {status === "reserved" && gift.reserved_phone_display && (
              <div className="text-sm text-muted-foreground mt-2">
                Reservado por: {gift.reserved_phone_display}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col flex-grow">
            <div className="mt-auto space-y-3">
              {status === "available" && (
                <>
                  <Button
                    onClick={() => setShowIdentificationDialog(true)}
                    className="w-full"
                    variant="default">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Quero Presentear
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <a
                      href={gift.link_externo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2">
                      Ver Detalhes
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </>
              )}

              {status === "reserved" && (
                <>
                  <Button
                    onClick={() => setShowMarkPurchasedDialog(true)}
                    className="w-full"
                    variant="default">
                    <GiftIcon className="w-4 h-4 mr-2" />
                    Marcar como Comprado
                  </Button>
                  <Button asChild className="w-full" variant="outline">
                    <a
                      href={gift.link_externo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2">
                      Finalizar Compra
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    onClick={() => setShowCancelDialog(true)}
                    className="w-full"
                    variant="ghost"
                    size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar Reserva
                  </Button>
                </>
              )}

              {status === "bought" && (
                <Button asChild className="w-full" variant="secondary" disabled>
                  <div className="flex items-center justify-center gap-2">
                    <GiftIcon className="w-4 h-4" />
                    Já Comprado
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <IdentificationDialog
        open={showIdentificationDialog}
        onOpenChange={setShowIdentificationDialog}
        onConfirm={handleReserveGift}
        giftName={gift.nome}
      />

      {reservationData && (
        <SuccessGift
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          giftName={reservationData.giftName}
          accessCode={reservationData.accessCode}
        />
      )}

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
