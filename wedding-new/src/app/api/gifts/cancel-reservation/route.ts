import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giftId, tipo, code } = body;
    
    if (!giftId || !tipo || !code) {
      return NextResponse.json(
        { success: false, message: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
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
    
    // Validate reservation code (stored in telefone_contato)
    if (!gift.telefone_contato || gift.telefone_contato !== code) {
      return NextResponse.json(
        { success: false, message: 'Código de reserva inválido.' },
        { status: 400 }
      );
    }
    
    // Check if gift is reserved
    if (!gift.reservado) {
      return NextResponse.json(
        { success: false, message: 'Este presente não está reservado.' },
        { status: 400 }
      );
    }
    
    // Cancel reservation
    if (isCasamento) {
      await prisma.presentesCasamento.update({
        where: { id: giftId },
        data: {
          reservado: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          reserved_until: null,
          telefone_contato: null, // Clear the reservation code
        },
      });
    } else {
      await prisma.presentesChaPanela.update({
        where: { id: giftId },
        data: {
          reservado: false,
          reserved_by: null,
          reserved_phone_hash: null,
          reserved_phone_display: null,
          reserved_at: null,
          reserved_until: null,
          telefone_contato: null, // Clear the reservation code
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Reserva cancelada com sucesso!',
    });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno ao cancelar reserva' },
      { status: 500 }
    );
  }
}
