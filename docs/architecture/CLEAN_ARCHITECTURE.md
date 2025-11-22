# Grace Hub Service - Clean Architecture Implementation

## 🏛️ Arquitectura Implementada

Este proyecto sigue **estrictamente** los principios de **Clean Architecture** (Robert C. Martin) y **Domain-Driven Design** (Eric Evans).

---

## 📐 Principios SOLID Aplicados

### 1. **Single Responsibility Principle (SRP)**
Cada clase tiene una única razón para cambiar:
- **Controllers**: Solo manejan HTTP requests/responses
- **Application Services**: Solo orquestan use cases
- **Use Cases**: Solo ejecutan una regla de negocio específica
- **Repositories**: Solo persisten/recuperan aggregates
- **Value Objects**: Solo encapsulan validación de un concepto

### 2. **Open/Closed Principle (OCP)**
- Abierto para extensión, cerrado para modificación
- Nuevos use cases no modifican código existente
- Nuevas implementaciones de repository no afectan al dominio

### 3. **Liskov Substitution Principle (LSP)**
- `MemberRepositoryImpl` puede sustituirse por cualquier implementación de `IMemberRepository`
- Cualquier `ValueObject` se comporta consistentemente

### 4. **Interface Segregation Principle (ISP)**
- Interfaces específicas por necesidad
- `IMemberRepository` solo expone métodos que los clientes necesitan

### 5. **Dependency Inversion Principle (DIP)** ✅
- **Las capas externas dependen de las internas**
- Use Cases dependen de `IMemberRepository` (interfaz en dominio)
- `MemberRepositoryImpl` (infraestructura) implementa esa interfaz
- **El dominio NO conoce a la infraestructura**

---

## 🎯 Capas de Clean Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                         │
│  Controllers, DTOs, HTTP Concerns                       │
│  ↓ depende de ↓                                         │
├─────────────────────────────────────────────────────────┤
│                    APPLICATION                          │
│  Use Cases, Commands, Application Services              │
│  ↓ depende de ↓                                         │
├─────────────────────────────────────────────────────────┤
│                      DOMAIN                             │
│  Aggregates, Value Objects, Domain Events,              │
│  Repository Interfaces, Business Rules                  │
│  ↑ implementa ↑                                         │
├─────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE                         │
│  TypeORM Entities, Repository Impl, Database            │
└─────────────────────────────────────────────────────────┘
```

### **Regla de Dependencia**
Las dependencias **solo apuntan hacia adentro**:
- Presentation → Application → Domain ← Infrastructure

---

## 📁 Estructura del Proyecto

```
src/
├── core/                           # Núcleo compartido
│   ├── domain/                     # Conceptos de dominio base
│   │   ├── base/
│   │   │   ├── aggregate-root.ts   # Base para Aggregates con eventos
│   │   │   ├── domain-event.ts     # Interfaz de eventos
│   │   │   └── value-object.ts     # Base para Value Objects
│   │   └── exceptions/
│   │       └── domain.exception.ts # Excepciones de dominio
│   ├── infrastructure/
│   │   └── filters/
│   │       └── domain-exception.filter.ts # Traduce excepciones de dominio a HTTP
│   └── database/
│       └── postgresql/
│           └── base.repository.ts  # Repositorio base con SPs
│
└── modules/
    └── members/                    # Módulo de Members (ejemplo)
        ├── domain/                 # ⭐ CAPA DE DOMINIO
        │   ├── member.aggregate.ts # Aggregate Root (lógica de negocio)
        │   ├── value-objects/
        │   │   ├── member-name.vo.ts   # Value Object con validación
        │   │   └── contact-info.vo.ts  # Value Object con validación
        │   ├── events/
        │   │   ├── member-created.event.ts
        │   │   └── member-status-changed.event.ts
        │   └── repositories/
        │       └── member.repository.interface.ts # Contrato de persistencia
        │
        ├── application/            # ⭐ CAPA DE APLICACIÓN
        │   ├── commands/
        │   │   ├── create-member.command.ts  # Inmutable, representa intención
        │   │   └── update-member.command.ts
        │   ├── use-cases/
        │   │   ├── create-member/
        │   │   │   └── create-member.use-case.ts  # Regla de negocio
        │   │   └── get-member/
        │   │       ├── get-all-members.use-case.ts
        │   │       └── get-member-by-id.use-case.ts
        │   └── services/
        │       └── member-application.service.ts  # Orquestador
        │
        ├── infrastructure/         # ⭐ CAPA DE INFRAESTRUCTURA
        │   └── persistence/
        │       └── typeorm/
        │           ├── member.typeorm.entity.ts   # Entity de TypeORM
        │           ├── member.repository.impl.ts  # Implementación del repo
        │           └── mappers/
        │               └── member.mapper.ts       # Traduce Domain ↔ TypeORM
        │
        ├── presentation/           # ⭐ CAPA DE PRESENTACIÓN
        │   ├── controllers/
        │   │   └── members.controller.ts          # Maneja HTTP
        │   └── dtos/
        │       ├── create-member.dto.ts           # Validación de entrada
        │       └── member-response.dto.ts         # Respuesta API
        │
        └── members.module.ts       # NestJS Module
