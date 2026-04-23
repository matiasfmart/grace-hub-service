# Grace Hub Service - Guía de Desarrollo

## 🎯 Estado del Proyecto

✅ **Backend completamente implementado**

Todos los módulos tienen lógica de negocio real: use cases, commands, application services, repositorios TypeORM, DTOs tipados. El backend está listo para producción.

## 📂 Estructura Creada

```
src/
├── main.ts                           # ✅ Bootstrap de la aplicación
├── app.module.ts                     # ✅ Módulo principal
├── core/
│   ├── config/                       # ✅ Configuración de app y database
│   ├── database/
│   │   ├── database.module.ts        # ✅ Conexión TypeORM a PostgreSQL/Neon
│   │   └── postgresql/
│   │       └── base.repository.ts    # ✅ Repositorio base con soporte para SP
│   ├── domain/                       # ✅ Entidades de dominio compartidas
│   └── common/
│       └── constants/                # ✅ Enums y constantes
│
└── modules/
    ├── members/                      # ✅ CRUD completo implementado
    ├── tithes/                       # ✅ CRUD + Batch Upsert implementado
    ├── gdis/                         # ✅ CRUD completo implementado
    ├── areas/                        # ✅ CRUD completo implementado
    ├── meetings/                     # ✅ CRUD completo implementado (meetings + series)
    ├── attendance/                   # ✅ CRUD completo implementado
    ├── roles/                        # ✅ CRUD completo implementado (role-types)
    └── auth/                         # ✅ Autenticación JWT implementada
```

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Neon:

```env
DATABASE_HOST=your-project.neon.tech
DATABASE_PORT=5432
DATABASE_USERNAME=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=grace_hub
DATABASE_SSL=true

# JWT — requerido para autenticación
JWT_SECRET=<valor aleatorio largo, ver .env.example para instrucciones>
JWT_EXPIRES_IN=1d
```

### 2. Ejecutar el schema SQL

Ejecuta el archivo `init-schema.sql` en tu base de datos Neon para crear todas las tablas.

### 3. Iniciar el servidor

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# El servidor estará disponible en:
# http://localhost:3001/api/v1
```

### 4. Crear el primer usuario

Al iniciar, TypeORM crea automáticamente la tabla `users`. Registrá el primer usuario con:

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@gracehub.church", "password": "tu_password_seguro"}'
```

Requisitos: email válido, password mínimo 8 caracteres.

> ⚠️ **Registro en producción:** El endpoint `/auth/register` es público por diseño para poder crear el primer usuario. Una vez que existe al menos un usuario, tenés dos opciones para producción:
>
> **Opción A — Mantenerlo público** (registro abierto): cualquiera puede crear una cuenta. Válido solo si la app tiene registro de usuarios libre.
>
> **Opción B — Hacerlo privado** (registro por invitación): quitarle `@Public()`. A partir de ese momento solo un usuario ya autenticado puede llamarlo (un admin logueado que quiere agregar otro usuario). El primer usuario debe existir de antemano — crearlo con el comando `curl` de arriba antes de restringir el endpoint.

**Alternativa: insertar el primer usuario directo en la base de datos**

Si el endpoint `register` ya está privado o no está disponible, podés crear el usuario directamente con SQL. El password debe estar hasheado con bcrypt (12 rounds) — no se puede insertar el texto plano.

Generá el hash desde Node.js:

```bash
node -e "require('bcrypt').hash('tu_password_seguro', 12).then(h => console.log(h))"
```

Luego insertá el usuario en PostgreSQL:

```sql
INSERT INTO users (email, password_hash)
VALUES ('admin@gracehub.church', '$2b$12$<hash_generado_arriba>');
```

## 📋 Lo que YA está hecho

### ✅ Infraestructura Core
- [x] Conexión a PostgreSQL/Neon configurada
- [x] TypeORM configurado con SSL
- [x] Repositorio base con métodos para Stored Procedures
- [x] Sistema de configuración con variables de entorno
- [x] Validación de DTOs con class-validator
- [x] CORS habilitado para el frontend

### ✅ Módulos Funcionales
- [x] **Members**: CRUD completo
- [x] **Tithes**: GET, POST batch-upsert
- [x] **GDIs**: CRUD completo
- [x] **Areas**: CRUD completo
- [x] **Meetings**: CRUD completo (instancias + series, expected-attendees)
- [x] **Attendance**: GET, POST, POST batch por reunión
- [x] **Roles**: CRUD completo (role-types configurables)
- [x] **Auth**: Registro, login, logout, me (JWT httpOnly cookie)

### ✅ Arquitectura Limpia
- [x] Domain Layer: Entidades de dominio puras
- [x] Application Layer: DTOs y Use Cases
- [x] Infrastructure Layer: TypeORM entities y repositories
- [x] Presentation Layer: Controllers REST

## 🔨 Cómo agregar un nuevo endpoint

Todos los controladores ya tienen su lógica implementada. Para agregar un nuevo endpoint seguí este patrón:

### Ejemplo: Agregar "Get Member by ID"

#### Paso 1: Crear Use Case
```typescript
// src/modules/members/application/use-cases/get-member-by-id.use-case.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from '../../infrastructure/persistence/typeorm/member.repository';
import { Member } from '../../domain/member.entity';

@Injectable()
export class GetMemberByIdUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: number): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }
}
```

