import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RsvpRepository } from '@/repositories/rsvp/RsvpRepository';
import { RsvpService } from '@/services/rsvp/RsvpService';
import { CreateRsvpDTOSchema, mapRsvpEntityToResponse } from '@/types/rsvp/rsvp.dto';
import { EVENT_TYPE } from '@/types/common';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nomeCompleto, contato, mensagem } = body;
    
    // Basic validation for required fields
    if (!nomeCompleto || !contato) {
      return NextResponse.json(
        { error: 'Nome completo e contato são obrigatórios' },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validationResult = CreateRsvpDTOSchema.safeParse({
      nomeCompleto,
      contato,
      mensagem,
      tipo: EVENT_TYPE.CHA_PANELA,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => e.message).join(', ');
      return NextResponse.json(
        { error: `Validação falhou: ${errors}` },
        { status: 400 }
      );
    }

    // Use service layer with dependency injection
    const rsvpRepository = new RsvpRepository(prisma);
    const rsvpService = new RsvpService(rsvpRepository);

    const rsvp = await rsvpService.createRsvp(validationResult.data);

    // Map entity to response
    const response = mapRsvpEntityToResponse(rsvp);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao criar RSVP para chá de panela:', error);

    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message === 'DUPLICATE_NAME') {
        return NextResponse.json(
          { error: 'Já existe uma confirmação de presença com este nome. Se você precisa atualizar seus dados, entre em contato conosco.' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Erro interno ao processar confirmação de presença' },
      { status: 500 }
    );
  }
}