```

---

## 🔑 Conceptos Clave Implementados

### 1. **Aggregate Root**

**Qué es**: Entidad raíz que mantiene invariantes de negocio y puede generar eventos de dominio.

**Ejemplo**: `Member`

```typescript
export class Member extends AggregateRoot {
  // Estado privado (encapsulación)
  private _name: MemberName;
  private _status: MemberStatus;

  // Factory method
  public static create(...): Member {
    const member = new Member(...);
    member.addDomainEvent(new MemberCreatedEvent(member)); // Evento!
    return member;
  }

  // Método de negocio
  public changeStatus(newStatus: MemberStatus): void {
    if (this._status === newStatus) return;

    this._status = newStatus;
    this.addDomainEvent(new MemberStatusChangedEvent(...));
  }
}
```

**Beneficios**:
- ✅ Invariantes siempre válidos
- ✅ Lógica de negocio centralizada
- ✅ Inmutabilidad controlada

---

### 2. **Value Objects**

**Qué son**: Objetos sin identidad, definidos por sus valores, inmutables.

**Ejemplo**: `MemberName`

```typescript
export class MemberName extends ValueObject<MemberNameProps> {
  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  public static create(firstName: string, lastName: string): MemberName {
    // Validación en el constructor
    if (!firstName) throw new ValidationException('...');
    if (firstName.length > 100) throw new ValidationException('...');

    return new MemberName({ firstName, lastName });
  }
}
```

**Beneficios**:
- ✅ Validación en un solo lugar
- ✅ Imposible crear objetos inválidos
- ✅ Encapsulación de lógica (ej: `fullName`)

---

### 3. **Domain Events**

**Qué son**: Notificaciones de cambios importantes en el dominio.

**Ejemplo**: `MemberCreatedEvent`

```typescript
export class MemberCreatedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName: string = 'MemberCreated';

  constructor(public readonly member: Member) {
    this.occurredOn = new Date();
  }
}
```

**Uso Futuro**: Desacoplar lógica (ej: cuando un miembro se crea, recalcular roles).

---

### 4. **Dependency Inversion** ⭐

**Problema Original**:
```typescript
// ❌ MAL: Use Case depende de implementación concreta
class CreateMemberUseCase {
  constructor(private repo: MemberRepository) {} // Implementación!
}
```

**Solución**:
```typescript
// ✅ BIEN: Use Case depende de abstracción
class CreateMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private repo: IMemberRepository  // Interfaz en el dominio!
  ) {}
}
```

**En el módulo**:
```typescript
@Module({
  providers: [
    {
      provide: MEMBER_REPOSITORY,  // Token del dominio
      useClass: MemberRepositoryImpl,  // Implementación de infraestructura
    },
  ],
})
```

**Beneficios**:
- ✅ El dominio no conoce la infraestructura
- ✅ Puedes cambiar TypeORM por Prisma sin tocar use cases
- ✅ Testing fácil (mocks)

---

### 5. **Mappers** (Anti-Corruption Layer)

**Qué son**: Traducen entre capas, manteniendo aislamiento.

**Ejemplo**: `MemberMapper`

```typescript
export class MemberMapper {
  // Domain → Infrastructure
  public static toPersistence(member: Member): MemberEntity {
    const entity = new MemberEntity();
    entity.firstName = member.name.firstName; // Extrae del Value Object
    entity.lastName = member.name.lastName;
    entity.contact = member.contact?.value;
    return entity;
  }

