"use client";

import { Badge } from "@/_components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_components/ui/card";
import { Progress } from "@/_components/ui/progress";
import { Heart, Plane } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
        const response = await fetch("/api/honeymoon/status");
        if (response.ok) {
          const data = await response.json();
          setProgress(data);
        }
      } catch (error) {
        console.error("[HoneymoonProgress] Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-8xl mx-auto shadow-romantic">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!progress?.isActive) {
    return null;
  }

  return (
    <Card className="w-full max-w-8xl mx-auto shadow-romantic overflow-hidden">
      <CardHeader className="px-6">
        <CardTitle className="playfair-custom text-2xl md:text-3xl flex items-center gap-2">
          <Plane className="w-6 h-6 text-primary" />
          Nossa Lua de Mel
        </CardTitle>
        <CardDescription className="playfair-custom font-bold text-base">
          Ajude-nos a realizar o sonho da nossa viagem!
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 px-6">
        {/* Card com Imagem e Incentivo */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Lado esquerdo - Imagem (2 colunas) */}
          <div className="mx-6 my-3 rounded-md md:col-span-2 relative bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 flex items-end justify-center p-6">
            <div className="text-center relative w-full">
              <Image
                src="/gifts/honeymoon.png"
                alt="Lua de Mel"
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
                  <h4 className="playfair-custom text-xl md:text-2xl font-bold text-foreground mb-2">
                    Realize esse sonho conosco!
                  </h4>
                  <Badge
                    variant="outline"
                    className="mb-3 bg-amber-600 text-zinc-50">
                    <Heart className="w-3 h-3 mr-1" />
                    Contribuição Especial
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Sua contribuição nos ajudará a criar memórias inesquecíveis na
                  nossa lua de mel. Cada valor é um pedacinho do nosso sonho se
                  tornando realidade!
                </p>
                <ul className="space-y-2 text-sm text-emerald-600">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Contribua com qualquer valor</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Pagamento 100% seguro</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5">✓</span>
                    <span>Faça parte dessa história especial</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold playfair-custom">
              Progresso: {progress.percentage}%
            </span>
            <span className="text-sm font-semibold playfair-custom">
              R$ {progress.currentAmount.toFixed(2)} de R${" "}
              {progress.targetAmount.toFixed(2)}
            </span>
          </div>

          <Progress value={progress.percentage} className="h-4" />
        </div>

        {/* Contador de Contribuições */}
        <div className="text-center text-sm text-muted-foreground">
          {progress.contributionsCount > 0 ? (
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              {progress.contributionsCount}{" "}
              {progress.contributionsCount === 1
                ? "contribuição"
                : "contribuições"}{" "}
              recebida{progress.contributionsCount > 1 ? "s" : ""}
            </p>
          ) : (
            <p className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Seja o primeiro a contribuir!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
