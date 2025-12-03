import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mock data para desenvolvimento quando DATABASE_URL não está configurada
const MOCK_GIFTS_CASAMENTO = [
  {
    id: '1',
    nome: 'Jogo de Panelas',
    descricao: 'Jogo de panelas antiaderente 5 peças',
    link_externo: 'https://example.com/panelas',
    reservado: false,
    ordem: 1,
    reserved_until: null,
    is_bought: false,
    reserved_by: null,
    reserved_phone_display: null,
    reserved_at: null,
    purchased_at: null,
    imagem: null,
  },
  {
    id: '2',
    nome: 'Jogo de Cama',
    descricao: 'Jogo de lençóis queen 300 fios',
    link_externo: 'https://example.com/cama',
    reservado: false,
    ordem: 2,
    reserved_until: null,
    is_bought: false,
    reserved_by: null,
    reserved_phone_display: null,
    reserved_at: null,
    purchased_at: null,
    imagem: null,
  },
];

const MOCK_GIFTS_CHA_PANELA = [
  {
    id: '3',
    nome: 'Mixer',
    descricao: 'Mixer com 5 velocidades',
    link_externo: 'https://example.com/mixer',
    reservado: false,
    ordem: 1,
    reserved_until: null,
    is_bought: false,
    reserved_by: null,
    reserved_phone_display: null,
    reserved_at: null,
    purchased_at: null,
    imagem: null,
  },
];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tipo: string }> }
) {
  const startTime = Date.now();
  
  try {
    const { tipo } = await context.params;
    const normalizedTipo = tipo?.toLowerCase();
    
    console.log(`[API /gifts/${normalizedTipo || 'undefined'}] Request received`);
    
    // Normalize tipo to lowercase for comparison
    if (!normalizedTipo) {
      console.error(`[API /gifts] Missing tipo parameter`);
      return NextResponse.json(
        { error: 'Parâmetro tipo é obrigatório' }, 
        { status: 400 }
      );
    }
    
    console.log(`[API /gifts/${normalizedTipo}] Normalized tipo: ${normalizedTipo}`);
    
    // Check if database is configured
    const hasDatabase = process.env.DATABASE_URL && 
                       !process.env.DATABASE_URL.includes('placeholder') &&
                       !process.env.DATABASE_URL.includes('localhost:5432');
    
    let gifts;
    
    if (!hasDatabase) {
      console.warn(`[API /gifts/${normalizedTipo}] Using mock data (DATABASE_URL not configured)`);
      // Usar dados mock para desenvolvimento
      if (normalizedTipo === 'casamento') {
        gifts = MOCK_GIFTS_CASAMENTO;
      } else if (normalizedTipo === 'cha-panela') {
        gifts = MOCK_GIFTS_CHA_PANELA;
      } else {
        console.error(`[API /gifts/${normalizedTipo}] Invalid tipo: ${normalizedTipo}`);
        return NextResponse.json(
          { 
            error: `Tipo inválido. Use "casamento" ou "cha-panela"` 
          }, 
          { status: 400 }
        );
      }
      console.log(`[API /gifts/${normalizedTipo}] Returning ${gifts.length} mock gifts`);
    } else {
      try {
        if (normalizedTipo === 'casamento') {
          console.log(`[API /gifts/${normalizedTipo}] Querying presentesCasamento table`);
          gifts = await prisma.presentesCasamento.findMany({
            orderBy: { ordem: 'asc' },
          });
        } else if (normalizedTipo === 'cha-panela') {
          console.log(`[API /gifts/${normalizedTipo}] Querying presentesChaPanela table`);
          gifts = await prisma.presentesChaPanela.findMany({
            orderBy: { ordem: 'asc' },
          });
        } else {
          console.error(`[API /gifts/${normalizedTipo}] Invalid tipo: ${normalizedTipo}`);
          return NextResponse.json(
            { 
              error: `Tipo inválido. Use "casamento" ou "cha-panela"` 
            }, 
            { status: 400 }
          );
        }
        
        console.log(`[API /gifts/${normalizedTipo}] Found ${gifts.length} gifts`);
      } catch (prismaError) {
        console.error(`[API /gifts/${normalizedTipo}] Prisma query error:`, {
          error: prismaError instanceof Error ? {
            message: prismaError.message,
            stack: prismaError.stack,
            name: prismaError.name
          } : String(prismaError),
          normalizedTipo,
          databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
        });
        throw prismaError;
      }
    }
    
    // Mapear para formato esperado pelo frontend (não expor hash do telefone)
    const mappedGifts = gifts.map(gift => ({
      id: gift.id,
      nome: gift.nome,
      descricao: gift.descricao,
      link_externo: gift.link_externo,
      reservado: gift.reservado,
      ordem: gift.ordem,
      reserved_until: gift.reserved_until?.toISOString() || null,
      is_bought: gift.is_bought,
      reserved_by: gift.reserved_by,
      reserved_phone_display: gift.reserved_phone_display,
      reserved_at: gift.reserved_at?.toISOString() || null,
      purchased_at: gift.purchased_at?.toISOString() || null,
      imagem: gift.imagem,
    }));
    
    const duration = Date.now() - startTime;
    console.log(`[API /gifts/${normalizedTipo}] Request completed in ${duration}ms`);
    
    return NextResponse.json(mappedGifts);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API /gifts] Request failed after ${duration}ms:`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : String(error),
      prismaClientExists: typeof prisma !== 'undefined',
      nodeEnv: process.env.NODE_ENV
    });
    
    return NextResponse.json(
      { error: 'Erro interno no servidor. Tente novamente mais tarde.' }, 
      { status: 500 }
    );
  }
}
