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
    
    // Find the gift
    const gift = isCasamento
      ? await prisma.presentesCasamento.findUnique({ where: { id: giftId } })
      : await prisma.presentesChaPanela.findUnique({ where: { id: giftId } });
    
    if (!gift) {
      return NextResponse.json(
        { success: false, message: 'Presente não encontrado' },
        { status: 404 }
      );
    }
    
    // Check if gift is available
    if (gift.reservado || gift.is_bought) {
      return NextResponse.json(
        { success: false, message: 'Este presente não está mais disponível para reserva.' },
        { status: 400 }
      );
    }
    
    // Generate reservation details
    const reservationCode = generateReservationCode();
    const phoneHash = hashPhoneNumber(normalizedPhone);
    const phoneDisplay = maskPhoneForDisplay(phone);
    const reservedUntil = getReservationExpiry();
    
    // Update the gift
    if (isCasamento) {
      await prisma.presentesCasamento.update({
        where: { id: giftId },
        data: {
          reservado: true,
          reserved_by: name,
          reserved_phone_hash: phoneHash,
          reserved_phone_display: phoneDisplay,
          reserved_at: new Date(),
          reserved_until: reservedUntil,
          telefone_contato: reservationCode, // Store code in telefone_contato field
        },
      });
    } else {
      await prisma.presentesChaPanela.update({
        where: { id: giftId },
        data: {
          reservado: true,
          reserved_by: name,
          reserved_phone_hash: phoneHash,
          reserved_phone_display: phoneDisplay,
          reserved_at: new Date(),
          reserved_until: reservedUntil,
          telefone_contato: reservationCode, // Store code in telefone_contato field
        },
      });
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
    return NextResponse.json(
      { success: false, message: 'Erro interno ao reservar presente' },
      { status: 500 }
    );
  }
}
