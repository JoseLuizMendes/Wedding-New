'use client';

import { useState } from 'react';
import { useMercadoPago } from '@/hooks/useMercadoPago';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_components/ui/card';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { BadgeDollarSign, Lock } from 'lucide-react';

interface ContributionOption {
  id: string;
  amount: number;
  label: string;
}

const CONTRIBUTION_OPTIONS: ContributionOption[] = [
  { id: 'cota_40', amount: 40, label: 'R$ 40' },
  { id: 'cota_50', amount: 50, label: 'R$ 50' },
  { id: 'cota_80', amount: 80, label: 'R$ 80' },
  { id: 'cota_100', amount: 100, label: 'R$ 100' },
  { id: 'cota_150', amount: 150, label: 'R$ 150' },
  { id: 'cota_200', amount: 200, label: 'R$ 200' },
];

/**
 * HoneymoonContribution Component
 * Displays contribution options for the honeymoon goal
 */
export function HoneymoonContribution() {
  const { createMercadoPagoCheckout } = useMercadoPago();
  const [loading, setLoading] = useState(false);
  const [contributorName, setContributorName] = useState('');

  const handleContribute = async (option: ContributionOption) => {
    try {
      setLoading(true);

      await createMercadoPagoCheckout({
        amount: option.amount,
        title: `Contribuição Lua de Mel - ${option.label}`,
        gift_id: option.id,
        contributor_name: contributorName || undefined,
      });
    } catch (error) {
      console.error('[HoneymoonContribution] Error:', error);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-8xl mx-auto shadow-romantic">
      <CardHeader>
        <CardTitle className="playfair-custom text-2xl md:text-3xl">
          Contribua para Nossa Lua de Mel
        </CardTitle>
        <CardDescription className="playfair-custom font-bold text-base">
          Escolha um valor e nos ajude a realizar o sonho da nossa viagem!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contributor Name Input */}
        <div className="space-y-2">
          <Label htmlFor="contributor-name">
            Seu nome (opcional)
          </Label>
          <Input
            id="contributor-name"
            type="text"
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            placeholder="Digite seu nome"
            disabled={loading}
          />
        </div>

        {/* Contribution Options Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CONTRIBUTION_OPTIONS.map((option) => (
            <Button
              key={option.id}
              onClick={() => handleContribute(option)}
              disabled={loading}
              variant="secondary"
              className="group relative h-auto p-6 backdrop-blur-lg"
            >
              <div className="text-center align-middle">
                <div className="text-3xl font-bold text-nowrap mb-2 playfair-custom transition-all duration-300 group-hover:mb-1">
                  {option.label}
                </div>
                <div className="text-sm text-muted-foreground font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform translate-y-1 group-hover:translate-y-0">
                  <BadgeDollarSign className="w-4 h-4" />
                  Contribuir
                </div>
              </div>
            </Button>
          ))}
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">
            <p>Redirecionando para pagamento...</p>
          </div>
        )}

        <div className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Lock className="w-4 h-4" />
          <p>Pagamento seguro via Mercado Pago</p>
        </div>
      </CardContent>
    </Card>
  );
}
