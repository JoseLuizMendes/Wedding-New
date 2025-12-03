import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nomeCompleto, contato, mensagem } = body;
    
    if (!nomeCompleto || !contato) {
      return NextResponse.json(
        { error: 'Nome completo e contato são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Create RSVP record
    const rsvp = await prisma.rsvpChaPanela.create({
      data: {
        nome_completo: nomeCompleto,
        contato: contato,
        mensagem: mensagem || null,
      },
    });
    
    return NextResponse.json({
      id: rsvp.id,
      name: rsvp.nome_completo,
      message: mensagem,
      confirmedAt: rsvp.created_at.toISOString(),
    });
  } catch (error) {
    console.error('Erro ao criar RSVP para chá de panela:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar confirmação de presença' },
      { status: 500 }
    );
  }
}
