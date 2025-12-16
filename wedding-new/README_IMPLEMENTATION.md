# Correção do Sistema de Pagamento e Barra de Progresso

Este documento descreve o plano de implementação para corrigir os problemas identificados no sistema de contribuições e barra de progresso da lua de mel.

---

## 📋 Problemas Identificados

### 1. Inconsistência de Dados
A barra mostra R$100/2500, mas não há contribuições registradas no banco.

**Causa provável**: O campo `currentAmount` na tabela `honeymoon_goals` foi atualizado manualmente ou há dados órfãos.

### 2. Fluxo de Pagamento Incompleto
O sistema atual só registra contribuições quando o webhook retorna sucesso.

**Problema**: Se o webhook falhar ou o pagamento não for concluído, não há rastreamento do que aconteceu.

### 3. Falta de Página de Retorno
Após o pagamento, o usuário não tem uma página de confirmação com botão de voltar e timer automático.

---

## ⚠️ Pontos de Atenção

> **IMPORTANTE**: É necessário limpar os dados inconsistentes do banco antes de implementar as correções. Isso envolve:
> - Resetar `currentAmount` para 0 se não houver contribuições aprovadas
> - Ou manter o valor se houver contribuições que não foram registradas

> **AVISO**: O webhook do Mercado Pago deve estar acessível publicamente para funcionar. Em localhost, os webhooks não funcionam. Para testar localmente, será necessário usar ngrok ou similar.

---

## 🔧 Mudanças Propostas

### 1. Banco de Dados - Schema e Dados

**Arquivo**: `prisma/schema.prisma`

Adicionar campo `mercadoPagoPreferenceId` para rastrear pagamentos pendentes:

```diff
model Contribution {
  id                      String        @id @default(uuid())
  honeymoonId             Int
  honeymoon               HoneymoonGoal @relation(fields: [honeymoonId], references: [id])
  amount                  Decimal       @db.Decimal(10, 2)
  contributorName         String?
  transactionId           String        @unique
  paymentStatus           String        @default("pending")
+ mercadoPagoPreferenceId String?       @unique
  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt

  @@map("contributions")
}
```

---

### 2. API - Criar Contribuição Pendente

**Arquivo**: `src/app/api/mercadopago/preference/route.ts`

Modificar para criar uma contribuição com status `pending` antes de redirecionar para o pagamento:

```typescript
// Após criar a preference do Mercado Pago, criar contribuição pendente
if (isHoneymoon) {
  const honeymoonRepository = new HoneymoonRepository(prisma);
  await honeymoonRepository.createPendingContribution({
    amount: parseFloat(amount),
    contributorName: contributor_name || null,
    mercadoPagoPreferenceId: preference.id,
  });
}
```

---

### 3. Repository - Métodos para Contribuição Pendente

**Arquivo**: `src/repositories/honeymoon/HoneymoonRepository.ts`

Adicionar os seguintes métodos:

```typescript
// Criar contribuição pendente
async createPendingContribution(data: {
  amount: number;
  contributorName?: string | null;
  mercadoPagoPreferenceId: string;
}): Promise<Contribution>

// Atualizar status para aprovado
async approveContribution(
  mercadoPagoPreferenceId: string,
  transactionId: string
): Promise<void>

// Deletar contribuição pendente (pagamento falhou/expirou)
async deletePendingContribution(mercadoPagoPreferenceId: string): Promise<void>

// Buscar por preference ID
async getContributionByPreferenceId(
  mercadoPagoPreferenceId: string
): Promise<Contribution | null>
```

---

### 4. Webhook - Confirmar ou Rejeitar Pagamento

**Arquivo**: `src/app/api/webhooks/mercadopago/route.ts`

Modificar `handleMercadoPagoPayment` para:

1. **Pagamento Aprovado**: Atualizar status para `approved` e incrementar `currentAmount`
2. **Pagamento Rejeitado/Cancelado**: Deletar a contribuição pendente

