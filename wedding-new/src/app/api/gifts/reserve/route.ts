import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateReservationCode, hashPhoneNumber, getReservationExpiry, maskPhoneForDisplay } from '@/lib/api/reservation-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, tipo, name, phone } = body;
    
    if (!giftId || !tipo || !name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    // Normalize phone number
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Determine which table to use
    const isCasamento = tipo === 'casamento' || tipo === 'CASAMENTO';
    
    // Generate reservation details
    const reservationCode = await generateReservationCode();
    const phoneHash = hashPhoneNumber(normalizedPhone);
    const phoneDisplay = maskPhoneForDisplay(phone);
    const reservedUntil = getReservationExpiry();
    
    // Use transaction to prevent race conditions (two people reserving same gift)
    const result = await prisma.$transaction(async (tx) => {
      // Find and lock the gift for update
      const gift = isCasamento
        ? await tx.presentesCasamento.findUnique({ where: { id: giftId } })
        : await tx.presentesChaPanela.findUnique({ where: { id: giftId } });
      
      if (!gift) {
        throw new Error('GIFT_NOT_FOUND');
      }
      
      // Check if gift is still available
      if (gift.reservado || gift.is_bought) {
        throw new Error('GIFT_NOT_AVAILABLE');
      }
      
      // Update the gift atomically
      if (isCasamento) {
        await tx.presentesCasamento.update({
          where: { id: giftId },
          data: {
            reservado: true,
            reserved_by: name,
            reserved_phone_hash: phoneHash,
            reserved_phone_display: phoneDisplay,
            reserved_at: new Date(),
            reserved_until: reservedUntil,
            telefone_contato: reservationCode,
          },
        });
      } else {
        await tx.presentesChaPanela.update({
          where: { id: giftId },
          data: {
            reservado: true,
            reserved_by: name,
            reserved_phone_hash: phoneHash,
            reserved_phone_display: phoneDisplay,
            reserved_at: new Date(),
            reserved_until: reservedUntil,
            telefone_contato: reservationCode,
          },
        });
      }
      
      return { success: true };
    });
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Erro ao reservar presente' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Presente reservado com sucesso!',
      data: {
        reservationCode,
      },
    });
  } catch (error) {
    console.error('Erro ao reservar presente:', error);
    
    // Handle specific transaction errors
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
