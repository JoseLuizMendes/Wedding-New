import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GiftRepository } from '@/repositories/gifts/GiftRepository';
import { GiftService } from '@/services/gifts/GiftService';
import { normalizeEventType, EVENT_TYPE } from '@/types/common';
import { mapGiftEntityToResponse } from '@/types/gifts/gift.dto';

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
    const tipoLower = tipo?.toLowerCase();
    
    console.log(`[API /gifts/${tipoLower || 'undefined'}] Request received`);
    
    // Validate and normalize tipo
    if (!tipoLower) {
      console.error(`[API /gifts] Missing tipo parameter`);
      return NextResponse.json(
        { error: 'Parâmetro tipo é obrigatório' }, 
        { status: 400 }
      );
    }

    const eventType = normalizeEventType(tipoLower);
    
    if (!eventType) {
      console.error(`[API /gifts/${tipoLower}] Invalid tipo: ${tipoLower}`);
      return NextResponse.json(
        { 
          error: `Tipo inválido. Use "casamento" ou "cha-panela"` 
        }, 
        { status: 400 }
      );
    }
    
    console.log(`[API /gifts/${tipoLower}] Normalized tipo: ${eventType}`);
    
    // Check if database is configured
    const hasDatabase = process.env.DATABASE_URL && 
                       !process.env.DATABASE_URL.includes('placeholder') &&
                       !process.env.DATABASE_URL.includes('localhost:5432');
    
    let gifts;
    
    if (!hasDatabase) {
      console.warn(`[API /gifts/${tipoLower}] Using mock data (DATABASE_URL not configured)`);
      // Use mock data for development
      if (eventType === EVENT_TYPE.CASAMENTO) {
        gifts = MOCK_GIFTS_CASAMENTO;
      } else {
        gifts = MOCK_GIFTS_CHA_PANELA;
      }
      console.log(`[API /gifts/${tipoLower}] Returning ${gifts.length} mock gifts`);
    } else {
      try {
        // Use service layer with dependency injection
        const giftRepository = new GiftRepository(prisma);
        const giftService = new GiftService(giftRepository);
        
        console.log(`[API /gifts/${tipoLower}] Querying database via service layer`);
        const giftEntities = await giftService.getGiftsByEventType(eventType);
        
        // Map entities to response format
        gifts = giftEntities.map(mapGiftEntityToResponse);
        
        console.log(`[API /gifts/${tipoLower}] Found ${gifts.length} gifts`);
      } catch (prismaError) {
        console.error(`[API /gifts/${tipoLower}] Database query error:`, {
          error: prismaError instanceof Error ? {
            message: prismaError.message,
            stack: prismaError.stack,
            name: prismaError.name
          } : String(prismaError),
          eventType,
          databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing'
        });
        throw prismaError;
      }
    }
    
    const duration = Date.now() - startTime;
    console.log(`[API /gifts/${tipoLower}] Request completed in ${duration}ms`);
    
    return NextResponse.json(gifts);
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
