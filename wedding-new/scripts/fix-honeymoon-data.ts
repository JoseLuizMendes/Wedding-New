import { config } from 'dotenv';
import { resolve } from 'path';

// Carregar variáveis de ambiente
config({ path: resolve(__dirname, '../.env') });

import prisma from '../src/lib/prisma';

async function fixHoneymoonData() {
  console.log('🔧 Iniciando correção de dados...');

  try {
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
  } catch (error) {
    console.error('❌ Erro durante a correção:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixHoneymoonData()
  .catch(console.error)
  .finally(() => process.exit());
