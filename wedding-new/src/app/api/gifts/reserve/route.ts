import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { GiftRepository } from '@/repositories/gifts/GiftRepository';
import { GiftService } from '@/services/gifts/GiftService';
import { ReserveGiftDTOSchema } from '@/types/gifts/gift.dto';
import { normalizeEventType } from '@/types/common';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, tipo, name, phone } = body;
    
    // Basic validation for required fields
    if (!giftId || !tipo || !name || !phone) {
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
    const validationResult = ReserveGiftDTOSchema.safeParse({
      giftId,
      tipo: eventType,
      name,
      phone,
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

    const result = await giftService.reserveGift(validationResult.data);

    return NextResponse.json({
      success: true,
      message: 'Presente reservado com sucesso!',
      data: {
        reservationCode: result.reservationCode,
      },
    });
  } catch (error) {
    console.error('Erro ao reservar presente:', error);
    
    // Handle specific business logic errors
    if (error instanceof Error) {
      if (error.message === 'GIFT_NOT_FOUND') {
        return NextResponse.json(
          { success: false, message: 'Presente não encontrado' },
          { status: 404 }
        );
      }
      if (error.message === 'GIFT_NOT_AVAILABLE') {
        return NextResponse.json(
          { success: false, message: 'Este presente não está mais disponível para reserva.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { success: false, message: 'Erro interno ao reservar presente' },
      { status: 500 }
    );
  }
}