```typescript
// Para pagamentos aprovados
if (payment.status === 'approved') {
  await honeymoonRepository.approveContribution(
    payment.preference_id,
    transactionId
  );
}

// Para pagamentos rejeitados/cancelados
if (['rejected', 'cancelled', 'refunded'].includes(payment.status)) {
  await honeymoonRepository.deletePendingContribution(payment.preference_id);
}
```

---

### 5. Service - Calcular Progresso com Contribuições Aprovadas

**Arquivo**: `src/services/honeymoon/HoneymoonService.ts`

Modificar `calculateProgress` para somar apenas contribuições com `paymentStatus = 'approved'`:

```typescript
// Filtrar apenas contribuições aprovadas
const approvedContributions = contributions.filter(
  (c) => c.honeymoonId === activeGoal.id && c.paymentStatus === 'approved'
);

// Calcular soma das contribuições aprovadas
const currentAmount = approvedContributions.reduce(
  (sum, c) => sum + Number(c.amount),
  0
);
```

---

### 6. Nova Página de Resultado do Pagamento

**Arquivo**: `src/app/pagamento/resultado/page.tsx` (NOVO)

Criar página para exibir resultado do pagamento com:
- Status do pagamento (sucesso, falha, pendente)
- Botão "Voltar para o site"
- Timer de redirecionamento automático (5 segundos)

```tsx
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
```

---

### 7. Atualizar URLs de Retorno

**Arquivo**: `src/app/api/mercadopago/preference/route.ts`

Atualizar `back_urls` para redirecionar para a nova página:

```diff
  preferenceBody.back_urls = {
-   success: `${baseUrl}/casamento?payment=success`,
-   failure: `${baseUrl}/casamento?payment=failure`,
-   pending: `${baseUrl}/casamento?payment=pending`,
+   success: `${baseUrl}/pagamento/resultado?status=success`,
+   failure: `${baseUrl}/pagamento/resultado?status=failure`,
+   pending: `${baseUrl}/pagamento/resultado?status=pending`,
  };
```

---

### 8. Script de Correção de Dados

**Arquivo**: `scripts/fix-honeymoon-data.ts` (NOVO)

Script para corrigir inconsistências no banco:

```typescript
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

async function fixHoneymoonData() {
  console.log('🔧 Iniciando correção de dados...');

  // 1. Buscar meta ativa
  const activeGoal = await prisma.honeymoonGoal.findFirst({
    where: { isActive: true },
  });

  if (!activeGoal) {
    console.log('❌ Nenhuma meta ativa encontrada');
    return;
  }

  console.log(`📊 Meta ativa: ID ${activeGoal.id}, currentAmount: ${activeGoal.currentAmount}`);

  // 2. Buscar contribuições aprovadas
  const approvedContributions = await prisma.contribution.findMany({
    where: {
      honeymoonId: activeGoal.id,
      paymentStatus: 'approved',
    },
  });

  console.log(`✅ Contribuições aprovadas: ${approvedContributions.length}`);

  // 3. Calcular soma real
  const realSum = approvedContributions.reduce(
    (sum, c) => sum + Number(c.amount),
    0
  );

  console.log(`💰 Soma real das contribuições: R$ ${realSum.toFixed(2)}`);

  // 4. Atualizar currentAmount se diferente
  if (Number(activeGoal.currentAmount) !== realSum) {
    await prisma.honeymoonGoal.update({
      where: { id: activeGoal.id },
      data: { currentAmount: realSum },
    });

    console.log(`🔄 currentAmount atualizado de ${activeGoal.currentAmount} para ${realSum}`);
  } else {
    console.log('✅ currentAmount já está correto');
  }

  // 5. Deletar contribuições pendentes antigas (> 24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const deleted = await prisma.contribution.deleteMany({
    where: {
      paymentStatus: 'pending',
      createdAt: { lt: oneDayAgo },
    },
  });

  console.log(`🗑️ Contribuições pendentes antigas deletadas: ${deleted.count}`);

  console.log('✅ Correção concluída!');
}

fixHoneymoonData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## 🧪 Verificação

### Comandos de Execução

```bash
# 1. Executar migration
npx prisma migrate dev --name add_preference_id_to_contributions