#### Paso 2: Registrar en el Módulo
```typescript
// src/modules/members/members.module.ts
import { GetMemberByIdUseCase } from './application/use-cases/get-member-by-id.use-case';

@Module({
  providers: [
    // ... otros providers
    GetMemberByIdUseCase, // ← Agregar aquí
  ],
})
```

#### Paso 3: Usar en el Controller
```typescript
// src/modules/members/members.controller.ts
constructor(
  private readonly getMemberByIdUseCase: GetMemberByIdUseCase, // ← Inyectar
) {}

@Get(':id')
async findOne(@Param('id') id: string) {
  return await this.getMemberByIdUseCase.execute(+id);
}
```

## 🗄️ Cómo usar Stored Procedures

### Crear el SP en PostgreSQL/Neon

```sql
CREATE OR REPLACE FUNCTION sp_get_member_with_roles(p_member_id INTEGER)
RETURNS TABLE(
  member_id INTEGER,
  first_name VARCHAR,
  last_name VARCHAR,
  roles JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.member_id,
    m.first_name,
    m.last_name,
    jsonb_agg(
      jsonb_build_object(
        'role', mr.role_general,
        'context', mr.context_type
      )
    ) as roles
  FROM members m
  LEFT JOIN member_roles mr ON m.member_id = mr.member_id
  WHERE m.member_id = p_member_id
  GROUP BY m.member_id;
END;
$$ LANGUAGE plpgsql;
```

### Llamar al SP desde el Repositorio

```typescript
// En member.repository.ts
async findWithRoles(id: number): Promise<any> {
  const result = await this.executeStoredProcedure<any[]>(
    'sp_get_member_with_roles',
    [id]
  );
  return result[0];
}
```

### Usar en el Use Case

```typescript
@Injectable()
export class GetMemberWithRolesUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(id: number): Promise<any> {
    return await this.memberRepository.findWithRoles(id);
  }
}
```

## 📝 Tareas Pendientes

### 🟡 MEDIA PRIORIDAD

1. **Implementar transacciones complejas**
   - Cambio de guía en GDI (afecta roles)
   - Eliminación de miembro (cascade)
   - Asignación de miembros a áreas/GDIs

2. **Restricción de registro en producción**
   - Quitar `@Public()` de `POST /auth/register` una vez que exista el primer usuario
   - Ver sección "Registro en producción" más arriba

### 🟢 BAJA PRIORIDAD

3. **Implementar tests unitarios**
4. **Implementar tests E2E**
5. **Optimizar queries con índices**
6. ~~**Agregar autenticación JWT**~~ ✅ Implementado (ver [AUTH_ARCHITECTURE.md](../architecture/AUTH_ARCHITECTURE.md))

## 🔒 Cómo Agregar un Endpoint Público

Todos los endpoints del backend requieren autenticación por defecto (guard global en `AppModule`). Para excluir un endpoint, decorarlo con `@Public()`:

```typescript
import { Public } from '../../auth/decorators/public.decorator';

@Controller('webhooks')
export class WebhooksController {
  @Public()          // ← este endpoint no requiere cookie auth
  @Post('stripe')
  async stripeWebhook(@Body() payload: unknown) { ... }
}
```

`@Public()` es el **único** mecanismo válido. No modificar listas en `main.ts` ni en el guard.

Para más detalle, ver [AUTH_ARCHITECTURE.md → Cómo Marcar un Endpoint como Público](../architecture/AUTH_ARCHITECTURE.md#cómo-marcar-un-endpoint-como-público).

---

## 🎨 Patrones de Diseño Aplicados

### Clean Architecture
- **Domain**: Entidades puras, sin dependencias
- **Application**: Casos de uso, DTOs
- **Infrastructure**: TypeORM, PostgreSQL
- **Presentation**: Controllers REST

### Dependency Injection
Todos los repositorios y use cases usan inyección de dependencias de NestJS.

### Repository Pattern
Interfaces en domain, implementaciones en infrastructure.

### DTO Pattern
Validación automática con class-validator y transformación con class-transformer.

## 📚 Recursos Útiles

- [Documentación NestJS](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Neon Documentation](https://neon.tech/docs)

## 🐛 Debugging

### Ver logs de TypeORM

Ya está configurado en desarrollo. Verás todas las queries SQL en la consola.

### Inspeccionar requests

Usa Postman o Thunder Client con:
- Base URL: `http://localhost:3001/api/v1`
- Ejemplo: `GET http://localhost:3001/api/v1/members`

### Errores comunes

1. **Cannot connect to database**
   - Verifica las credenciales en `.env`
   - Asegúrate que `DATABASE_SSL=true`

2. **Module not found**
   - Ejecuta `npm install`
   - Verifica imports relativos

3. **TypeORM error: Entity not found**
   - Verifica que la entidad esté en `*.entity.ts`
   - Verifica que el módulo importe `TypeOrmModule.forFeature([Entity])`

## ✅ Checklist de Desarrollo

Antes de implementar un nuevo endpoint:

- [ ] Crear el DTO si es necesario
- [ ] Crear el Use Case en `application/use-cases/`
- [ ] Registrar el Use Case en el módulo
- [ ] Inyectar el Use Case en el controller
- [ ] Probar el endpoint con Postman
- [ ] Verificar que la validación funcione
- [ ] Documentar si es un endpoint complejo

---

**El proyecto está completamente implementado y listo para producción.** 🚀

Para extender funcionalidad: agregá use cases en `application/use-cases/`, registrá en el módulo, e inyectá en el controller. Para queries complejas podés usar `executeStoredProcedure()` heredado de `BaseRepository`.
