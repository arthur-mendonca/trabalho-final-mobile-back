# API – Exemplos de requisições `curl`

Base URL

- Substitua `<BASE_URL>` por `http://localhost:3000`.
- Para rotas protegidas, informe `Authorization: Bearer <ACCESS_TOKEN>`.

## Auth (`/auth`)

Login

```
curl -X POST <BASE_URL>/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "123456"
  }'
```

Refresh

```
curl -X POST <BASE_URL>/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'
```

Logout

```
curl -X POST <BASE_URL>/auth/logout \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

GitHub OAuth (início)

```
curl -L "<BASE_URL>/auth/github?redirect_uri=<URL_DO_FRONT>"
```

## User (`/user`)

Registrar

```
curl -X POST <BASE_URL>/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "123456",
    "role": "cliente"
  }'
```

Perfil (me)

```
curl <BASE_URL>/user/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Buscar por email

```
curl <BASE_URL>/user/john@example.com
```

Atualizar

```
curl -X PUT <BASE_URL>/user/update \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johnny",
    "email": "johnny@example.com",
    "cashBalance": 100.50,
    "milesBalance": 2000
  }'
```

Excluir

```
curl -X DELETE <BASE_URL>/user/delete \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Packages (`/packages`)

Listar com filtros

```
curl "<BASE_URL>/packages?destination=Paris&minPrice=1000&maxPrice=5000&startDate=2025-12-01&endDate=2025-12-31" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Obter por ID

```
curl <BASE_URL>/packages/<PACKAGE_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Criar (role: agente)

```
curl -X POST <BASE_URL>/packages \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pacote Paris",
    "description": "Viagem completa",
    "destination": "Paris",
    "startDate": "2026-01-10",
    "endDate": "2026-01-20",
    "basePrice": 3500,
    "transfer": true,
    "hotel": true,
    "tickets": true
  }'
```

Atualizar

```
curl -X PUT <BASE_URL>/packages/<PACKAGE_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "basePrice": 4200,
    "hotel": false
  }'
```

Excluir

```
curl -X DELETE <BASE_URL>/packages/<PACKAGE_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Valor diário da milha

```
curl <BASE_URL>/packages/miles/value
```

## Bookings (`/bookings`)

Comprar pacote

```
curl -X POST <BASE_URL>/bookings/<PACKAGE_ID>/purchase \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "money",
    "milesToUse": 0
  }'
```

Cancelar

```
curl -X PUT <BASE_URL>/bookings/<PACKAGE_ID>/cancel \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Confirmar

```
curl -X PUT <BASE_URL>/bookings/<PACKAGE_ID>/confirm \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Já reservado?

```
curl <BASE_URL>/bookings/booked/<PACKAGE_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Dados da reserva

```
curl <BASE_URL>/bookings/data/<PACKAGE_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Reservas do usuário

```
curl <BASE_URL>/bookings/user \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Wallet (`/wallet`)

Listar transações

```
curl <BASE_URL>/wallet \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Criar transação

```
curl -X POST <BASE_URL>/wallet \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "type": "deposit",
    "currency": "money",
    "description": "Depósito manual"
  }'
```

Bônus diário de login

```
curl -X POST <BASE_URL>/wallet/bonus/daily \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Dashboard (`/dashboard`)

Dados do dashboard

```
curl <BASE_URL>/dashboard/data \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```
