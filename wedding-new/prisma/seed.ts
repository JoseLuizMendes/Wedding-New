import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../src/generated/prisma';
import ws from 'ws';
import 'dotenv/config';

// Configure WebSocket for Node.js environment
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL não está definida no .env');
    process.exit(1);
}

console.log('📡 Conectando ao banco Neon...');

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Iniciando seed do banco de dados...');

    // Limpar dados existentes
    console.log('🧹 Limpando dados existentes...');
    await prisma.presentesCasamento.deleteMany();
    await prisma.presentesChaPanela.deleteMany();
    await prisma.contribution.deleteMany();
    await prisma.honeymoonGoal.deleteMany();

    // Criar HoneymoonGoal inicial
    console.log('🌙 Criando meta de Lua de Mel...');
    await prisma.honeymoonGoal.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            targetAmount: 2500.00,
            currentAmount: 0.00,
            isActive: true,
        },
    });

    // Presentes de Casamento - 6 cotas Pix + 24 presentes físicos
    console.log('🎁 Inserindo presentes de casamento...');
    await prisma.presentesCasamento.createMany({
        data: [
            // 6 Cotas Pix (Ordem 1 a 6)
            {
                nome: 'Contribuição Pix - R$ 40',
                descricao: 'Contribua com R$ 40,00 para nossa lua de mel via Pix',
                link_externo: 'https://wedding.example.com/pix/40',
                ordem: 1,
                imagem: '',
            },
            {
                nome: 'Contribuição Pix - R$ 50',
                descricao: 'Contribua com R$ 50,00 para nossa lua de mel via Pix',
                link_externo: 'https://wedding.example.com/pix/50',
                ordem: 2,
                imagem: '',
            },
            {
                nome: 'Contribuição Pix - R$ 80',
                descricao: 'Contribua com R$ 80,00 para nossa lua de mel via Pix',
                link_externo: 'https://wedding.example.com/pix/80',
                ordem: 3,
                imagem: '',
            },
            {
                nome: 'Contribuição Pix - R$ 100',
                descricao: 'Contribua com R$ 100,00 para nossa lua de mel via Pix',
                link_externo: 'https://wedding.example.com/pix/100',
                ordem: 4,
                imagem: '',
            },
            {
                nome: 'Contribuição Pix - R$ 150',
                descricao: 'Contribua com R$ 150,00 para nossa lua de mel via Pix',
                link_externo: 'https://wedding.example.com/pix/150',
                ordem: 5,
                imagem: '',
            },
            {
                nome: 'Contribuição Pix - R$ 200',
                descricao: 'Contribua com R$ 200,00 para nossa lua de mel via Pix',
                link_externo: 'https://wedding.example.com/pix/200',
                ordem: 6,
                imagem: '',
            },
            // 24 Presentes Físicos (Ordem 7 a 30)
            {
                nome: 'Fritadeira Airfryer Philips Walita Grande Capacidade',
                descricao: 'Fritadeira elétrica sem óleo, para preparo saudável e rápido de alimentos. Essencial na cozinha moderna.',
                link_externo: 'https://www.amazon.com.br/Fritadeira-Airfryer-Philips-Walita-capacidade/dp/B0CQRZDG2Y',
                ordem: 7,
                imagem: '',
            },
            {
                nome: 'Micro-ondas Panasonic Tecnologia Pega Fácil 21L',
                descricao: 'Micro-ondas de 21L, com revestimento antiaderente, tecnologia Antibacteria Ag e porta espelhada.',
                link_externo: 'https://loja.panasonic.com.br/microondas-panasonic-st27l-branco-espelhado/p',
                ordem: 8,
                imagem: '',
            },
            {
                nome: 'Aspirador Pó e Água Electrolux Smart (A10N1)',
                descricao: 'Aspirador potente e versátil para sólidos e líquidos, 1400W e 18L de capacidade.',
                link_externo: 'https://loja.electrolux.com.br/aspirador-agua-e-po-smart--a10n1-/p',
                ordem: 9,
                imagem: '',
            },
            {
                nome: 'Jogo de Panelas Brinox Ceramic Life 5 Peças Organika',
                descricao: 'Conjunto com 5 peças, revestimento Pro Ceramic Premium, antiaderente Mineral Resist, compatível com fogões de indução.',
                link_externo: 'https://www.brinox.com.br/jogo-de-panelas-brinox-antiaderente-ceramic-life-5-pecas-organika-com-inducao-nata_4816100/p',
                ordem: 10,
                imagem: '',
            },
            {
                nome: 'Ferro de Passar Black+Decker',
                descricao: 'Ferro a vapor com base antiaderente, controle de temperatura e funções para facilitar a tarefa de passar roupas.',
                link_externo: 'https://www.amazon.com.br/Ferro-Met%C3%A1lico-Black-Decker-Preto/dp/B076151Z3M',
                ordem: 11,
                imagem: '',
            },
            {
                nome: 'Batedeira Mondial Prática Black B-44',
                descricao: 'Batedeira de 400W com 3 velocidades, função pulsar e tigela de plástico com 3,6L.',
                link_externo: 'https://www.casasbahia.com.br/batedeira-mondial-pratica-black-b-44-com-3-velocidades-preta/p/55005425',
                ordem: 12,
                imagem: '',
            },
            {
                nome: 'Liquidificador Philips Walita Série 5000 Turbo',
                descricao: 'Liquidificador de alta potência (1200W+) com tecnologia ProBlend. Ideal para massas pesadas e vitaminas cremosas.',
                link_externo: 'https://www.amazon.com.br/Philips-Walita-Liquidificador-S%C3%A9rie-Turbo/dp/B0CX1TKC62',
                ordem: 13,
                imagem: '',
            },
            {
                nome: 'Projetor Portátil com Bluetooth e Android',
                descricao: 'Projetor smart compacto com conectividade Bluetooth e sistema Android. Ideal para noites de filme.',
                link_externo: 'https://www.amazon.com.br/Projetor-Portatil-Bluetooth-Android-polegadas/dp/B0CVNDKJ5X',
                ordem: 14,
                imagem: '',
            },
            {
                nome: 'Mixer Daily Philips Walita RI2622/70',
                descricao: 'Mixer de mão potente e ergonômico, perfeito para preparar sopas, molhos e vitaminas rapidamente.',
                link_externo: 'https://www.amazon.com.br/Mixer-Daily-Philips-RI2622-70/dp/B0874G5TTM',
                ordem: 15,
                imagem: '',
            },
            {
                nome: 'Sanduicheira e Grill Cadence Click',
                descricao: 'Sanduicheira e grill elétrico antiaderente, ideal para sanduíches e grelhados rápidos.',
                link_externo: 'https://www.amazon.com.br/Sanduicheira-El%C3%A9trica-Cadence-Click-220V/dp/B0CDJ5DQ7M',
                ordem: 16,
                imagem: '',
            },
            {
                nome: 'Secador De Cabelo De Íons Negativos 1500w',
                descricao: 'Secador profissional de alta velocidade com tecnologia de íons negativos para brilho e redução de frizz.',
                link_externo: 'https://www.mercadolivre.com.br/secador-de-cabelo-de-ions-negativos-de-alta-velocidade1500w-cor-rosa/p/MLB58571010',
                ordem: 17,
                imagem: '',
            },
            {
                nome: 'Aparador de Pelos Philco Bivolt',
                descricao: 'Aparador e barbeador elétrico sem fio, com diferentes pentes para ajuste de corte.',
                link_externo: 'https://www.amazon.com.br/Aparador-Pelos-Bivolt-Philco-56303013/dp/B07V2PBWGK',
                ordem: 18,
                imagem: '',
            },
            {
                nome: 'Jogo de Taças para Vinho Branco (Cristal Ecológico)',
                descricao: 'Jogo de 6 taças em cristal ecológico, com design elegante, ideal para degustação de vinho branco.',
                link_externo: 'https://www.amazon.com.br/tacas-vinho-branco-cristal-ecologico/dp/B0B5LL9MXB',
                ordem: 19,
                imagem: '',
            },
            {
                nome: 'Jogo de Toalhas Buddemeyer Doris Banho - Cinza',
                descricao: 'Kit de toalhas de banho e rosto Buddemeyer 100% algodão, de alta absorção, na cor Cinza.',
                link_externo: 'https://www.amazon.com.br/toalhas-Buddemeyer-Doris-Banho-Cinza/dp/B0CV641SQ8',
                ordem: 20,
                imagem: '',
            },
            {
                nome: 'Toalha de Banho Gigante Buddemeyer Amarela',
                descricao: 'Toalha de banho extra grande e macia, 100% algodão, de altíssima absorção, cor Amarela.',
                link_externo: 'https://www.amazon.com.br/Gigante-Buddemeyer-Amare-Algod%C3%A3o-Absor%C3%A7%C3%A3o/dp/B0FMS6RMMS',
                ordem: 21,
                imagem: '',
            },
            {
                nome: 'Jogo de Toalhas Buddemeyer Doris Banho - Coral',
                descricao: 'Kit de toalhas de banho e rosto Buddemeyer 100% algodão, de alta absorção, na cor Coral.',
                link_externo: 'https://www.amazon.com.br/toalhas-Buddemeyer-Doris-Banho-Coral/dp/B0CV647NJ6',
                ordem: 22,
                imagem: '',
            },
            {
                nome: 'Jogo de Toalha Gigante Penteado 4 Peças',
                descricao: 'Kit com 4 peças (banho e rosto), 100% algodão, fios penteados, macios e com alta gramatura.',
                link_externo: 'https://www.amazon.com.br/Jogo-Toalha-Gigante-Penteado-Pe%C3%A7as/dp/B0C94TFZ99',
                ordem: 23,
                imagem: '',
            },
            {
                nome: 'Jogo de Cama King Karsten 180 Fios Percal Liss Allure',
                descricao: 'Jogo de cama king size 4 peças, 180 fios percal 100% algodão, estilo básico na cor Allure (azul claro).',
                link_externo: 'https://www.karsten.com.br/jogo-de-cama-king-karsten-180-fios-percal-100-algodao-liss-allure-3561438/p',
                ordem: 24,
                imagem: '',
            },
            {
                nome: 'Jogo de Cama King Karsten 180 Fios Percal Liss Gelo',
                descricao: 'Jogo de cama king size 4 peças, 180 fios percal 100% algodão, estilo básico na cor Gelo.',
                link_externo: 'https://www.karsten.com.br/jogo-de-cama-king-karsten-180-fios-percal-100-algodao-lissgelo-3665217/p',
                ordem: 25,
                imagem: '',
            },
            {
                nome: 'Kit Cama King Delicato Formas Rosa Claríssimo',
                descricao: 'Kit roupa de cama king size com design delicato em formas na cor Rosa Claríssimo. Macio e elegante.',
                link_externo: 'https://www.firstclass.com.br/kit-cama-king-delicato-formas-rosa-clarissimo/p',
                ordem: 26,
                imagem: '',
            },
            {
                nome: 'Tapete de Banheiro Antiderrapante Retangular',
                descricao: 'Tapete retangular macio e confortável com base antiderrapante, essencial para o banheiro.',
                link_externo: 'https://www.amazon.com.br/Beatriz-Enxovais-Antiderrapante-Retangular-Confort%C3%A1vel/dp/B0FKD2NCYN',
                ordem: 27,
                imagem: '',
            },
            {
                nome: 'Frigobar EOS 71 Litros Ice Compact Preto 110V',
                descricao: 'Frigobar compacto de 71 litros, ideal para quartos e escritórios, com design moderno na cor preta.',
                link_externo: 'https://www.frigelar.com.br/frigobar-eos-71-litros-ice-compact-preto-efb83p-110v/p/kit11985',
                ordem: 28,
                imagem: '',
            },
            {
                nome: 'Torradeira Philco 3 funções 7 Níveis de tostagem',
                descricao: 'Torradeira com 3 funções e 7 níveis de tostagem, ideal para preparar pães e sanduíches.',
                link_externo: 'https://www.magazineluiza.com.br/torradeira-philco-3-funcoes-7-niveis-de-tostagem-ptr03a/p/ejk0c4hha1/ep/tost/',
                ordem: 29,
                imagem: '',
            },
            {
                nome:'Armário Multiuso Organizador 2 Portas Rimo Branco',
                descricao: 'Armário multiuso com 2 portas, ideal para organizar diversos ambientes da casa, na cor branca.',
                link_externo: 'https://loja.moveisrimo.com.br/armario-multiuso-organizador-2-portas-rimo-branco',
                ordem: 30,
                imagem: '',
            }

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
        ],
        skipDuplicates: true,
    });

    const countCasamento = await prisma.presentesCasamento.count();
    const countChaPanela = await prisma.presentesChaPanela.count();
    const honeymoonGoal = await prisma.honeymoonGoal.findUnique({ where: { id: 1 } });

    console.log('');
    console.log('✅ Seed concluído com sucesso!');
    console.log(`   📦 Presentes Casamento: ${countCasamento}`);
    console.log(`   🍳 Presentes Chá de Panela: ${countChaPanela}`);
    console.log(`   🌙 Meta Lua de Mel: R$ ${honeymoonGoal?.targetAmount} (Ativa: ${honeymoonGoal?.isActive})`);
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });