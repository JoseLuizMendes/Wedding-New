import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma/client';
import ws from 'ws';
import "dotenv/config";

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  console.error('❌ DATABASE_URL não está definida no .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Iniciando seed do banco de dados...');
  console.log(`📡 Conectando ao banco: ${connectionString.split('@')[1]?.split('/')[0] || 'Neon'}`);
  
  // Limpar dados existentes
  console.log('🧹 Limpando dados existentes...');
  await prisma.presentesCasamento.deleteMany();
  await prisma.presentesChaPanela.deleteMany();
  
  // Presentes de Casamento
  console.log('🎁 Inserindo presentes de casamento...');
  await prisma.presentesCasamento.createMany({
    data: [
      {
        nome: 'Jogo de Panelas Tramontina',
        descricao: 'Conjunto de panelas antiaderentes 5 peças',
        link_externo: 'https://www.amazon.com.br',
        ordem: 1,
        imagem: '',
      },
      {
        nome: 'Jogo de Toalhas Buddemeyer',
        descricao: 'Kit com 5 toalhas de banho e rosto',
        link_externo: 'https://www.magazineluiza.com.br',
        ordem: 2,
        imagem: '',
      },
      {
        nome: 'Edredom Casal Queen',
        descricao: 'Edredom 100% algodão estampado',
        link_externo: 'https://www.shopee.com.br',
        ordem: 3,
        imagem: '',
      },
      {
        nome: 'Liquidificador Philips Walita',
        descricao: 'Liquidificador 800W com 5 velocidades',
        link_externo: 'https://www.amazon.com.br',
        ordem: 4,
        imagem: '',
      },
      {
        nome: 'Air Fryer Mondial',
        descricao: 'Fritadeira elétrica 4L digital',
        link_externo: 'https://www.magazineluiza.com.br',
        ordem: 5,
        imagem: '',
      },
      {
        nome: 'Jogo de Cama Queen',
        descricao: 'Lençol 400 fios 100% algodão',
        link_externo: 'https://www.amazon.com.br',
        ordem: 6,
        imagem: '',
      },
    ],
    skipDuplicates: true,
  });
  
  // Presentes de Chá de Panela
  console.log('🍳 Inserindo presentes de chá de panela...');
  await prisma.presentesChaPanela.createMany({
    data: [
      {
        nome: 'Mixer Philco',
        descricao: 'Mixer 3 em 1 com copo medidor',
        link_externo: 'https://www.magazineluiza.com.br',
        ordem: 1,
        imagem: '',
      },
      {
        nome: 'Jogo de Facas Tramontina',
        descricao: 'Conjunto de facas 6 peças com suporte',
        link_externo: 'https://www.shopee.com.br',
        ordem: 2,
        imagem: '',
      },
      {
        nome: 'Tábua de Vidro',
        descricao: 'Tábua de corte em vidro temperado',
        link_externo: 'https://www.amazon.com.br',
        ordem: 3,
        imagem: '',
      },
      {
        nome: 'Forma de Bolo',
        descricao: 'Forma redonda com fundo removível',
        link_externo: 'https://www.magazineluiza.com.br',
        ordem: 4,
        imagem: '',
      },
      {
        nome: 'Conjunto de Potes Herméticos',
        descricao: 'Kit 10 potes para armazenamento',
        link_externo: 'https://www.amazon.com.br',
        ordem: 5,
        imagem: '',
      },
      {
        nome: 'Escorredor de Louças',
        descricao: 'Escorredor inox com bandeja',
        link_externo: 'https://www.shopee.com.br',
        ordem: 6,
        imagem: '',
      },
    ],
    skipDuplicates: true,
  });

  const countCasamento = await prisma.presentesCasamento.count();
  const countChaPanela = await prisma.presentesChaPanela.count();
  
  console.log('');
  console.log('✅ Seed concluído com sucesso!');
  console.log(`   📦 Presentes Casamento: ${countCasamento}`);
  console.log(`   🍳 Presentes Chá de Panela: ${countChaPanela}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    try {
      await pool.end();
    } catch (error) {
      console.error('⚠️  Erro ao fechar pool de conexões:', error);
    }
  });