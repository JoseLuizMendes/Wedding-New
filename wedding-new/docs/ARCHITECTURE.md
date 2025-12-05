# Arquitetura Clean (SOLID/Modular)

## 📖 Visão Geral

Este documento descreve a arquitetura em camadas implementada no projeto Wedding-New, seguindo os princípios SOLID e Clean Architecture. O objetivo é ter uma base de código modular, testável e manutenível.

## 🏗️ Estrutura de Camadas

A aplicação está organizada em 4 camadas principais:

```
wedding-new/src/
├── types/                    # DTOs e tipos centralizados
├── utils/                    # Funções puras (sem dependências)
├── repositories/             # Camada de Dados (Prisma)
├── services/                 # Camada de Negócios
└── app/api/                  # Controllers (Route Handlers)
```

### 1. **Types/DTOs** (Tipos de Dados)

Localização: `src/types/`

**Responsabilidade:** Definir contratos de dados com validação Zod.

**Conteúdo:**
- `common.ts` - Tipos base (EventType, GiftStatus)
- `gifts/gift.dto.ts` - DTOs de presentes com schemas Zod
- `rsvp/rsvp.dto.ts` - DTOs de RSVP com schemas Zod

**Exemplo:**
```typescript
export const ReserveGiftDTOSchema = z.object({
  giftId: z.string().uuid(),
  tipo: EventTypeSchema,
  name: z.string().min(1).max(255),
  phone: z.string().min(10).max(20),
});

export type ReserveGiftDTO = z.infer<typeof ReserveGiftDTOSchema>;
```

### 2. **Utils** (Utilidades)

Localização: `src/utils/`

**Responsabilidade:** Funções puras sem dependências externas.

**Conteúdo:**
- `reservation/reservation-code.utils.ts` - Geração de códigos, hash de telefone, máscaras

**Características:**
- ✅ Sem dependências de banco de dados
- ✅ Testáveis isoladamente
- ✅ Reutilizáveis

**Exemplo:**
```typescript
export function hashPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return createHash('sha256').update(digits).digest('hex');
}
```

### 3. **Repositories** (Camada de Dados)

Localização: `src/repositories/`

**Responsabilidade:** Acesso aos dados via Prisma ORM.

**Estrutura:**
```
repositories/
├── gifts/
│   ├── IGiftRepository.ts     # Interface
│   └── GiftRepository.ts      # Implementação
└── rsvp/
    ├── IRsvpRepository.ts     # Interface
    └── RsvpRepository.ts      # Implementação
```

**Características:**
- ✅ **Interface segregation** - Cada domínio tem sua interface
- ✅ **Dependency inversion** - Controllers dependem de interfaces
- ✅ Abstração do Prisma Client
- ✅ Testável com mocks

**Exemplo:**
```typescript
export interface IGiftRepository {
  findByEventType(tipo: EventType): Promise<GiftEntity[]>;
  findById(id: string, tipo: EventType): Promise<GiftEntity | null>;
  reserve(id: string, tipo: EventType, data: ReservationData): Promise<GiftEntity>;
  // ...
}

export class GiftRepository implements IGiftRepository {
  constructor(private readonly prisma: PrismaClient) {}
  
  async findByEventType(tipo: EventType): Promise<GiftEntity[]> {
    if (tipo === 'casamento') {
      return await this.prisma.presentesCasamento.findMany({
        orderBy: { ordem: 'asc' },
      });
    }
    // ...
  }
}
```

### 4. **Services** (Camada de Negócios)

Localização: `src/services/`

**Responsabilidade:** Lógica de negócio e regras de validação.

**Estrutura:**
```
services/
├── gifts/
│   ├── IGiftService.ts      # Interface
│   └── GiftService.ts       # Implementação
└── rsvp/
    ├── IRsvpService.ts      # Interface
    └── RsvpService.ts       # Implementação
```

**Características:**
- ✅ **Business logic** centralizada
- ✅ Validações antes de persistir
- ✅ Geração de códigos únicos
- ✅ Recebe repositories via **Dependency Injection**

**Exemplo:**
```typescript
export class GiftService implements IGiftService {
  constructor(private readonly giftRepository: IGiftRepository) {}

  async reserveGift(dto: ReserveGiftDTO): Promise<{ reservationCode: string }> {
    // Validar disponibilidade
    const gift = await this.giftRepository.findById(dto.giftId, dto.tipo);
    if (!gift || gift.reservado || gift.is_bought) {
      throw new Error('GIFT_NOT_AVAILABLE');
    }

    // Gerar código único
    const reservationCode = await this.generateUniqueCode();

    // Salvar reserva
    await this.giftRepository.reserve(dto.giftId, dto.tipo, {
      reserved_by: dto.name,
      telefone_contato: reservationCode,
      // ...
    });

    return { reservationCode };
  }
}
```

### 5. **Controllers** (Route Handlers)

Localização: `src/app/api/`

**Responsabilidade:** Receber requisições HTTP, validar entrada, chamar services, retornar resposta.

**Estrutura:**
```
app/api/
├── gifts/
│   ├── [tipo]/route.ts              # GET /api/gifts/[tipo]
│   ├── reserve/route.ts             # POST /api/gifts/reserve
│   ├── cancel-reservation/route.ts  # POST /api/gifts/cancel-reservation
│   └── mark-purchased/route.ts      # POST /api/gifts/mark-purchased
└── rsvp/
    ├── casamento/route.ts           # POST /api/rsvp/casamento
    └── cha-panela/route.ts          # POST /api/rsvp/cha-panela
```

