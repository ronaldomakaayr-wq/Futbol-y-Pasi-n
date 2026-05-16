# backend-nest

API REST construida con [NestJS](https://nestjs.com/) que implementa autenticación con JWT y persistencia en PostgreSQL usando TypeORM.

## Stack

- **NestJS 11** + **TypeScript**
- **TypeORM** + **PostgreSQL** (`pg`)
- **JWT** (`@nestjs/jwt`) + **Passport** (`passport-jwt`)
- **bcrypt** para hashear contraseñas
- **class-validator** + **class-transformer** para validación de DTOs
- **Jest** para tests unitarios

## Requisitos previos

- Node.js 20+
- PostgreSQL corriendo localmente (o en la nube)

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo de ejemplo a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Edita `.env` con tus credenciales de Postgres y un secreto JWT propio:

   ```env
   PORT=3000

   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu_password
   DB_NAME=backend_nest
   DB_SYNCHRONIZE=true

   JWT_SECRET=usa_un_string_largo_y_aleatorio
   JWT_EXPIRES_IN=1h
   ```

3. Crea la base de datos en Postgres (TypeORM no la crea, solo las tablas):

   ```sql
   CREATE DATABASE backend_nest;
   ```

> Con `DB_SYNCHRONIZE=true` TypeORM creará/actualizará la tabla `users` automáticamente a partir de la entidad. **Solo usar en desarrollo** — en producción se debe pasar a `false` y usar migraciones.

## Scripts

```bash
# desarrollo con recarga automática
npm run start:dev

# producción
npm run build
npm run start:prod

# tests
npm test
npm run test:cov

# lint
npm run lint
```

## Endpoints

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "tu@correo.com",
  "password": "secreto123"
}
```

Respuesta `200`:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "email": "tu@correo.com" }
}
```

Errores:
- `400` — formato inválido
- `401` — credenciales inválidas

### Perfil (protegido)

Devuelve los datos del usuario autenticado, incluyendo su perfil.

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Errores:
- `401` — token ausente, inválido o expirado

## Estructura del proyecto

```
src/
├── main.ts                  Bootstrap + ValidationPipe global
├── app.module.ts            ConfigModule + TypeOrmModule (forRootAsync)
├── app.controller.ts
├── app.service.ts
├── auth/
│   ├── auth.module.ts       PassportModule + JwtModule
│   ├── auth.controller.ts   POST /auth/register, /auth/login, GET /auth/me
│   ├── auth.service.ts      Registro, login, hashing con bcrypt
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts  Validación del JWT + carga del usuario
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── decorators/
│       └── current-user.decorator.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts        findByEmail, findById, create
│   └── entities/
│       └── user.entity.ts      Credenciales: id, email, password, is_active
└── profiles/
    ├── profiles.module.ts
    ├── profiles.service.ts     findByUserId, findByDocument
    ├── enums/
    │   └── document-type.enum.ts   DNI, CE, PASAPORTE, RUC
    └── entities/
        └── profile.entity.ts   Datos personales: nombres, documento, teléfono...
```

### Modelo de datos

```
users (autenticación)              profiles (identidad)
─────────────────────              ─────────────────────────
id  (uuid)         ───────1:1────► user_id   (uuid, FK CASCADE)
email      UNIQUE                  first_name
password   (bcrypt)                last_name
is_active                          document_type   (enum)
created_at                         document_number
                                   phone (nullable)
                                   birth_date (nullable)
                                   UNIQUE(document_type, document_number)
```

La separación responde a *single responsibility*: `users` solo guarda lo necesario para autenticar, `profiles` guarda los datos descriptivos. Esto evita exponer hashes de password al listar perfiles y permite cargar solo lo necesario en cada request.

## Notas de seguridad

- Las contraseñas se almacenan **hasheadas con bcrypt** (10 rondas).
- El `JwtStrategy` recarga el usuario desde la base de datos en cada request, así un usuario eliminado pierde el acceso aunque su token aún no haya expirado.
- El `ValidationPipe` global rechaza propiedades no declaradas en los DTOs (`forbidNonWhitelisted: true`).
- `POST /auth/register` crea `users` y `profiles` dentro de una **transacción** (`DataSource.transaction`): si falla la creación del perfil, el usuario tampoco se persiste.
- Nunca commitear `.env` — usa `.env.example` como plantilla.
