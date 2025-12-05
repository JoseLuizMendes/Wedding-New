import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GiftRepository } from '@/repositories/gifts/GiftRepository';
import { GiftService } from '@/services/gifts/GiftService';
import { CancelReservationDTOSchema } from '@/types/gifts/gift.dto';
import { normalizeEventType } from '@/types/common';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, tipo, code } = body;
    
    // Basic validation for required fields
    if (!giftId || !tipo || !code) {
      return NextResponse.json(
        { success: false, message: 'Dados incompletos' },
        { status: 400 }
      );
    }

    // Normalize event type
    const eventType = normalizeEventType(tipo);
    if (!eventType) {
      return NextResponse.json(
        { success: false, message: 'Tipo de evento inválido' },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validationResult = CancelReservationDTOSchema.safeParse({
      giftId,
      tipo: eventType,
      code,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(e => e.message).join(', ');
      return NextResponse.json(
        { success: false, message: `Validação falhou: ${errors}` },
        { status: 400 }
      );
    }

    // Use service layer with dependency injection
    const giftRepository = new GiftRepository(prisma);
    const giftService = new GiftService(giftRepository);

    await giftService.cancelReservation(validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Reserva cancelada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);

    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message === 'GIFT_NOT_FOUND') {
        return NextResponse.json(
          { success: false, message: 'Presente não encontrado' },
          { status: 404 }
        );
      }
      if (error.message === 'INVALID_CODE') {
        return NextResponse.json(
          { success: false, message: 'Código de reserva inválido.' },
          { status: 400 }
        );
      }
      if (error.message === 'GIFT_NOT_RESERVED') {
        return NextResponse.json(
          { success: false, message: 'Este presente não está reservado.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Erro interno ao cancelar reserva' },
      { status: 500 }
    );
  }
}
