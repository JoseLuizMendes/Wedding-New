# Next.js API Routes Migration

This document describes the migration from Java API to Next.js API routes for gifts and RSVP functionality.

## Overview

The application now uses Next.js API routes instead of the Java Spring Boot API for gifts and RSVP operations. This allows direct access to the Neon PostgreSQL database via Prisma, eliminating the need for the Java API for these features.

## API Routes Created

### Gifts API Routes

1. **GET /api/gifts/[tipo]**
   - Path: `src/app/api/gifts/[tipo]/route.ts`
   - Description: Returns list of gifts for the specified event type
   - Parameters: `tipo` - Either 'casamento' or 'cha-panela'
   - Response: Array of Gift objects with all fields from database

2. **POST /api/gifts/reserve**
   - Path: `src/app/api/gifts/reserve/route.ts`
   - Description: Reserves a gift for a user
   - Request Body:
     ```json
     {
       "giftId": "uuid",
       "tipo": "casamento" | "cha-panela",
       "name": "string",
       "phone": "string"
     }
     ```
   - Response: 
     ```json
     {
       "success": true,
       "message": "Presente reservado com sucesso!",
       "data": {
         "reservationCode": "ABC123"
       }
     }
     ```

3. **POST /api/gifts/mark-purchased**
   - Path: `src/app/api/gifts/mark-purchased/route.ts`
   - Description: Marks a reserved gift as purchased
   - Request Body:
     ```json
     {
       "giftId": "uuid",
       "tipo": "casamento" | "cha-panela",
       "code": "string"
     }
     ```

4. **POST /api/gifts/cancel-reservation**
   - Path: `src/app/api/gifts/cancel-reservation/route.ts`
   - Description: Cancels a gift reservation
   - Request Body:
     ```json
     {
       "giftId": "uuid",
       "tipo": "casamento" | "cha-panela",
       "code": "string"
     }
     ```

### RSVP API Routes

1. **POST /api/rsvp/casamento**
   - Path: `src/app/api/rsvp/casamento/route.ts`
   - Description: Creates wedding RSVP
   - Request Body:
     ```json
     {
       "nomeCompleto": "string",
       "contato": "string",
       "mensagem": "string (optional)"
     }
     ```

2. **POST /api/rsvp/cha-panela**
   - Path: `src/app/api/rsvp/cha-panela/route.ts`
   - Description: Creates bridal shower RSVP
   - Request Body: Same as casamento

## Utility Functions

**File:** `src/lib/api/reservation-utils.ts`

- `generateReservationCode()`: Generates 6-character alphanumeric code
- `hashPhoneNumber()`: Hashes phone number using SHA-256
- `getReservationExpiry()`: Returns date 48 hours from now
- `maskPhoneForDisplay()`: Masks phone for display (e.g., "(11) ****-4321")
- `isReservationExpired()`: Checks if reservation has expired

## Updated Files

### Frontend API Clients

1. **src/lib/api/gifts.ts**
   - Now uses `/api/gifts/*` routes instead of `/api/v1/gifts/*`
   - Simplified to use direct fetch calls to internal routes
   - No longer needs event type mapping or DTO conversion

2. **src/lib/api-client.ts**
   - Updated to use internal routes for gifts and RSVP
   - Removed dependency on `NEXT_PUBLIC_API_URL` for these endpoints
   - Simplified request handling

## Database Schema

The routes interact with these Prisma models:

- `PresentesCasamento` - Wedding gifts
- `PresentesChaPanela` - Bridal shower gifts
- `RsvpCasamento` - Wedding RSVPs
- `RsvpChaPanela` - Bridal shower RSVPs

## Reservation Code Storage

Reservation codes are stored in the `telefone_contato` field temporarily during the reservation period. This field is:
- Set when a gift is reserved
- Used to validate purchases and cancellations
- Cleared when reservation is cancelled

## Building the Application

To build the application, you need to provide a DATABASE_URL:

```bash
DATABASE_URL="postgresql://..." npm run build
```

Or set it in your `.env` or `.env.local` file.

## Migration Notes

- The Java API can still be used for other features if needed
- All existing frontend components continue to work without changes
- The gift reservation flow remains the same from a user perspective
- Phone numbers are hashed for security before storage
