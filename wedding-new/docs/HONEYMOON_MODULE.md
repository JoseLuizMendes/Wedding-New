# Honeymoon Goal Module - Implementation Guide

## Overview
This module implements a complete honeymoon contribution system with Mercado Pago integration, following a clean architecture pattern (Repository → Service → Route Handler).

## Features
- ✅ Contribution tracking with progress visualization
- ✅ Mercado Pago payment integration
- ✅ Webhook for automatic payment reconciliation
- ✅ Atomic database transactions
- ✅ Idempotency for webhook events
- ✅ Frontend components with animations
- ✅ 6 predefined contribution amounts (R$40-200)

## Architecture

### Backend Layers

#### 1. Repository Layer (`src/repositories/honeymoon/`)
- **HoneymoonRepository.ts**: Data access implementation
  - `getActiveGoal()`: Fetch active honeymoon goal
  - `updateGoalAmount()`: Atomic transaction to increment goal and create contribution
  - `getContributions()`: List all contributions
  - `getContributionByTransactionId()`: Find contribution for idempotency check

#### 2. Service Layer (`src/services/honeymoon/`)
- **HoneymoonService.ts**: Business logic
  - `calculateProgress()`: Calculate goal progress and percentage
  - `processContribution()`: Process new contribution with idempotency

#### 3. API Routes (`src/app/api/`)
- **GET /api/honeymoon/status**: Returns current goal progress
- **POST /api/mercadopago/preference**: Creates payment preference
- **POST /api/webhooks/mercadopago**: Handles payment notifications

### Frontend Components

#### 1. Components (`src/_components/honeymoon/`)
- **HoneymoonProgress.tsx**: Progress bar showing goal status
- **HoneymoonContribution.tsx**: Contribution selector with 6 options

#### 2. Hooks (`src/hooks/`)
- **useMercadoPago.ts**: Hook for creating Mercado Pago checkouts

## Database Schema

### HoneymoonGoal
```prisma
model HoneymoonGoal {
  id            Int            @id @default(autoincrement())
  targetAmount  Decimal        @db.Decimal(10, 2)
  currentAmount Decimal        @default(0.00) @db.Decimal(10, 2)
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  contributions Contribution[]
}
```

### Contribution
```prisma
model Contribution {
  id              String        @id @default(uuid())
  honeymoonId     Int
  honeymoon       HoneymoonGoal @relation(fields: [honeymoonId], references: [id])
  amount          Decimal       @db.Decimal(10, 2)
  contributorName String?
  transactionId   String        @unique
  paymentStatus   String        @default("pending")
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

## Setup Instructions

### 1. Environment Variables
Create a `.env` file with:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/wedding_db"
MERCADOPAGO_ACCESS_TOKEN=your_access_token_here
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here
MERCADOPAGO_PUBLIC_KEY=your_public_key_here
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 2. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name add_honeymoon_goal_models

# Seed database
npm run db:seed
```

### 3. Install Dependencies
```bash
npm install mercadopago @mercadopago/sdk-react
```

## Testing

### Local Testing with Ngrok
1. Start ngrok tunnel:
   ```bash
   ngrok http 3000
   ```

2. Configure webhook URL in Mercado Pago dashboard:
   ```
   https://your-ngrok-url.ngrok.io/api/webhooks/mercadopago
   ```

3. Use Mercado Pago sandbox for test payments

### API Endpoints Testing

#### Get Honeymoon Status
```bash
curl http://localhost:3000/api/honeymoon/status
```

Expected response:
```json
{
  "targetAmount": 5000.00,
  "currentAmount": 0.00,
  "percentage": 0,
  "isActive": true,
  "contributionsCount": 0
}
```

#### Create Payment Preference
```bash
curl -X POST http://localhost:3000/api/mercadopago/preference \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "title": "Contribuição Lua de Mel - R$ 50",
    "gift_id": "cota_50",
    "contributor_name": "João Silva"
  }'
```

## Webhook Flow

1. User selects contribution amount
2. Frontend creates Mercado Pago preference via `/api/mercadopago/preference`
3. User is redirected to Mercado Pago checkout
4. After payment approval, Mercado Pago sends webhook to `/api/webhooks/mercadopago`
5. Webhook validates signature and processes payment
6. If `gift_id` starts with `cota_` or `pix_`, it's processed as honeymoon contribution
7. HoneymoonService creates contribution and updates goal atomically
8. Frontend progress bar updates automatically on next page load

## Security Considerations

1. **Webhook Signature Verification**: Implemented in `verifyMercadoPagoSignature()`
2. **Atomic Transactions**: Ensures data consistency
3. **Idempotency**: Prevents duplicate processing of the same payment
4. **Input Validation**: All API endpoints validate required fields
5. **Type Safety**: Full TypeScript typing for all components

## Gift Types Detection

The webhook handler determines payment type based on:
- `external_reference` starts with `cota_` or `pix_` → Honeymoon contribution
- `metadata.type === 'honeymoon'` → Honeymoon contribution
- Otherwise → Physical gift purchase

## Contribution Options

The system includes 6 predefined contribution amounts:
- R$ 40.00 (cota_40)
- R$ 50.00 (cota_50)
- R$ 80.00 (cota_80)
- R$ 100.00 (cota_100)
- R$ 150.00 (cota_150)
- R$ 200.00 (cota_200)

These are also added to the seed data as the first 6 items in the gift list (ordem 1-6).

## Troubleshooting

### Build Errors
- Ensure Prisma client is generated: `npx prisma generate`
- Check TypeScript version compatibility
- Verify all environment variables are set

### Webhook Not Receiving Events
- Verify ngrok is running and URL is correct
- Check webhook signature validation
- Review Mercado Pago webhook logs
- Ensure your endpoint returns 200 status

### Database Errors
- Verify DATABASE_URL is correctly formatted
- Run migrations: `npx prisma migrate dev`
- Check database connection

## Future Enhancements

- [ ] Add contribution history page
- [ ] Email notifications for contributions
- [ ] Custom contribution amounts
- [ ] Multiple payment methods (PIX, credit card, boleto)
- [ ] Contribution leaderboard
- [ ] Thank you messages for contributors