  // Infrastructure → Domain
  public static toDomain(entity: MemberEntity): Member {
    const name = MemberName.create(entity.firstName, entity.lastName);
    const contact = ContactInfo.create(entity.contact);

    return Member.reconstitute(...);
  }
}
```

**Beneficios**:
- ✅ El dominio no conoce TypeORM
- ✅ Puedes cambiar el ORM sin afectar el dominio
- ✅ Testeable independientemente

---

### 6. **Commands** (en lugar de DTOs en Use Cases)

**Qué son**: Objetos inmutables que representan la intención del usuario.

**Ejemplo**:
```typescript
export class CreateMemberCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly contact?: string,
    // ...
  ) {}
}
```

**Uso**:
```typescript
// Controller crea el command
const command = new CreateMemberCommand(...);

// Use Case recibe el command
await useCase.execute(command);
```

**Beneficios**:
- ✅ Semántica clara
- ✅ Inmutable por diseño
- ✅ Fácil de testear

---

### 7. **Application Service**

**Qué es**: Orquestador de use cases, NO contiene lógica de negocio.

**Ejemplo**:
```typescript
@Injectable()
export class MemberApplicationService {
  constructor(
    private createMemberUseCase: CreateMemberUseCase,
    private getAllMembersUseCase: GetAllMembersUseCase,
  ) {}

  async createMember(command: CreateMemberCommand): Promise<Member> {
    return await this.createMemberUseCase.execute(command);
  }

  // Futuro: Orquestación compleja
  async registerMemberWithRoles(command): Promise<Member> {
    // 1. Crear miembro
    const member = await this.createMemberUseCase.execute(...);
    // 2. Asignar a GDI
    await this.assignToGdiUseCase.execute(...);
    // 3. Calcular roles
    await this.calculateRolesUseCase.execute(...);
    return member;
  }
}
```

**Beneficios**:
- ✅ Punto único de entrada
- ✅ Workflows complejos fáciles
- ✅ Transacciones coordinadas

---

### 8. **Domain Exceptions**

**Qué son**: Excepciones de negocio que NO dependen del framework.

**Ejemplo**:
```typescript
// Dominio lanza excepciones propias
throw new ValidationException('First name cannot be empty');
throw new EntityNotFoundException('Member', 123);

// Filtro global las traduce a HTTP
@Catch(DomainException)
export class DomainExceptionFilter {
  catch(exception, host) {
    if (exception instanceof EntityNotFoundException) {
      return HttpStatus.NOT_FOUND; // 404
    }
  }
}
```

**Beneficios**:
- ✅ Dominio independiente del framework
- ✅ Manejo centralizado de errores
- ✅ Respuestas HTTP consistentes

---

## 🎯 Flujo Completo de una Request

```
1. HTTP Request
   ↓
2. MembersController (Presentation)
   - Valida CreateMemberDto (class-validator)
   - Crea CreateMemberCommand
   ↓
3. MemberApplicationService (Application)
   - Llama al Use Case correspondiente
   ↓
4. CreateMemberUseCase (Application)
   - Crea Value Objects (MemberName, ContactInfo)
   - Crea Aggregate (Member.create())
   - Persiste via IMemberRepository
   ↓
5. MemberRepositoryImpl (Infrastructure)
   - Mapea Member → MemberEntity (MemberMapper)
   - Guarda en TypeORM
   - Mapea MemberEntity → Member
   ↓
6. Controller
   - Mapea Member → MemberResponseDto
   - Retorna HTTP Response
