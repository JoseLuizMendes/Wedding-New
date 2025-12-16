'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/_components/ui/dialog';
import { Gift, BadgeDollarSign } from 'lucide-react';
import { useMercadoPago } from '@/hooks/useMercadoPago';
import { motion } from 'framer-motion';
import { Badge } from '@/_components/ui/badge';
import Image from 'next/image';

interface PixContributionCardProps {
  tipo: 'casamento' | 'cha-panela';
  index?: number;
}

export const PixContributionCard = ({ tipo, index = 0 }: PixContributionCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { createMercadoPagoCheckout } = useMercadoPago();

  // Reset loading and close dialog when user returns to the page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLoading(false);
        setShowDialog(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleContribute = async () => {
    const value = parseFloat(amount.replace(',', '.'));
    
    if (!value || value <= 0) {
      alert('Por favor, digite um valor válido');
      return;
    }

    try {
      setLoading(true);
      
      await createMercadoPagoCheckout({
        amount: value,
        title: `Contribuição PIX - ${tipo === 'casamento' ? 'Casamento' : 'Chá de Panela'}`,
        gift_id: `pix_${tipo}_${Date.now()}`,
      });
    } catch (error) {
      console.error('[PixContributionCard] Error:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = (Number(numbers) / 100).toFixed(2);
    return formatted.replace('.', ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Card className="overflow-hidden hover:shadow-romantic transition-all duration-300 border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Lado esquerdo - Imagem (2 colunas) */}
            <div className="mx-6 my-3 rounded-md md:col-span-2 relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-end justify-center p-6">
              <div className="text-center relative w-full">
                <Image
                  src="/gifts/pix-image.png"
                  alt="Contribuição PIX"
                  width={256}
                  height={256}
                  className="mx-auto"
                  priority
                />
              </div>
            </div>

            {/* Lado direito - Conteúdo (3 colunas) */}
            <div className="md:col-span-3 px-6 pb-2 md:py-2 md:pr-6 md:pl-0 flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="playfair-custom text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Contribuição PIX
                    </h3>
                    <Badge className="mb-3 bg-amber-600">
                      <BadgeDollarSign className="w-3 h-3 mr-1" />
                      Valor Flexível
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-base playfair-custom font-bold leading-relaxed">
                    Nos ajude a realizar nossos sonhos!
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Sua contribuição é especial para nós. Escolha o valor que desejar 
                    e nos ajude a construir momentos inesquecíveis juntos.
                  </p>
                  <ul className="space-y-2 text-sm text-emerald-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">✓</span>
                      <span>Pagamento instantâneo via PIX</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">✓</span>
                      <span>100% seguro pelo Mercado Pago</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5">✓</span>
                      <span>Você escolhe quanto quer contribuir</span>
                    </li>
                  </ul>
                </div>

                <Button 
                    onClick={() => setShowDialog(true)}
                    className="h-12 text-base"
                    variant="default"
                  >
                    <BadgeDollarSign className="w-5 h-5 mr-2" />
                    Contribuir Agora
                  </Button>

              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Contribuição PIX
            </DialogTitle>
            <DialogDescription>
              Digite o valor que deseja contribuir para nosso {tipo === 'casamento' ? 'casamento' : 'chá de panela'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor da Contribuição</Label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="0,00"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-10 text-lg"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount('50,00')}
                disabled={loading}
              >
                R$ 50
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount('100,00')}
                disabled={loading}
              >
                R$ 100
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount('150,00')}
                disabled={loading}
              >
                R$ 150
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount('200,00')}
                disabled={loading}
              >
                R$ 200
              </Button>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleContribute}
              className="w-full sm:w-auto"
              disabled={loading || !amount || amount === '0,00'}
            >
              {loading ? 'Processando...' : 'Continuar para Pagamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