**Fluxo de um Controller:**

1. **Receber request** → `await request.json()`
2. **Validar com Zod** → `DTOSchema.safeParse(data)`
3. **Instanciar dependencies** → `new GiftRepository(prisma)`, `new GiftService(repository)`
4. **Chamar service** → `await service.reserveGift(dto)`
5. **Retornar response** → `NextResponse.json({ success: true })`

**Exemplo:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação com Zod
    const validationResult = ReserveGiftDTOSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Validação falhou' }, { status: 400 });
    }

    // Dependency Injection
    const giftRepository = new GiftRepository(prisma);
    const giftService = new GiftService(giftRepository);

    // Chamar Service
    const result = await giftService.reserveGift(validationResult.data);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // Tratamento de erros
    if (error.message === 'GIFT_NOT_AVAILABLE') {
      return NextResponse.json({ error: 'Presente indisponível' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
```

## 🎯 Princípios SOLID Aplicados

### **S - Single Responsibility Principle**
- Cada classe tem uma responsabilidade única:
  - **Repository** → Apenas acesso a dados
  - **Service** → Apenas lógica de negócio
  - **Controller** → Apenas orquestração de request/response

### **O - Open/Closed Principle**
- Extensível via interfaces
- Fechado para modificação direta
- Novos repositórios/services podem ser criados sem alterar os existentes

### **L - Liskov Substitution Principle**
- Implementações podem ser substituídas por suas interfaces
- Mock repositories nos testes

### **I - Interface Segregation Principle**
- Interfaces específicas por domínio:
  - `IGiftRepository` para presentes
  - `IRsvpRepository` para confirmações

### **D - Dependency Inversion Principle**
- Services dependem de **interfaces**, não de implementações concretas
- `GiftService` recebe `IGiftRepository`, não `GiftRepository`
- Facilita testes com mocks

## 🧪 Testes

### Estrutura de Testes

```
src/__tests__/
├── services/
│   ├── gifts/GiftService.test.ts
│   └── rsvp/RsvpService.test.ts
├── components/
└── hooks/
```

### Testes de Service

Os services são testados com **mock repositories**:

```typescript
const mockGiftRepository: jest.Mocked<IGiftRepository> = {
  findById: jest.fn(),
  reserve: jest.fn(),
  isCodeUnique: jest.fn(),
  // ...
};

const giftService = new GiftService(mockGiftRepository);
```

**Vantagens:**
- ✅ Testes isolados (sem banco de dados)
- ✅ Rápidos
- ✅ Focados na lógica de negócio

### Executar Testes

```bash
npm test                        # Todos os testes
npm test src/__tests__/services # Apenas services
npm test -- --coverage          # Com cobertura
```

## 🔄 Fluxo de Dados Completo

### Exemplo: Reservar um Presente

```
1. Cliente faz POST /api/gifts/reserve
   ↓
2. Controller (route.ts)
   - Valida input com Zod
   - Cria GiftRepository(prisma)
   - Cria GiftService(repository)
   ↓
3. GiftService.reserveGift()
   - Busca gift via repository
   - Valida disponibilidade
   - Gera código único via utils
   - Hash telefone via utils
   - Salva reserva via repository
   ↓
4. GiftRepository.reserve()
   - Executa UPDATE no Prisma
   - Retorna entity atualizada
   ↓
5. Controller retorna resposta
   - { success: true, data: { reservationCode: "123456" } }
```

## 📦 Compatibilidade com Mock Data

A arquitetura **suporta desenvolvimento sem banco de dados configurado**:

```typescript
const hasDatabase = process.env.DATABASE_URL && 
                   !process.env.DATABASE_URL.includes('placeholder');

if (!hasDatabase) {
  // Usar mock data
  return MOCK_GIFTS_CASAMENTO;
} else {
  // Usar service layer
  const giftService = new GiftService(new GiftRepository(prisma));
  return await giftService.getGiftsByEventType(eventType);
}
```

## 🔧 Extensibilidade

### Adicionar novo Repository

1. Criar interface em `repositories/[domain]/I[Domain]Repository.ts`
2. Criar implementação em `repositories/[domain]/[Domain]Repository.ts`
3. Adicionar testes

### Adicionar novo Service

1. Criar interface em `services/[domain]/I[Domain]Service.ts`
2. Criar implementação em `services/[domain]/[Domain]Service.ts`
3. Injetar repository no constructor
4. Adicionar testes com mock repository

### Adicionar novo Controller

1. Criar route handler em `app/api/[endpoint]/route.ts`
2. Validar input com Zod
3. Instanciar repository e service
4. Chamar service methods
5. Tratar erros específicos

## 📚 Referências

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection in TypeScript](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Zod Validation](https://zod.dev/)
- [Prisma ORM](https://www.prisma.io/)

## ✅ Checklist de Qualidade

Ao criar novos componentes, certifique-se de:

- [ ] **Types/DTOs** - Validação Zod para todos os inputs
- [ ] **Repositories** - Interface + Implementação
- [ ] **Services** - Lógica de negócio com DI
- [ ] **Controllers** - Apenas orquestração (thin controllers)
- [ ] **Testes** - Cobertura de services com mocks
- [ ] **Logs** - Informativos para debug
- [ ] **Errors** - Tratamento específico por tipo de erro
- [ ] **Docs** - Atualizar este documento se necessário