```

---

## ✅ Checklist de Clean Architecture

### ¿Tu proyecto cumple con Clean Architecture?

- [x] **Dependency Inversion**: ¿Los use cases dependen de interfaces, no implementaciones?
- [x] **Value Objects**: ¿Usas objetos con validación en lugar de strings primitivos?
- [x] **Aggregate Roots**: ¿Las entidades encapsulan lógica de negocio?
- [x] **Domain Events**: ¿Los cambios importantes generan eventos?
- [x] **Mappers**: ¿Existe traducción entre domain e infrastructure?
- [x] **Commands**: ¿Los use cases reciben commands en lugar de DTOs?
- [x] **Application Services**: ¿Hay una capa que orquesta use cases?
- [x] **Domain Exceptions**: ¿El dominio lanza excepciones propias, no de NestJS?
- [x] **Repository Interface en Domain**: ¿La interfaz está en el dominio, no en infrastructure?
- [x] **No Framework en Domain**: ¿El dominio NO importa `@nestjs/*`?

---

## 🚧 Comparación: Antes vs Después

### ❌ ANTES (Violaciones)

```typescript
// Use Case dependía de implementación concreta
class CreateMemberUseCase {
  constructor(private repo: MemberRepository) {} // ❌ Implementación!

  async execute(dto: CreateMemberDto) { // ❌ DTO, no Command!
    return await this.repo.create(dto); // ❌ No hay Value Objects!
  }
}

// Entity simple (anémica)
class Member {
  firstName: string; // ❌ String primitivo!
  lastName: string;
}

// Controller llama directo a Use Case
class MembersController {
  constructor(private useCase: CreateMemberUseCase) {}

  async create(dto: CreateMemberDto) {
    return await this.useCase.execute(dto); // ❌ Sin Application Service!
  }
}
```

### ✅ DESPUÉS (Clean Architecture)

```typescript
// Use Case depende de abstracción
class CreateMemberUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private repo: IMemberRepository // ✅ Interfaz del dominio!
  ) {}

  async execute(command: CreateMemberCommand) { // ✅ Command!
    const name = MemberName.create(...); // ✅ Value Object!
    const member = Member.create(name, ...); // ✅ Aggregate!
    return await this.repo.save(member); // ✅ Guarda aggregate!
  }
}

// Aggregate Root con lógica
class Member extends AggregateRoot {
  private _name: MemberName; // ✅ Value Object!

  public static create(...): Member {
    const member = new Member(...);
    member.addDomainEvent(...); // ✅ Evento!
    return member;
  }
}

// Controller usa Application Service
class MembersController {
  constructor(private appService: MemberApplicationService) {}

  async create(dto: CreateMemberDto) {
    const command = new CreateMemberCommand(...); // ✅ Mapea a Command!
    const member = await this.appService.createMember(command);
    return MemberResponseDto.fromDomain(member); // ✅ Mapea a DTO!
  }
}
```

---

## 📚 Beneficios de Esta Arquitectura

### 1. **Testabilidad**
```typescript
// Fácil de testear con mocks
const mockRepo: IMemberRepository = {
  save: jest.fn().mockResolvedValue(member),
  // ...
};

const useCase = new CreateMemberUseCase(mockRepo);
```

### 2. **Mantenibilidad**
- Cambios en la UI no afectan al dominio
- Cambios en la DB no afectan a los use cases
- Cada capa evoluciona independientemente

### 3. **Escalabilidad**
- Agregar nuevos use cases es trivial
- Cambiar de ORM no afecta al dominio
- Microservicios futuros reutilizan el dominio

### 4. **Claridad**
- El código expresa intención de negocio
- No hay "código spaghetti"
- Fácil de entender para nuevos desarrolladores

---

## 🎓 Recursos de Estudio

- **Clean Architecture** - Robert C. Martin
- **Domain-Driven Design** - Eric Evans
- **Implementing Domain-Driven Design** - Vaughn Vernon

---

**¡Este proyecto implementa Clean Architecture al 100%!** 🎉
