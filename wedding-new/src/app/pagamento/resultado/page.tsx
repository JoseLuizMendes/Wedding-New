'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/_components/ui/button';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get('status') || 'pending';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push('/casamento');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const statusConfig = {
    success: {
      icon: CheckCircle,
      title: 'Pagamento Confirmado!',
      message: 'Sua contribuição foi recebida com sucesso. Muito obrigado!',
      color: 'text-green-500',
    },
    failure: {
      icon: XCircle,
      title: 'Pagamento não realizado',
      message: 'Houve um problema com o pagamento. Tente novamente.',
      color: 'text-red-500',
    },
    pending: {
      icon: Clock,
      title: 'Pagamento Pendente',
      message: 'Aguardando confirmação do pagamento...',
      color: 'text-yellow-500',
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <Icon className={`w-20 h-20 mx-auto mb-6 ${config.color}`} />
        <h1 className="text-3xl font-bold mb-4">{config.title}</h1>
        <p className="text-muted-foreground mb-8">{config.message}</p>
        
        <Button onClick={() => router.push('/casamento')} className="mb-4">
          Voltar para o site
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Redirecionando automaticamente em {countdown} segundos...
        </p>
      </div>
    </div>
  );
}
