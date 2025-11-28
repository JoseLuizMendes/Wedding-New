// components/GlobalProviders.tsx
'use client'; // CRÍTICO: Transforma este arquivo em um Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// Assumindo que você instalará os componentes Shadcn Sonner, Toaster e Tooltip
import { Toaster as Sonner } from "@/_components/ui/sonner";
import { Toaster } from "@/_components/ui/toaster";
import { TooltipProvider } from "@/_components/ui/tooltip";


// A QueryClient deve ser instanciada aqui para ser compartilhada.
const queryClient = new QueryClient();

interface GlobalProvidersProps {
    children: React.ReactNode;
}

/**
 * Agrupa todos os Context Providers de terceiros que dependem de
 * Hooks de React e do ambiente do navegador.
 */
export function GlobalProviders({ children }: GlobalProvidersProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                {children}
            </TooltipProvider>
            
            {/* Componentes de notificação no final do corpo do HTML */}
            <Toaster />
            <Sonner />
        </QueryClientProvider>
    );
}