'use client';

import { useEffect, useState } from 'react';

interface HoneymoonProgressData {
  targetAmount: number;
  currentAmount: number;
  percentage: number;
  isActive: boolean;
  contributionsCount: number;
}

/**
 * HoneymoonProgress Component
 * Displays the progress of the honeymoon goal
 */
export function HoneymoonProgress() {
  const [progress, setProgress] = useState<HoneymoonProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await fetch('/api/honeymoon/status');
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error('[HoneymoonProgress] Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!progress?.isActive) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg shadow-lg">
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          🌙 Nossa Lua de Mel
        </h3>
        <p className="text-gray-600">
          Ajude-nos a realizar o sonho da nossa viagem!
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso: {progress.percentage}%
          </span>
          <span className="text-sm font-medium text-gray-700">
            R$ {progress.currentAmount.toFixed(2)} de R${' '}
            {progress.targetAmount.toFixed(2)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        {progress.contributionsCount > 0 ? (
          <p>
            ❤️ {progress.contributionsCount}{' '}
            {progress.contributionsCount === 1 ? 'contribuição' : 'contribuições'}{' '}
            recebida{progress.contributionsCount > 1 ? 's' : ''}
          </p>
        ) : (
          <p>Seja o primeiro a contribuir! 💝</p>
        )}
      </div>
    </div>
  );
}
