import { http, HttpResponse } from 'msw';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Mock data
export const mockGifts = [
  {
    id: 1,
    name: 'Jogo de Panelas',
    description: 'Jogo de panelas antiaderentes',
    imageUrl: '/images/gift1.jpg',
    price: 299.90,
    eventType: 'CASAMENTO',
    status: 'AVAILABLE',
  },
  {
    id: 2,
    name: 'Liquidificador',
    description: 'Liquidificador 1000W',
    imageUrl: '/images/gift2.jpg',
    price: 199.90,
    eventType: 'CASAMENTO',
    status: 'RESERVED',
  },
  {
    id: 3,
    name: 'Cafeteira',
    description: 'Cafeteira elétrica',
    imageUrl: '/images/gift3.jpg',
    price: 149.90,
    eventType: 'CASAMENTO',
    status: 'PURCHASED',
  },
];

export const handlers = [
  // RSVP Casamento endpoint
  http.post(`${API_BASE_URL}/api/v1/rsvp/casamento`, async ({ request }) => {
    const body = await request.json() as { nomeCompleto: string; contato: string; mensagem?: string };
    
    if (!body.nomeCompleto || !body.contato) {
      return HttpResponse.json(
        { error: 'Nome e contato são obrigatórios' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      id: 1,
      name: body.nomeCompleto,
      message: body.mensagem || '',
      confirmedAt: new Date().toISOString(),
    });
  }),

  // RSVP Chá de Panela endpoint
  http.post(`${API_BASE_URL}/api/v1/rsvp/cha-panela`, async ({ request }) => {
    const body = await request.json() as { nomeCompleto: string; contato: string; mensagem?: string };
    
    if (!body.nomeCompleto || !body.contato) {
      return HttpResponse.json(
        { error: 'Nome e contato são obrigatórios' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      id: 2,
      name: body.nomeCompleto,
      message: body.mensagem || '',
      confirmedAt: new Date().toISOString(),
    });
  }),

  // Get gifts by event type
  http.get(`${API_BASE_URL}/api/v1/gifts/:tipo`, ({ params }) => {
    const { tipo } = params;
    const filteredGifts = mockGifts.filter(
      (gift) => gift.eventType === tipo
    );
    return HttpResponse.json(filteredGifts);
  }),

  // Reserve gift
  http.post(`${API_BASE_URL}/api/v1/gifts/reserve`, async ({ request }) => {
    const body = await request.json() as { giftId: number; tipo: string; name: string; phone: string };
    
    const gift = mockGifts.find((g) => g.id === body.giftId);
    
    if (!gift) {
      return HttpResponse.json(
        { success: false, message: 'Presente não encontrado' },
        { status: 404 }
      );
    }
    
    if (gift.status !== 'AVAILABLE') {
      return HttpResponse.json(
        { success: false, message: 'Este presente não está mais disponível para reserva.' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Presente reservado com sucesso!',
      data: { reservationCode: 'ABC123' },
    });
  }),

  // Mark gift as purchased
  http.post(`${API_BASE_URL}/api/v1/gifts/mark-purchased`, async ({ request }) => {
    const body = await request.json() as { giftId: number; tipo: string; code: string };
    
    const gift = mockGifts.find((g) => g.id === body.giftId);
    
    if (!gift) {
      return HttpResponse.json(
        { success: false, message: 'Presente não encontrado' },
        { status: 404 }
      );
    }
    
    if (body.code !== 'ABC123') {
      return HttpResponse.json(
        { success: false, message: 'Código de reserva inválido.' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Presente marcado como comprado!',
    });
  }),

  // Cancel reservation
  http.post(`${API_BASE_URL}/api/v1/gifts/cancel-reservation`, async ({ request }) => {
    const body = await request.json() as { giftId: number; tipo: string; code: string };
    
    const gift = mockGifts.find((g) => g.id === body.giftId);
    
    if (!gift) {
      return HttpResponse.json(
        { success: false, message: 'Presente não encontrado' },
        { status: 404 }
      );
    }
    
    if (body.code !== 'ABC123') {
      return HttpResponse.json(
        { success: false, message: 'Código de reserva inválido.' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Reserva cancelada com sucesso!',
    });
  }),
];
