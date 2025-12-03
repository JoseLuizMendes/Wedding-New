import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ tipo: string }> }
) {
  try {
    const { tipo } = await context.params;
    
    // Normalize tipo to lowercase for comparison
    const normalizedTipo = tipo?.toLowerCase();
    
    if (!normalizedTipo) {
      return NextResponse.json(
        { error: 'Parâmetro tipo é obrigatório' }, 
        { status: 400 }
      );
    }
    
    let gifts;
    
    if (normalizedTipo === 'casamento') {
      gifts = await prisma.presentesCasamento.findMany({
        orderBy: { ordem: 'asc' },
      });
    } else if (normalizedTipo === 'cha-panela') {
      gifts = await prisma.presentesChaPanela.findMany({
        orderBy: { ordem: 'asc' },
      });
    } else {
      return NextResponse.json(
        { 
          error: `Tipo inválido: "${tipo}". Use "casamento" ou "cha-panela"` 
        }, 
        { status: 400 }
      );
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
    
    return NextResponse.json(mappedGifts);
  } catch (error) {
    console.error('Erro ao buscar presentes:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Erro interno ao buscar presentes' }, 
      { status: 500 }
    );
  }
}
