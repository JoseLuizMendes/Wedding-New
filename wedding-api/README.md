# Wedding API

API REST para gerenciamento de RSVP (confirmação de presença) e lista de presentes para casamento e chá de panela.

## Tecnologias

- Java 21 (LTS)
- Spring Boot 3.2.x
- Spring Data JPA
- PostgreSQL
- Flyway (migrations)
- Swagger/OpenAPI 3
- Docker

## Pré-requisitos

- Java 21 ou superior
- Maven 3.9+
- PostgreSQL 15+ (ou Docker)

## Configuração

### Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `DB_HOST` | Host do banco de dados | `localhost` |
| `DB_PORT` | Porta do banco de dados | `5432` |
| `DB_NAME` | Nome do banco de dados | `wedding` |
| `DB_USER` | Usuário do banco | `wedding` |
| `DB_PASSWORD` | Senha do banco | `wedding` |
| `PORT` | Porta da aplicação | `8080` |
| `CORS_ORIGINS` | Origens permitidas para CORS | `http://localhost:3000` |

### Banco de Dados Local (Docker)

```bash
docker run -d \
  --name wedding-db \
  -e POSTGRES_DB=wedding \
  -e POSTGRES_USER=wedding \
  -e POSTGRES_PASSWORD=wedding \
  -p 5432:5432 \
  postgres:15-alpine
```

## Executar Localmente

### Modo Desenvolvimento (H2)

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Modo Produção (PostgreSQL)

```bash
./mvnw spring-boot:run
```

## Build e Testes

### Compilar

```bash
./mvnw clean compile
```

### Executar Testes

```bash
./mvnw test
```

### Gerar Pacote

```bash
./mvnw clean package
```

### Executar JAR

```bash
java -jar target/wedding-api-1.0.0-SNAPSHOT.jar
```

## Docker

### Build da Imagem

```bash
docker build -t wedding-api .
```

### Executar Container

```bash
docker run -d \
  --name wedding-api \
  -p 8080:8080 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_NAME=wedding \
  -e DB_USER=wedding \
  -e DB_PASSWORD=wedding \
  wedding-api
```

## Endpoints

### Health Check

- `GET /api/v1/health` - Verificar status da API

### RSVP (Confirmação de Presença)

- `POST /api/v1/rsvp/casamento` - Confirmar presença no casamento
- `POST /api/v1/rsvp/cha-panela` - Confirmar presença no chá de panela
- `GET /api/v1/rsvp/{eventType}/list` - Listar confirmações por evento

### Presentes

- `GET /api/v1/gifts/{tipo}` - Listar presentes por tipo de evento
- `POST /api/v1/gifts/reserve` - Reservar um presente
- `POST /api/v1/gifts/mark-purchased` - Marcar presente como comprado
- `POST /api/v1/gifts/cancel-reservation` - Cancelar reserva de presente

## Documentação da API

A documentação Swagger está disponível em:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api-docs

## Estrutura do Projeto

```
wedding-api/
├── src/main/java/com/wedding/api/
│   ├── WeddingApiApplication.java
│   ├── config/
│   │   ├── CorsConfig.java
│   │   ├── VirtualThreadConfig.java
│   │   └── OpenApiConfig.java
│   ├── controller/
│   │   ├── RSVPController.java
│   │   ├── GiftController.java
│   │   └── HealthController.java
│   ├── model/
│   │   ├── entity/
│   │   ├── dto/
│   │   └── enums/
│   ├── repository/
│   ├── service/
│   └── exception/
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/
└── src/test/
```

## Funcionalidades

### Virtual Threads

A aplicação utiliza Virtual Threads (Java 21) para melhor performance e escalabilidade.

### CORS

Configurado para permitir requisições do front-end Next.js em `http://localhost:3000`.

### Migrations

O Flyway gerencia as migrations do banco de dados automaticamente.

## Exemplos de Requisições

### Confirmar Presença no Casamento

```bash
curl -X POST http://localhost:8080/api/v1/rsvp/casamento \
  -H "Content-Type: application/json" \
  -d '{
    "nomeCompleto": "João Silva",
    "contato": "11999999999",
    "mensagem": "Estarei presente!"
  }'
```

### Reservar Presente

```bash
curl -X POST http://localhost:8080/api/v1/gifts/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "giftId": 1,
    "tipo": "CASAMENTO",
    "name": "Maria Santos",
    "phone": "11988888888"
  }'
```

## Licença

Este projeto é privado e de uso exclusivo para o casamento.
