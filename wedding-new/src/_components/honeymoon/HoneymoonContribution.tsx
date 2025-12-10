'use client';

import { useState } from 'react';
import { useMercadoPago } from '@/hooks/useMercadoPago';

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
      alert('Erro ao criar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          💝 Contribua para Nossa Lua de Mel
        </h3>
        <p className="text-gray-600">
          Escolha um valor e nos ajude a realizar o sonho da nossa viagem!
        </p>
      </div>

      {/* Contributor Name Input */}
      <div className="mb-6">
        <label
          htmlFor="contributor-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Seu nome (opcional)
        </label>
        <input
          id="contributor-name"
          type="text"
          value={contributorName}
          onChange={(e) => setContributorName(e.target.value)}
          placeholder="Digite seu nome"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      {/* Contribution Options Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CONTRIBUTION_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleContribute(option)}
            disabled={loading}
            className="relative p-6 bg-gradient-to-br from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {option.label}
              </div>
              <div className="text-sm text-gray-600">Contribuir</div>
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-600">
          <p>Redirecionando para pagamento...</p>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Pagamento seguro via Mercado Pago 🔒</p>
      </div>
    </div>
  );
}
