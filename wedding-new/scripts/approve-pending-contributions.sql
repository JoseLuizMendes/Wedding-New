-- Script para aprovar manualmente contribuições pendentes e atualizar a meta
-- Execute este script no Prisma Studio ou diretamente no banco de dados

-- 1. Verificar contribuições pendentes
SELECT id, "honeymoonId", amount, "transactionId", "paymentStatus", "mercadoPagoPreferenceId", "createdAt"
FROM contributions
WHERE "paymentStatus" = 'pending'
ORDER BY "createdAt" DESC;

-- 2. Atualizar contribuições pendentes para approved
-- ATENÇÃO: Só execute isso se você confirmou que o pagamento foi aprovado no Mercado Pago
UPDATE contributions
SET "paymentStatus" = 'approved',
    "transactionId" = REPLACE("transactionId", 'pending-', ''),
    "updatedAt" = NOW()
WHERE "paymentStatus" = 'pending';

-- 3. Recalcular currentAmount da meta baseado em contribuições aprovadas
UPDATE honeymoon_goals
SET "currentAmount" = (
    SELECT COALESCE(SUM(amount), 0)
    FROM contributions
    WHERE "honeymoonId" = honeymoon_goals.id
      AND "paymentStatus" = 'approved'
),
"updatedAt" = NOW()
WHERE "isActive" = true;

-- 4. Verificar resultado
SELECT hg.id, hg."targetAmount", hg."currentAmount", 
       COUNT(c.id) as total_contributions,
       SUM(c.amount) as total_amount
FROM honeymoon_goals hg
LEFT JOIN contributions c ON c."honeymoonId" = hg.id AND c."paymentStatus" = 'approved'
WHERE hg."isActive" = true
GROUP BY hg.id;