# 2. Gerar cliente Prisma
npx prisma generate

# 3. Executar script de correção
npx tsx scripts/fix-honeymoon-data.ts

# 4. Verificar dados no Prisma Studio
npx prisma studio
```

### Testes Manuais

1. **Testar Fluxo Completo**:
   - Clicar em contribuir
   - Verificar se contribuição pendente foi criada no banco
   - Completar pagamento no Mercado Pago
   - Verificar se status mudou para `approved`
   - Verificar se barra de progresso atualizou

2. **Testar Pagamento Cancelado**:
   - Iniciar pagamento
   - Cancelar no Mercado Pago
   - Verificar se contribuição pendente foi deletada

3. **Testar Página de Resultado**:
   - Verificar se redirecionamento automático funciona
   - Verificar se botão de voltar funciona

---

## 📊 Diagrama do Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUXO DE PAGAMENTO                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Usuário clica em "Contribuir R$50"                                      │
│                    │                                                         │
│                    ▼                                                         │
│  2. Frontend → POST /api/mercadopago/preference                             │
│                    │                                                         │
│                    ▼                                                         │
│  3. API cria Contribution (status: PENDING) no banco                        │
│                    │                                                         │
│                    ▼                                                         │
│  4. API cria Preference no Mercado Pago                                     │
│                    │                                                         │
│                    ▼                                                         │
│  5. Usuário é redirecionado para checkout do Mercado Pago                   │
│                    │                                                         │
│                    ├──── Pagamento APROVADO ────┐                           │
│                    │                             │                           │
│                    │                             ▼                           │
│                    │         6a. Webhook atualiza status → APPROVED          │
│                    │         6b. Incrementa currentAmount                    │
│                    │         6c. Redireciona para /pagamento/resultado       │
│                    │                             │                           │
│                    │                             ▼                           │
│                    │         7. Página mostra sucesso + timer 5s            │
│                    │                                                         │
│                    ├──── Pagamento REJEITADO ───┐                           │
│                    │                             │                           │
│                    │                             ▼                           │
│                    │         6a. Webhook deleta contribuição pendente       │
│                    │         6b. Redireciona para /pagamento/resultado       │
│                    │                             │                           │
│                    │                             ▼                           │
│                    │         7. Página mostra erro + timer 5s               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Arquivos Afetados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `prisma/schema.prisma` | MODIFICAR | Adicionar campo `mercadoPagoPreferenceId` |
| `src/app/api/mercadopago/preference/route.ts` | MODIFICAR | Criar contribuição pendente + atualizar URLs |
| `src/repositories/honeymoon/HoneymoonRepository.ts` | MODIFICAR | Adicionar métodos de contribuição pendente |
| `src/repositories/honeymoon/IHoneymoonRepository.ts` | MODIFICAR | Adicionar interfaces dos novos métodos |
| `src/services/honeymoon/HoneymoonService.ts` | MODIFICAR | Filtrar apenas contribuições aprovadas |
| `src/app/api/webhooks/mercadopago/route.ts` | MODIFICAR | Processar approve/reject |
| `src/app/pagamento/resultado/page.tsx` | CRIAR | Página de resultado do pagamento |
| `scripts/fix-honeymoon-data.ts` | CRIAR | Script de correção de dados |

---

## ❓ Perguntas Pendentes

1. **O valor de R$100 atualmente no `currentAmount` deve ser mantido ou zerado?**
   - Se houve uma contribuição real que não foi registrada, devemos manter
   - Se não houve, devemos zerar

2. **Você tem acesso ao ambiente de produção com URL pública para testar webhooks?**
   - Localhost não recebe webhooks do Mercado Pago
   - Para testar localmente, será necessário usar ngrok ou similar
