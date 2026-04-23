# Arquitectura de Autenticación - Documentación Técnica

## Índice
1. [Visión General](#visión-general)
2. [Estructura del Módulo](#estructura-del-módulo)
3. [Flujo de Autenticación](#flujo-de-autenticación)
4. [Guard Global](#guard-global)
5. [Cómo Marcar un Endpoint como Público](#cómo-marcar-un-endpoint-como-público)
6. [Endpoints Disponibles](#endpoints-disponibles)
7. [Configuración de la Cookie](#configuración-de-la-cookie)

---

## Visión General

El módulo `auth` implementa autenticación stateless mediante JWT almacenado en cookie `httpOnly`. Protege todos los endpoints del backend a través de un guard global registrado en `AppModule`.

Para la decisión de diseño y los trade-offs considerados, ver [ADR-006](../../../docs-grace-hub/decisions/006-autenticacion-jwt.md).

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MÓDULO DE AUTH                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌───────────────────────────────────────────────────────────┐     │
│   │                    AUTH GUARD (Global)                    │     │
│   │  Lee cookie 'auth' → verifica JWT → setea req.user        │     │
│   │  Bypass si el handler tiene @Public()                     │     │
│   └──────────────────────────┬────────────────────────────────┘     │
│                              │                                      │
│              ┌───────────────┼───────────────┐                      │
│              ▼               ▼               ▼                      │
│   ┌─────────────────┐ ┌───────────┐ ┌──────────────┐               │
│   │  @Public routes  │ │ Protected │ │   Protected  │               │
│   │  POST /login     │ │  GET /me  │ │  POST /logout│               │
│   │  POST /register  │ │           │ │              │               │
│   └─────────────────┘ └───────────┘ └──────────────┘               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Estructura del Módulo

```
src/modules/auth/
├── auth.module.ts                          # Registra JwtModule, UserEntity, AuthService, AuthGuard
│
├── application/
│   └── services/
│       └── auth.service.ts                # Lógica de negocio: register, login, getMe
│
├── decorators/
│   └── public.decorator.ts                # @Public() — marca endpoints que no requieren auth
│
├── guards/
│   └── auth.guard.ts                      # Guard global: verifica cookie 'auth'
│
├── infrastructure/
│   └── persistence/
│       └── typeorm/
│           └── user.typeorm.entity.ts     # Entidad TypeORM → tabla 'users'
│
└── presentation/
    ├── controllers/
    │   └── auth.controller.ts             # Endpoints HTTP del módulo
    └── dtos/
        ├── login.dto.ts                   # Validación email + password (min 8 chars)
        └── register.dto.ts                # Idem
```

### Responsabilidad de cada pieza

| Archivo | Responsabilidad |
|---|---|
| `user.typeorm.entity.ts` | Define la tabla `users` (id, email, password_hash). TypeORM la crea automáticamente con `synchronize: true`. |
| `auth.service.ts` | Hashea passwords (bcrypt 12 rounds), valida credenciales con comparación de tiempo constante, firma JWT, consulta usuario por ID. |
| `auth.guard.ts` | Lee la cookie `auth` del request, verifica el JWT, escribe el payload en `req.user`. Si el handler tiene `@Public()`, el guard no actúa. |
| `public.decorator.ts` | Decorador `@Public()` que setea metadata `isPublic: true` en el handler. El guard lo lee con `Reflector`. |
| `auth.controller.ts` | Expone los endpoints HTTP. Delega toda la lógica a `AuthService`. Setea/limpia la cookie en el response. |
| `auth.module.ts` | Registra `JwtModule` con configuración desde env vars. Exporta `AuthGuard` y `JwtModule` para que `AppModule` pueda registrar el guard global. |

---

## Flujo de Autenticación

### Login

```
POST /api/v1/auth/login
  → AuthController.login()
  → AuthService.login()  →  valida email/password contra tabla users
  → JwtService.signAsync({ sub: id, email })
  ← response: Set-Cookie: auth=<JWT>; HttpOnly; SameSite=Lax; Path=/
```

### Request autenticado

```
GET /api/v1/members
  Cookie: auth=<JWT>
  → AuthGuard.canActivate()
  → JwtService.verifyAsync(token)
  → req.user = { sub, email, iat, exp }
  → MembersController.findAll()
```

### Request sin cookie

```
GET /api/v1/members
  (sin cookie)
  → AuthGuard.canActivate()
  ← 401 Unauthorized
```

---

## Guard Global

El guard está registrado en `AppModule` mediante el token `APP_GUARD`:

```typescript
// src/app.module.ts
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Module({
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
```

Esto hace que el guard se ejecute en **todos** los endpoints de la aplicación antes de llegar al controller. No hay que decorar los controllers ni registrar el guard en cada módulo.

---

## Cómo Marcar un Endpoint como Público

Importar `@Public()` del módulo auth y aplicarlo al handler o al controller completo:

```typescript
import { Public } from '../../auth/decorators/public.decorator';

@Controller('webhooks')
export class WebhooksController {

  // Solo este endpoint es público
  @Public()
  @Post('stripe')
  async stripeWebhook(@Body() payload: unknown) { ... }

  // Este sigue requiriendo autenticación
  @Get('logs')
  async getLogs() { ... }
}
```

```typescript
// Todo el controller es público
@Public()
@Controller('health')
export class HealthController {
  @Get()
  check() { return { status: 'ok' }; }
}
```

**Regla:** `@Public()` es el **único** mecanismo válido para excluir un endpoint del guard. No modificar la lista de rutas en `main.ts` ni en el guard directamente.

---

## Endpoints Disponibles

| Método | Ruta | Auth requerida | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | No (`@Public`) | Crea un usuario nuevo. `{ email, password }` |
| `POST` | `/api/v1/auth/login` | No (`@Public`) | Valida credenciales, setea cookie `auth`. `{ email, password }` |
| `GET` | `/api/v1/auth/me` | Sí | Devuelve `{ id, email }` del usuario autenticado |
| `POST` | `/api/v1/auth/logout` | Sí | Limpia la cookie `auth` |

### Acceder al usuario autenticado en un controller

El payload del JWT está disponible en `req.user` después de que el guard lo valida:

```typescript
import { JwtPayload } from '../auth/guards/auth.guard';

@Get('mi-perfil')
async miPerfil(@Req() req: Request) {
  const user = req['user'] as JwtPayload;
  // user.sub   → id del usuario
  // user.email → email del usuario
  return { id: user.sub, email: user.email };
}
```

---

## Configuración de la Cookie

| Atributo | Valor | Razón |
|---|---|---|
| `httpOnly` | `true` | Inaccesible para JavaScript — protege contra XSS |
| `secure` | `true` en producción, `false` en desarrollo | HTTPS requerido en producción |
| `sameSite` | `lax` | Frontend y backend comparten hostname (same-site). Permite navegación normal; bloquea requests cross-site iniciados por terceros |
| `path` | `/` | Disponible en todas las rutas del dominio |
| `maxAge` | `86400` (1 día) | Controlado por `JWT_EXPIRES_IN` en el JWT; la cookie expira en sincronía |
