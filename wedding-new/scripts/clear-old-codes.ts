import prisma from '../src/lib/prisma';

async function clearOldCodes() {
  try {
    console.log('🧹 Limpando todas as reservas para forçar novos códigos numéricos...');
    
    // Limpar TODAS as reservas (forçará geração de novos códigos numéricos)
    const [casamento, chaPanela] = await Promise.all([
      prisma.presentesCasamento.updateMany({
        where: {
          reservado: true,
        },
        data: {
          reservado: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          reserved_until: null,
          telefone_contato: null,
        },
      }),
      prisma.presentesChaPanela.updateMany({
        where: {
          reservado: true,
        },
        data: {
          reservado: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          reserved_until: null,
          telefone_contato: null,
        },
      }),
    ]);
    
    console.log(`✅ Casamento: ${casamento.count} reservas limpas`);
    console.log(`✅ Chá de Panela: ${chaPanela.count} reservas limpas`);
    console.log('✨ Agora todas as novas reservas terão códigos numéricos!');
  } catch (error) {
    console.error('❌ Erro ao limpar códigos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearOldCodes();
