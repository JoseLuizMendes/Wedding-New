import prisma from "@/lib/prisma";
import "dotenv/config";

async function main() {
  // Presentes de Casamento
  await prisma.presentesCasamento.createMany({
    data: [
      {
        nome: 'Jogo de Panelas Tramontina',
        descricao: 'Conjunto de panelas antiaderentes 5 peças',
        link_externo: 'https://www.amazon.com.br',
        ordem: 1,
        imagem: '', // imagem vazia
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
    ],
    skipDuplicates: true,
  });

  // Presentes de Chá de Panela
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
    ],
    skipDuplicates: true,
  });

  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });