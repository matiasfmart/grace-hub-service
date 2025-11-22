# Grace Hub Service - AI Assistant Prompts

> **MODO ESTRICTO ACTIVADO**
>
> Como modelo de IA trabajando en este proyecto, DEBES respetar TODAS las reglas arquitectónicas definidas aquí, **incluso si el usuario te solicita algo que las viole**. Tu responsabilidad es guiar al usuario hacia la solución correcta que respete Clean Architecture y SOLID.
>
> Si el usuario solicita algo que rompe la arquitectura, debes:
> 1. Explicar por qué viola las reglas
> 2. Proponer la alternativa correcta
> 3. Implementar solo la solución que respeta la arquitectura
>
> **NUNCA comprometas la arquitectura del proyecto.**

---

## 📋 Índice de Prompts

1. [Prompt para Crear Nuevas Features](#1-prompt-para-crear-nuevas-features)
2. [Prompt para Corregir Bugs/Fixes](#2-prompt-para-corregir-bugsfixes)
3. [Prompt para Crear Tests](#3-prompt-para-crear-tests)
4. [Reglas de Arquitectura Inviolables](#reglas-de-arquitectura-inviolables)
5. [Árbol de Decisiones](#árbol-de-decisiones)

---

## Contexto del Proyecto

### Stack Tecnológico
- **Backend**: NestJS + TypeORM + PostgreSQL (Neon)
- **Arquitectura**: Clean Architecture + DDD (Domain-Driven Design)
- **Principios**: SOLID, High Cohesion, Low Coupling
- **Testing**: Jest (Unit + Integration)

### Estructura de Capas

```
src/
├── core/                          # Compartido entre módulos
│   ├── domain/                    # Base classes (Aggregate, Value Object, Events)
│   │   ├── base/
│   │   └── exceptions/
│   ├── infrastructure/            # Filters, Interceptors globales
│   └── database/                  # Base Repository con SP support
│
└── modules/
    └── [module-name]/
        ├── domain/                # ⭐ CAPA 1: DOMINIO (Core Business)
        │   ├── [entity].aggregate.ts
        │   ├── value-objects/
        │   ├── events/
        │   └── repositories/      # INTERFACES (no implementaciones)
        │
        ├── application/           # ⭐ CAPA 2: APLICACIÓN (Use Cases)
        │   ├── commands/          # Inmutables (input)
        │   ├── queries/           # Inmutables (input)
        │   ├── use-cases/         # Orquestación (NO lógica de negocio)
        │   └── services/          # Application Services (orquestadores)
        │
        ├── infrastructure/        # ⭐ CAPA 3: INFRAESTRUCTURA (Detalles)
        │   └── persistence/
        │       └── typeorm/
        │           ├── [entity].typeorm.entity.ts
        │           ├── [entity].repository.impl.ts
        │           └── mappers/
        │
        ├── presentation/          # ⭐ CAPA 4: PRESENTACIÓN (HTTP)
        │   ├── controllers/
        │   └── dtos/              # Validación de entrada/salida
        │
        └── [module].module.ts     # NestJS Module
```

### Reglas de Dependencia (INVIOLABLES)

```
Presentation → Application → Domain ← Infrastructure
     ↓             ↓            ↑           ↑
Controllers   Use Cases    Interfaces  Repositories
   DTOs       Commands     Aggregates   TypeORM
              Services     V.Objects    Mappers
```

**Regla de Oro**: Las flechas **solo apuntan hacia adentro** (hacia el dominio).

---

## 1. PROMPT PARA CREAR NUEVAS FEATURES

### 📝 Template de Solicitud

```markdown
Necesito implementar la siguiente feature en Grace Hub Service:

[DESCRIPCIÓN DE LA FEATURE]

Requerimientos funcionales:
- [Requerimiento 1]
- [Requerimiento 2]
- ...

Reglas de negocio:
- [Regla 1]
- [Regla 2]
- ...

Entidades involucradas:
- [Entidad 1]
- [Entidad 2]
- ...
```

---

### 🤖 Instrucciones para la IA

Cuando recibas una solicitud de nueva feature, sigue ESTRICTAMENTE este proceso:

#### FASE 1: ANÁLISIS Y PLANIFICACIÓN

**Paso 1.1: Identificar el Módulo**
- ¿Pertenece a un módulo existente (members, tithes, gdis, etc.)?
- ¿Se requiere un módulo nuevo?
- Si es nuevo módulo: usar estructura canónica de Clean Architecture

**Paso 1.2: Identificar la Lógica de Negocio**
Pregúntate:
- ¿Hay reglas de negocio? → Domain (Aggregate/Value Object)
- ¿Hay validaciones de datos? → Value Objects
- ¿Hay invariantes que proteger? → Aggregate Root
- ¿Hay eventos de negocio? → Domain Events

**Paso 1.3: Determinar Capas Afectadas**

Usa esta tabla de decisión:

| Si necesitas... | Entonces crea en... | Capa |
|----------------|---------------------|------|
| Nueva regla de negocio | `domain/[entity].aggregate.ts` | Domain |
| Validar un concepto | `domain/value-objects/*.vo.ts` | Domain |
| Notificar un cambio | `domain/events/*.event.ts` | Domain |
| Definir persistencia | `domain/repositories/*.interface.ts` | Domain |
| Orquestar múltiples operaciones | `application/use-cases/` | Application |
| Recibir input del usuario | `application/commands/` | Application |
| Coordinar use cases | `application/services/` | Application |
| Persistir en DB | `infrastructure/persistence/typeorm/` | Infrastructure |
| Mapear Domain ↔ DB | `infrastructure/persistence/typeorm/mappers/` | Infrastructure |
| Exponer endpoint REST | `presentation/controllers/` | Presentation |
| Validar HTTP request | `presentation/dtos/` | Presentation |

**Paso 1.4: Verificar Dependencias**

ANTES de crear código, verifica:

```
✅ ¿Domain depende solo de sí mismo?
✅ ¿Application depende solo de Domain?
✅ ¿Infrastructure implementa interfaces de Domain?
✅ ¿Presentation depende solo de Application?
❌ ¿Infrastructure depende de Application? → PROHIBIDO
❌ ¿Domain importa TypeORM? → PROHIBIDO
❌ ¿Domain importa NestJS? → PROHIBIDO
```

---

#### FASE 2: IMPLEMENTACIÓN

**Paso 2.1: Empezar por el Dominio**

1. **Crear/Modificar Aggregate Root**
   ```typescript
   // domain/[entity].aggregate.ts
   export class [Entity] extends AggregateRoot {
     private _propertyName: ValueObject;

     // Factory method
     public static create(...): [Entity] {
       // Validar invariantes
       // Crear aggregate
       // Añadir domain event
       return entity;
     }

     // Business methods
     public doSomething(): void {
       // Ejecutar lógica de negocio
       // Validar invariantes
       // Añadir domain event si corresponde
       this.touch();
     }

     private touch(): void {
       this._updatedAt = new Date();
     }
   }
   ```

2. **Crear Value Objects si es necesario**
   ```typescript
   // domain/value-objects/[concept].vo.ts
   export class [ConceptName] extends ValueObject<Props> {
     public static create(...): [ConceptName] {
       // Validar datos
       if (!valid) throw new ValidationException('...');

       return new [ConceptName]({ ... });
     }

     get value(): string {
       return this.props.value;
     }
   }
   ```

3. **Crear Domain Events si hay cambios significativos**
   ```typescript
   // domain/events/[entity]-[action].event.ts
   export class [Entity][Action]Event implements DomainEvent {
     public readonly occurredOn: Date;
     public readonly eventName = '[Entity][Action]';

     constructor(public readonly entity: [Entity]) {
       this.occurredOn = new Date();
     }
   }
   ```

4. **Definir Repository Interface en Domain**
   ```typescript
   // domain/repositories/[entity].repository.interface.ts
   export interface I[Entity]Repository {
     save(entity: [Entity]): Promise<[Entity]>;
     findById(id: number): Promise<[Entity] | null>;
     // ... otros métodos necesarios
   }

   export const [ENTITY]_REPOSITORY = Symbol('[ENTITY]_REPOSITORY');
   ```

**Paso 2.2: Implementar en Application**

1. **Crear Command**
   ```typescript
   // application/commands/[action]-[entity].command.ts
   export class [Action][Entity]Command {
     constructor(
       public readonly field1: Type1,
       public readonly field2: Type2,
       // ... inmutables
     ) {}
   }
   ```

2. **Crear Use Case**
   ```typescript
   // application/use-cases/[action]-[entity]/[action]-[entity].use-case.ts
   @Injectable()
   export class [Action][Entity]UseCase {
     constructor(
       @Inject([ENTITY]_REPOSITORY)
       private readonly repository: I[Entity]Repository,
     ) {}

     async execute(command: [Action][Entity]Command): Promise<[Entity]> {
       // 1. Crear Value Objects
       const vo = ValueObject.create(...);

       // 2. Crear/Modificar Aggregate
       const entity = [Entity].create(vo, ...);

       // 3. Persistir
       const saved = await this.repository.save(entity);

       // 4. (Futuro) Publicar eventos
       // await this.eventBus.publishAll(saved.domainEvents);

       return saved;
     }
   }
   ```

3. **Crear/Actualizar Application Service**
   ```typescript
   // application/services/[entity]-application.service.ts
   @Injectable()
   export class [Entity]ApplicationService {
     constructor(
       private readonly [action]UseCase: [Action][Entity]UseCase,
     ) {}

     async [action](command: [Action][Entity]Command): Promise<[Entity]> {
       return await this.[action]UseCase.execute(command);
     }
   }
   ```

**Paso 2.3: Implementar Infrastructure**

1. **Crear TypeORM Entity**
   ```typescript
   // infrastructure/persistence/typeorm/[entity].typeorm.entity.ts
   @Entity('[table_name]')
   export class [Entity]Entity {
     @PrimaryGeneratedColumn()
     id: number;

     @Column()
     property: string;

     // ... columnas según DB
   }
   ```

2. **Crear Mapper**
   ```typescript
   // infrastructure/persistence/typeorm/mappers/[entity].mapper.ts
   export class [Entity]Mapper {
     public static toPersistence(domain: [Entity]): [Entity]Entity {
       const entity = new [Entity]Entity();
       entity.property = domain.valueObject.value;
       return entity;
     }

     public static toDomain(entity: [Entity]Entity): [Entity] {
       const vo = ValueObject.create(entity.property);
       return [Entity].reconstitute(entity.id, vo, ...);
     }
   }
   ```

3. **Implementar Repository**
   ```typescript
   // infrastructure/persistence/typeorm/[entity].repository.impl.ts
   @Injectable()
   export class [Entity]RepositoryImpl implements I[Entity]Repository {
     constructor(
       @InjectRepository([Entity]Entity)
       private readonly repo: Repository<[Entity]Entity>,
       dataSource: DataSource,
     ) {}

     async save(domain: [Entity]): Promise<[Entity]> {
       const entity = [Entity]Mapper.toPersistence(domain);
       const saved = await this.repo.save(entity);
       return [Entity]Mapper.toDomain(saved);
     }

     // ... otros métodos
   }
   ```

**Paso 2.4: Implementar Presentation**

1. **Crear DTOs**
   ```typescript
   // presentation/dtos/[action]-[entity].dto.ts
   export class [Action][Entity]Dto {
     @IsString()
     @IsNotEmpty()
     field1: string;

     @IsOptional()
     @IsNumber()
     field2?: number;
   }
   ```

2. **Crear Response DTO**
   ```typescript
   // presentation/dtos/[entity]-response.dto.ts
   export class [Entity]ResponseDto {
     id: number;
     property: string;

     static fromDomain(entity: [Entity]): [Entity]ResponseDto {
       const dto = new [Entity]ResponseDto();
       dto.id = entity.id;
       dto.property = entity.valueObject.value;
       return dto;
     }
   }
   ```

3. **Crear/Actualizar Controller**
   ```typescript
   // presentation/controllers/[entity].controller.ts
   @Controller('[entities]')
   export class [Entity]Controller {
     constructor(
       private readonly appService: [Entity]ApplicationService,
     ) {}

     @Post()
     @HttpCode(HttpStatus.CREATED)
     async [action](@Body() dto: [Action][Entity]Dto): Promise<[Entity]ResponseDto> {
       const command = new [Action][Entity]Command(...);
       const entity = await this.appService.[action](command);
       return [Entity]ResponseDto.fromDomain(entity);
     }
   }
   ```

**Paso 2.5: Configurar Module**

```typescript
// [entity].module.ts
@Module({
  imports: [TypeOrmModule.forFeature([[Entity]Entity])],
  controllers: [[Entity]Controller],
  providers: [
    // Application
    [Entity]ApplicationService,
    [Action][Entity]UseCase,

    // Infrastructure (Dependency Inversion)
    {
      provide: [ENTITY]_REPOSITORY,
      useClass: [Entity]RepositoryImpl,
    },
  ],
  exports: [[Entity]ApplicationService],
})
export class [Entity]Module {}
```

---

#### FASE 3: TESTING

**Paso 3.1: Tests del Dominio** (PRIORIDAD MÁXIMA)

```typescript
// domain/[entity].aggregate.spec.ts
describe('[Entity] Aggregate', () => {
  describe('create', () => {
    it('should create valid entity', () => {
      const vo = ValueObject.create('valid');
      const entity = [Entity].create(vo);

      expect(entity).toBeDefined();
      expect(entity.valueObject.value).toBe('valid');
    });

    it('should add domain event when created', () => {
      const entity = [Entity].create(...);

      expect(entity.domainEvents).toHaveLength(1);
      expect(entity.domainEvents[0]).toBeInstanceOf([Entity]CreatedEvent);
    });
  });

  describe('business method', () => {
    it('should enforce business rule', () => {
      const entity = [Entity].create(...);

      expect(() => entity.doInvalidThing()).toThrow(BusinessRuleViolationException);
    });
  });
});
```

**Paso 3.2: Tests de Value Objects**

```typescript
// domain/value-objects/[concept].vo.spec.ts
describe('[Concept] Value Object', () => {
  it('should create valid value object', () => {
    const vo = [Concept].create('valid value');
    expect(vo.value).toBe('valid value');
  });

  it('should throw on invalid input', () => {
    expect(() => [Concept].create('')).toThrow(ValidationException);
  });

  it('should be immutable', () => {
    const vo = [Concept].create('test');
    expect(() => vo['props'].value = 'new').toThrow();
  });
});
```

**Paso 3.3: Tests de Use Cases**

```typescript
// application/use-cases/[action]-[entity].use-case.spec.ts
describe('[Action][Entity] Use Case', () => {
  let useCase: [Action][Entity]UseCase;
  let mockRepository: jest.Mocked<I[Entity]Repository>;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
    } as any;

    useCase = new [Action][Entity]UseCase(mockRepository);
  });

  it('should create entity successfully', async () => {
    const command = new [Action][Entity]Command('test');
    const expectedEntity = [Entity].create(...);
    mockRepository.save.mockResolvedValue(expectedEntity);

    const result = await useCase.execute(command);

    expect(result).toBe(expectedEntity);
    expect(mockRepository.save).toHaveBeenCalledTimes(1);
  });
});
```

---

#### FASE 4: DOCUMENTACIÓN

**Paso 4.1: Documentar en el código**

Cada archivo debe tener:
```typescript
/**
 * [Descripción clara de la responsabilidad]
 *
 * Layer: [Domain/Application/Infrastructure/Presentation]
 *
 * Responsibilities:
 * - [Responsabilidad 1]
 * - [Responsabilidad 2]
 *
 * Dependencies:
 * - [Dependencia 1] (justificación)
 *
 * Business Rules:
 * - [Regla 1]
 */
```

**Paso 4.2: Actualizar README si es feature mayor**

Agregar sección en `docs/guides/DEVELOPMENT_GUIDE.md`:
```markdown
### [Feature Name]

**Descripción**: ...

**Endpoints**:
- `POST /api/v1/[entity]` - ...

**Lógica de Negocio**:
- ...

**Stored Procedures** (si aplica):
- `sp_[action]_[entity]` - ...
```

---

#### FASE 5: VALIDACIÓN FINAL

Antes de entregar la solución, verifica:

```markdown
## Checklist de Arquitectura

### Dominio
- [ ] Aggregate Root tiene lógica de negocio
- [ ] Value Objects validan sus datos
- [ ] Domain Events se generan en cambios importantes
- [ ] Repository Interface está en domain/repositories/
- [ ] NO hay imports de @nestjs/* en domain/
- [ ] NO hay imports de typeorm en domain/

### Aplicación
- [ ] Use Cases solo orquestan
- [ ] Commands son inmutables
- [ ] Use Cases dependen de interfaces (DIP)
- [ ] Application Service coordina use cases

### Infraestructura
- [ ] Repository implementa interfaz de domain
- [ ] Mapper traduce Domain ↔ Infrastructure
- [ ] TypeORM Entity solo tiene anotaciones de DB

### Presentación
- [ ] DTOs validan entrada HTTP
- [ ] Response DTOs mapean desde Domain
- [ ] Controller usa Application Service
- [ ] No hay lógica de negocio en Controller

### Tests
- [ ] Domain tiene tests unitarios
- [ ] Value Objects tienen tests
- [ ] Use Cases tienen tests con mocks
- [ ] Cobertura > 80% en domain

### General
- [ ] Dependency Rule respetada
- [ ] Cada clase tiene una responsabilidad
- [ ] Código es portable (no acoplado a NestJS)
```

---

### 📊 Ejemplo Completo: Feature "Marcar Miembro como Bautizado"

**Solicitud**:
```
Necesito que los miembros puedan ser marcados como bautizados,
registrando la fecha de bautismo.

Reglas de negocio:
- Solo miembros activos pueden ser bautizados
- La fecha de bautismo no puede ser futura
- Debe generarse un evento cuando un miembro es bautizado
```

**Respuesta de la IA**:

#### Análisis:
- **Módulo**: `members` (existente)
- **Lógica de negocio**: Sí (validar status, fecha)
- **Dominio afectado**: `Member` aggregate
- **Evento**: `MemberBaptizedEvent`

#### Implementación:

**1. Domain** (`domain/member.aggregate.ts`):
```typescript
public markAsBaptized(baptismDate: Date): void {
  // Business rule: solo miembros activos
  if (this._status !== MemberStatus.ACTIVE) {
    throw new BusinessRuleViolationException(
      'Only active members can be baptized'
    );
  }

  // Business rule: fecha no futura
  if (baptismDate > new Date()) {
    throw new ValidationException(
      'Baptism date cannot be in the future'
    );
  }

  this._baptismDate = baptismDate;
  this.touch();

  // Domain event
  this.addDomainEvent(new MemberBaptizedEvent(this, baptismDate));
}
```

**2. Domain Event** (`domain/events/member-baptized.event.ts`):
```typescript
export class MemberBaptizedEvent implements DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventName = 'MemberBaptized';

  constructor(
    public readonly member: Member,
    public readonly baptismDate: Date,
  ) {
    this.occurredOn = new Date();
  }
}
```

**3. Application Command** (`application/commands/mark-member-baptized.command.ts`):
```typescript
export class MarkMemberBaptizedCommand {
  constructor(
    public readonly memberId: number,
    public readonly baptismDate: Date,
  ) {}
}
```

**4. Application Use Case**:
```typescript
@Injectable()
export class MarkMemberBaptizedUseCase {
  constructor(
    @Inject(MEMBER_REPOSITORY)
    private readonly repository: IMemberRepository,
  ) {}

  async execute(command: MarkMemberBaptizedCommand): Promise<Member> {
    const member = await this.repository.findById(command.memberId);

    if (!member) {
      throw new EntityNotFoundException('Member', command.memberId);
    }

    member.markAsBaptized(command.baptismDate);

    return await this.repository.save(member);
  }
}
```

**5. Presentation DTO**:
```typescript
export class MarkMemberBaptizedDto {
  @IsDateString()
  baptismDate: string;
}
```

**6. Controller**:
```typescript
@Patch(':id/baptize')
async markAsBaptized(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: MarkMemberBaptizedDto,
): Promise<MemberResponseDto> {
  const command = new MarkMemberBaptizedCommand(
    id,
    new Date(dto.baptismDate)
  );

  const member = await this.appService.markAsBaptized(command);
  return MemberResponseDto.fromDomain(member);
}
```

**7. Tests**:
```typescript
describe('Member.markAsBaptized', () => {
  it('should mark active member as baptized', () => {
    const member = Member.create(...);
    member.changeStatus(MemberStatus.ACTIVE);

    member.markAsBaptized(new Date('2024-01-01'));

    expect(member.baptismDate).toEqual(new Date('2024-01-01'));
  });

  it('should throw if member is not active', () => {
    const member = Member.create(...);

    expect(() => member.markAsBaptized(new Date()))
      .toThrow(BusinessRuleViolationException);
  });

  it('should throw if date is in future', () => {
    const member = Member.create(...);
    member.changeStatus(MemberStatus.ACTIVE);
    const futureDate = new Date('2099-01-01');

    expect(() => member.markAsBaptized(futureDate))
      .toThrow(ValidationException);
  });
});
```

---

## 2. PROMPT PARA CORREGIR BUGS/FIXES

### 📝 Template de Solicitud

```markdown
He encontrado el siguiente bug en Grace Hub Service:

[DESCRIPCIÓN DEL BUG]

Comportamiento actual:
- [Qué está pasando]

Comportamiento esperado:
- [Qué debería pasar]

Pasos para reproducir:
1. [Paso 1]
2. [Paso 2]
3. ...

Error/Stack trace (si aplica):
```
[ERROR LOGS]
```
```

---

### 🤖 Instrucciones para la IA

#### FASE 1: DIAGNÓSTICO

**Paso 1.1: Clasificar el Bug**

```
¿Es un bug de...?

[ ] Lógica de negocio → Revisar domain/
[ ] Validación de datos → Revisar value objects o DTOs
[ ] Persistencia → Revisar repositories/mappers
[ ] Endpoint HTTP → Revisar controllers/DTOs
[ ] Configuración → Revisar .env, modules, main.ts
```

**Paso 1.2: Rastrear la Capa Responsable**

Usa este flowchart:

```
¿El bug ocurre en...?

1. Response HTTP incorrecta
   → Revisar: presentation/dtos/*-response.dto.ts
   → Revisar: mappers/*.mapper.ts

2. Validación de entrada falla
   → Revisar: presentation/dtos/*.dto.ts
   → Revisar: value-objects/*.vo.ts

3. Regla de negocio no se cumple
   → Revisar: domain/*.aggregate.ts
   → Revisar: domain/value-objects/*.vo.ts

4. Datos no se persisten correctamente
   → Revisar: infrastructure/persistence/typeorm/*.repository.impl.ts
   → Revisar: infrastructure/persistence/typeorm/mappers/*.mapper.ts

5. Endpoint no existe/retorna error
   → Revisar: presentation/controllers/*.controller.ts
   → Revisar: *.module.ts (providers)

6. Stored procedure falla
   → Revisar: SQL en base de datos
   → Revisar: repository.impl llamada a executeStoredProcedure
```

**Paso 1.3: Analizar Dependencias**

Antes de hacer el fix:
```
1. ¿El bug está en la capa correcta?
   → Si la lógica de negocio está en controller → MOVER a domain

2. ¿El fix requiere cambiar múltiples capas?
   → Si sí → Listar todas las capas afectadas

3. ¿El fix puede romper otras funcionalidades?
   → Si sí → Identificar qué tests se deben actualizar
```

---

#### FASE 2: CORRECCIÓN

**Paso 2.1: Aislar el Problema**

1. **Crear test que reproduzca el bug** (TDD)
   ```typescript
   // [layer]/[file].spec.ts
   describe('Bug Fix: [descripción]', () => {
     it('should [comportamiento esperado]', () => {
       // Arrange
       const entity = [Entity].create(...);

       // Act & Assert
       expect(() => entity.doSomething()).not.toThrow();
       // o
       expect(entity.property).toBe(expectedValue);
     });
   });
   ```

2. **Verificar que el test falla** (Red)
   ```bash
   npm test -- [file].spec.ts
   ```

**Paso 2.2: Aplicar el Fix en la Capa Correcta**

**Si el bug está en Domain**:
```typescript
// ❌ ANTES (bug)
public changeName(name: string): void {
  this._name = name; // No valida!
}

// ✅ DESPUÉS (fix)
public changeName(name: MemberName): void {
  // Value Object ya valida
  this._name = name;
  this.touch();
}
```

**Si el bug está en Application**:
```typescript
// ❌ ANTES (bug)
async execute(command: Command): Promise<Entity> {
  // No valida que entity existe
  const entity = await this.repo.findById(command.id);
  entity.doSomething(); // Puede ser null!
  return await this.repo.save(entity);
}

// ✅ DESPUÉS (fix)
async execute(command: Command): Promise<Entity> {
  const entity = await this.repo.findById(command.id);

  if (!entity) {
    throw new EntityNotFoundException('Entity', command.id);
  }

  entity.doSomething();
  return await this.repo.save(entity);
}
```

**Si el bug está en Infrastructure**:
```typescript
// ❌ ANTES (bug en mapper)
public static toDomain(entity: EntityORM): Entity {
  return Entity.reconstitute(
    entity.id,
    entity.name, // String primitivo!
    ...
  );
}

// ✅ DESPUÉS (fix)
public static toDomain(entity: EntityORM): Entity {
  const name = MemberName.create(entity.firstName, entity.lastName);
  return Entity.reconstitute(
    entity.id,
    name, // Value Object!
    ...
  );
}
```

**Si el bug está en Presentation**:
```typescript
// ❌ ANTES (bug en DTO)
export class CreateDto {
  @IsString()
  date: string; // Debería validar formato!
}

// ✅ DESPUÉS (fix)
export class CreateDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
```

**Paso 2.3: Verificar que el Test Pasa** (Green)
```bash
npm test -- [file].spec.ts
```

**Paso 2.4: Refactorizar si es Necesario** (Refactor)

Si el fix expone mal diseño:
```typescript
// Código duplicado → Extraer a método privado
// Lógica compleja → Dividir en métodos más pequeños
// Validaciones repetidas → Mover a Value Object
```

---

#### FASE 3: VALIDACIÓN DE EFECTOS COLATERALES

**Paso 3.1: Ejecutar Suite de Tests Completa**
```bash
npm test
```

**Paso 3.2: Verificar que No Se Rompió la Arquitectura**

```markdown
- [ ] ¿El fix está en la capa correcta?
- [ ] ¿Se mantiene Dependency Inversion?
- [ ] ¿No se agregaron imports prohibidos en domain?
- [ ] ¿Los tests siguen siendo unitarios (no dependen de DB)?
```

**Paso 3.3: Verificar Regresión**

```bash
# Ejecutar tests de integración
npm run test:e2e

# Verificar endpoints afectados
# (Postman/Thunder Client)
```

---

#### FASE 4: DOCUMENTACIÓN DEL FIX

**Paso 4.1: Documentar en Commit**
```
fix([module]): [descripción breve del bug]

Problema:
- [Qué estaba mal]

Solución:
- [Qué se cambió]

Capa afectada: [Domain/Application/Infrastructure/Presentation]

Tests añadidos:
- [Test 1]
- [Test 2]

Refs: #[issue-number]
```

**Paso 4.2: Actualizar Tests si Corresponde**

Si el bug reveló falta de cobertura:
```typescript
describe('[Entity] - Edge Cases', () => {
  it('should handle [caso edge descubierto]', () => {
    // Test que previene regresión
  });
});
```

---

### 📊 Ejemplo Completo: Fix "Miembros inactivos pueden ser bautizados"

**Bug Report**:
```
Comportamiento actual:
- Se puede marcar como bautizado un miembro con status "Inactive"

Comportamiento esperado:
- Solo miembros activos pueden ser bautizados
```

**Diagnóstico de la IA**:
```
1. Clasificación: Bug de lógica de negocio
2. Capa afectada: Domain (domain/member.aggregate.ts)
3. Test necesario: domain/member.aggregate.spec.ts
```

**Fix**:

**1. Test que reproduce el bug** (Red):
```typescript
// domain/member.aggregate.spec.ts
describe('Member.markAsBaptized', () => {
  it('should throw if member is not active', () => {
    const member = Member.create(...);
    // member está en status NEW por defecto

    expect(() => member.markAsBaptized(new Date()))
      .toThrow(BusinessRuleViolationException);
  });
});
```

Ejecutar: `npm test -- member.aggregate.spec.ts` → ❌ FALLA (bug confirmado)

**2. Aplicar fix** (Green):
```typescript
// domain/member.aggregate.ts
public markAsBaptized(baptismDate: Date): void {
  // ✅ AGREGAR VALIDACIÓN
  if (this._status !== MemberStatus.ACTIVE) {
    throw new BusinessRuleViolationException(
      'Only active members can be baptized'
    );
  }

  if (baptismDate > new Date()) {
    throw new ValidationException(
      'Baptism date cannot be in the future'
    );
  }

  this._baptismDate = baptismDate;
  this.touch();

  this.addDomainEvent(new MemberBaptizedEvent(this, baptismDate));
}
```

Ejecutar: `npm test -- member.aggregate.spec.ts` → ✅ PASA

**3. Verificar suite completa**:
```bash
npm test
```

✅ Todos los tests pasan, no hay regresión.

**4. Commit**:
```
fix(members): prevent baptizing inactive members

Problema:
- Miembros con status diferente a ACTIVE podían ser bautizados

Solución:
- Agregada validación en Member.markAsBaptized()
- Lanza BusinessRuleViolationException si status != ACTIVE

Capa afectada: Domain

Tests añadidos:
- Member.markAsBaptized should throw if member is not active
```

---

## 3. PROMPT PARA CREAR TESTS

### 📝 Template de Solicitud

```markdown
Necesito tests para:

[MÓDULO/FEATURE/FIX]

Tipo de tests requeridos:
[ ] Unitarios (domain/application)
[ ] Integración (repositories)
[ ] E2E (controllers)

Cobertura esperada:
- [ ] Happy path
- [ ] Edge cases
- [ ] Error handling
```

---

### 🤖 Instrucciones para la IA

#### FASE 1: PLANIFICACIÓN DE TESTS

**Paso 1.1: Identificar Qué Testear**

```
Prioridad de testing (de mayor a menor):

1. 🔴 CRÍTICO - Domain Layer
   → Aggregates
   → Value Objects
   → Business rules
   Cobertura requerida: 100%

2. 🟠 IMPORTANTE - Application Layer
   → Use Cases
   → Commands/Queries validation
   Cobertura requerida: 90%

3. 🟡 DESEABLE - Infrastructure Layer
   → Mappers
   → Repository implementations
   Cobertura requerida: 80%

4. 🟢 OPCIONAL - Presentation Layer
   → Controllers (E2E tests preferidos)
   → DTOs (validación)
   Cobertura requerida: 70%
```

**Paso 1.2: Elegir Tipo de Test**

| Capa | Tipo de Test | Dependencias | Velocidad |
|------|--------------|--------------|-----------|
| Domain | **Unit** | Ninguna | 🚀 Muy rápido |
| Application | **Unit** (con mocks) | Interfaces mockeadas | 🚀 Muy rápido |
| Infrastructure | **Integration** | Base de datos de test | 🐢 Lento |
| Presentation | **E2E** | API completa | 🐢 Muy lento |

**Paso 1.3: Definir Casos de Prueba**

Para cada método/función:
```
1. ✅ Happy Path
   - Input válido → Output esperado

2. ⚠️ Edge Cases
   - Valores límite
   - Campos opcionales null/undefined
   - Arrays vacíos
   - Strings vacíos

3. ❌ Error Cases
   - Input inválido → Exception correcta
   - Violación de reglas de negocio
   - Entity not found
```

---

#### FASE 2: IMPLEMENTACIÓN DE TESTS

**Paso 2.1: Tests de Domain (Aggregate Roots)**

```typescript
// domain/[entity].aggregate.spec.ts

describe('[Entity] Aggregate Root', () => {
  describe('Factory Methods', () => {
    describe('create', () => {
      it('should create valid entity with all required fields', () => {
        // Arrange
        const vo = ValueObject.create('valid');

        // Act
        const entity = [Entity].create(vo, ...);

        // Assert
        expect(entity).toBeDefined();
        expect(entity.id).toBeUndefined(); // No persisted yet
        expect(entity.valueObject).toBe(vo);
      });

      it('should create entity with optional fields as undefined', () => {
        const entity = [Entity].create(required);

        expect(entity.optionalField).toBeUndefined();
      });

      it('should add creation domain event', () => {
        const entity = [Entity].create(...);

        expect(entity.domainEvents).toHaveLength(1);
        expect(entity.domainEvents[0]).toBeInstanceOf([Entity]CreatedEvent);
        expect(entity.domainEvents[0].occurredOn).toBeInstanceOf(Date);
      });
    });

    describe('reconstitute', () => {
      it('should reconstitute entity from persistence', () => {
        const entity = [Entity].reconstitute(
          1, // id from DB
          vo,
          createdAt,
          updatedAt,
        );

        expect(entity.id).toBe(1);
        expect(entity.domainEvents).toHaveLength(0); // No events on reconstitution
      });
    });
  });

  describe('Business Methods', () => {
    describe('[businessMethod]', () => {
      it('should execute business logic successfully', () => {
        // Arrange
        const entity = [Entity].create(...);

        // Act
        entity.[businessMethod](validInput);

        // Assert
        expect(entity.property).toBe(expectedValue);
      });

      it('should update updatedAt timestamp', () => {
        const entity = [Entity].create(...);
        const beforeUpdate = entity.updatedAt;

        // Wait to ensure different timestamp
        jest.useFakeTimers();
        jest.advanceTimersByTime(1000);

        entity.[businessMethod](...);

        expect(entity.updatedAt).not.toBe(beforeUpdate);
        jest.useRealTimers();
      });

      it('should add domain event on state change', () => {
        const entity = [Entity].create(...);
        entity.clearEvents(); // Clear creation event

        entity.[businessMethod](...);

        expect(entity.domainEvents).toHaveLength(1);
        expect(entity.domainEvents[0]).toBeInstanceOf([StateChanged]Event);
      });

      it('should throw on business rule violation', () => {
        const entity = [Entity].create(...);

        expect(() => entity.[businessMethod](invalidInput))
          .toThrow(BusinessRuleViolationException);
        expect(() => entity.[businessMethod](invalidInput))
          .toThrow('Expected error message');
      });

      it('should not change state if validation fails', () => {
        const entity = [Entity].create(...);
        const originalState = entity.property;

        try {
          entity.[businessMethod](invalidInput);
        } catch (e) {
          // Expected
        }

        expect(entity.property).toBe(originalState);
      });
    });
  });

  describe('Invariants', () => {
    it('should maintain invariant [description]', () => {
      const entity = [Entity].create(...);

      // Try to break invariant
      expect(() => entity.breakInvariant()).toThrow();
    });
  });
});
```

**Paso 2.2: Tests de Value Objects**

```typescript
// domain/value-objects/[concept].vo.spec.ts

describe('[Concept] Value Object', () => {
  describe('create', () => {
    it('should create valid value object', () => {
      const vo = [Concept].create('valid value');

      expect(vo).toBeDefined();
      expect(vo.value).toBe('valid value');
    });

    it('should trim whitespace', () => {
      const vo = [Concept].create('  value  ');

      expect(vo.value).toBe('value');
    });

    it('should throw on null input', () => {
      expect(() => [Concept].create(null as any))
        .toThrow(ValidationException);
    });

    it('should throw on undefined input', () => {
      expect(() => [Concept].create(undefined as any))
        .toThrow(ValidationException);
    });

    it('should throw on empty string', () => {
      expect(() => [Concept].create(''))
        .toThrow(ValidationException);
      expect(() => [Concept].create('   '))
        .toThrow(ValidationException);
    });

    it('should throw on string too long', () => {
      const tooLong = 'a'.repeat(101);

      expect(() => [Concept].create(tooLong))
        .toThrow(ValidationException);
      expect(() => [Concept].create(tooLong))
        .toThrow('cannot exceed 100 characters');
    });

    it('should accept string at max length', () => {
      const maxLength = 'a'.repeat(100);

      const vo = [Concept].create(maxLength);

      expect(vo.value).toHaveLength(100);
    });
  });

  describe('equals', () => {
    it('should be equal to value object with same value', () => {
      const vo1 = [Concept].create('test');
      const vo2 = [Concept].create('test');

      expect(vo1.equals(vo2)).toBe(true);
    });

    it('should not be equal to value object with different value', () => {
      const vo1 = [Concept].create('test1');
      const vo2 = [Concept].create('test2');

      expect(vo1.equals(vo2)).toBe(false);
    });

    it('should return false for null', () => {
      const vo = [Concept].create('test');

      expect(vo.equals(null as any)).toBe(false);
    });

    it('should return false for undefined', () => {
      const vo = [Concept].create('test');

      expect(vo.equals(undefined as any)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be immutable', () => {
      const vo = [Concept].create('test');

      expect(() => {
        (vo as any).props.value = 'changed';
      }).toThrow();
    });

    it('should not expose mutable props', () => {
      const vo = [Concept].create('test');

      expect(vo['props']).toBeDefined(); // Props exists
      expect(Object.isFrozen(vo['props'])).toBe(true); // But frozen
    });
  });
});
```

**Paso 2.3: Tests de Use Cases**

```typescript
// application/use-cases/[action]-[entity]/[action]-[entity].use-case.spec.ts

describe('[Action][Entity] Use Case', () => {
  let useCase: [Action][Entity]UseCase;
  let mockRepository: jest.Mocked<I[Entity]Repository>;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    } as any;

    useCase = new [Action][Entity]UseCase(mockRepository);
  });

  describe('execute', () => {
    it('should execute use case successfully', async () => {
      // Arrange
      const command = new [Action][Entity]Command('field1', 123);
      const expectedEntity = [Entity].create(...);
      mockRepository.save.mockResolvedValue(expectedEntity);

      // Act
      const result = await useCase.execute(command);

      // Assert
      expect(result).toBe(expectedEntity);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          // Verificar propiedades del aggregate
        })
      );
    });

    it('should create value objects from command data', async () => {
      const command = new [Action][Entity]Command('valid name');
      mockRepository.save.mockResolvedValue([Entity].create(...));

      await useCase.execute(command);

      // Verificar que se llamó save con aggregate que tiene VOs
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          valueObject: expect.any(ValueObject),
        })
      );
    });

    it('should throw EntityNotFoundException if entity not found', async () => {
      const command = new Update[Entity]Command(999, ...);
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(command))
        .rejects
        .toThrow(EntityNotFoundException);

      await expect(useCase.execute(command))
        .rejects
        .toThrow('Entity with id 999 not found');
    });

    it('should throw ValidationException on invalid command data', async () => {
      const command = new [Action][Entity]Command(''); // Invalid

      // ValidationException thrown by Value Object
      await expect(useCase.execute(command))
        .rejects
        .toThrow(ValidationException);
    });

    it('should propagate domain exceptions', async () => {
      const command = new [Action][Entity]Command(...);
      const entity = [Entity].create(...);
      mockRepository.findById.mockResolvedValue(entity);

      // Simulate business rule violation
      jest.spyOn(entity, 'businessMethod').mockImplementation(() => {
        throw new BusinessRuleViolationException('Rule violated');
      });

      await expect(useCase.execute(command))
        .rejects
        .toThrow(BusinessRuleViolationException);
    });

    it('should not save if validation fails', async () => {
      const command = new [Action][Entity]Command(''); // Invalid

      try {
        await useCase.execute(command);
      } catch (e) {
        // Expected
      }

      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });
});
```

**Paso 2.4: Tests de Mappers**

```typescript
// infrastructure/persistence/typeorm/mappers/[entity].mapper.spec.ts

describe('[Entity] Mapper', () => {
  describe('toPersistence', () => {
    it('should map domain aggregate to TypeORM entity', () => {
      // Arrange
      const vo = ValueObject.create('test');
      const domain = [Entity].reconstitute(1, vo, new Date(), new Date());

      // Act
      const persistence = [Entity]Mapper.toPersistence(domain);

      // Assert
      expect(persistence).toBeInstanceOf([Entity]Entity);
      expect(persistence.id).toBe(1);
      expect(persistence.property).toBe('test'); // Extracted from VO
    });

    it('should handle optional fields', () => {
      const domain = [Entity].create(required); // No optional fields

      const persistence = [Entity]Mapper.toPersistence(domain);

      expect(persistence.optionalField).toBeUndefined();
    });

    it('should extract values from Value Objects', () => {
      const name = MemberName.create('John', 'Doe');
      const member = Member.reconstitute(1, name, ...);

      const persistence = MemberMapper.toPersistence(member);

      expect(persistence.firstName).toBe('John');
      expect(persistence.lastName).toBe('Doe');
    });
  });

  describe('toDomain', () => {
    it('should map TypeORM entity to domain aggregate', () => {
      // Arrange
      const persistence = new [Entity]Entity();
      persistence.id = 1;
      persistence.property = 'test';
      persistence.createdAt = new Date();
      persistence.updatedAt = new Date();

      // Act
      const domain = [Entity]Mapper.toDomain(persistence);

      // Assert
      expect(domain).toBeInstanceOf([Entity]);
      expect(domain.id).toBe(1);
      expect(domain.valueObject).toBeInstanceOf(ValueObject);
      expect(domain.valueObject.value).toBe('test');
    });

    it('should reconstitute with no domain events', () => {
      const persistence = new [Entity]Entity();
      // ... set properties

      const domain = [Entity]Mapper.toDomain(persistence);

      expect(domain.domainEvents).toHaveLength(0);
    });

    it('should create Value Objects from primitive values', () => {
      const persistence = new MemberEntity();
      persistence.firstName = 'John';
      persistence.lastName = 'Doe';

      const domain = MemberMapper.toDomain(persistence);

      expect(domain.name).toBeInstanceOf(MemberName);
      expect(domain.name.firstName).toBe('John');
      expect(domain.name.lastName).toBe('Doe');
    });
  });

  describe('toDomainArray', () => {
    it('should map array of entities', () => {
      const entities = [
        Object.assign(new [Entity]Entity(), { id: 1, property: 'test1' }),
        Object.assign(new [Entity]Entity(), { id: 2, property: 'test2' }),
      ];

      const domainArray = [Entity]Mapper.toDomainArray(entities);

      expect(domainArray).toHaveLength(2);
      expect(domainArray[0].id).toBe(1);
      expect(domainArray[1].id).toBe(2);
    });

    it('should return empty array for empty input', () => {
      const domainArray = [Entity]Mapper.toDomainArray([]);

      expect(domainArray).toEqual([]);
    });
  });
});
```

**Paso 2.5: Tests de Integration (Repository)**

```typescript
// infrastructure/persistence/typeorm/[entity].repository.impl.spec.ts

describe('[Entity] Repository Implementation', () => {
  let repository: [Entity]RepositoryImpl;
  let typeormRepo: Repository<[Entity]Entity>;
  let dataSource: DataSource;

  beforeEach(async () => {
    // Setup in-memory database
    dataSource = await createTestDataSource();
    typeormRepo = dataSource.getRepository([Entity]Entity);
    repository = new [Entity]RepositoryImpl(typeormRepo, dataSource);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  describe('save', () => {
    it('should persist new entity', async () => {
      const domain = [Entity].create(...);

      const saved = await repository.save(domain);

      expect(saved.id).toBeDefined();
      const fromDb = await typeormRepo.findOne({ where: { id: saved.id } });
      expect(fromDb).toBeDefined();
    });

    it('should update existing entity', async () => {
      const domain = [Entity].create(...);
      const saved = await repository.save(domain);

      saved.updateProperty(newValue);
      const updated = await repository.save(saved);

      expect(updated.property).toBe(newValue);
    });
  });

  describe('findById', () => {
    it('should return entity if exists', async () => {
      const created = await repository.save([Entity].create(...));

      const found = await repository.findById(created.id!);

      expect(found).toBeDefined();
      expect(found!.id).toBe(created.id);
    });

    it('should return null if not exists', async () => {
      const found = await repository.findById(999);

      expect(found).toBeNull();
    });
  });

  // ... más tests de integración
});
```

---

#### FASE 3: VERIFICACIÓN DE COBERTURA

**Paso 3.1: Ejecutar Tests con Cobertura**

```bash
npm run test:cov
```

**Paso 3.2: Analizar Reporte**

```
Verificar cobertura mínima:

Domain:       >=100% (Crítico)
Application:  >= 90% (Importante)
Infrastructure: >= 80% (Deseable)
Presentation:   >= 70% (Opcional)

Si no se cumple → Agregar tests faltantes
```

**Paso 3.3: Identificar Código Sin Testear**

```bash
# Ver archivos sin cobertura
npm run test:cov -- --collectCoverageFrom='src/**/*.ts'

# Ver líneas específicas sin cubrir
open coverage/lcov-report/index.html
```

---

### 📊 Ejemplo Completo: Tests para "Mark Member Baptized"

**Solicitud**:
```
Necesito tests completos para la feature "Mark Member Baptized"

Cobertura esperada:
- Domain: 100%
- Application: 100%
- Mappers: 100%
```

**Respuesta de la IA**:

**1. Tests de Domain** (`member.aggregate.spec.ts`):
```typescript
describe('Member.markAsBaptized', () => {
  it('should mark active member as baptized', () => {
    const member = createActiveMember();

    member.markAsBaptized(new Date('2024-01-01'));

    expect(member.baptismDate).toEqual(new Date('2024-01-01'));
  });

  it('should update updatedAt timestamp', () => {
    const member = createActiveMember();
    const before = member.updatedAt;

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-02-01'));

    member.markAsBaptized(new Date('2024-01-01'));

    expect(member.updatedAt.getTime()).toBeGreaterThan(before.getTime());
    jest.useRealTimers();
  });

  it('should add MemberBaptizedEvent', () => {
    const member = createActiveMember();
    member.clearEvents();

    member.markAsBaptized(new Date('2024-01-01'));

    expect(member.domainEvents).toHaveLength(1);
    expect(member.domainEvents[0]).toBeInstanceOf(MemberBaptizedEvent);
    expect(member.domainEvents[0].baptismDate).toEqual(new Date('2024-01-01'));
  });

  it('should throw if member is not active', () => {
    const member = Member.create(...); // Status: NEW

    expect(() => member.markAsBaptized(new Date()))
      .toThrow(BusinessRuleViolationException);
    expect(() => member.markAsBaptized(new Date()))
      .toThrow('Only active members can be baptized');
  });

  it('should throw if date is in future', () => {
    const member = createActiveMember();
    const futureDate = new Date('2099-01-01');

    expect(() => member.markAsBaptized(futureDate))
      .toThrow(ValidationException);
    expect(() => member.markAsBaptized(futureDate))
      .toThrow('Baptism date cannot be in the future');
  });

  it('should accept baptism date as today', () => {
    const member = createActiveMember();
    const today = new Date();

    expect(() => member.markAsBaptized(today)).not.toThrow();
  });

  it('should not change baptismDate if validation fails', () => {
    const member = createActiveMember();

    try {
      member.markAsBaptized(new Date('2099-01-01')); // Future
    } catch (e) {
      // Expected
    }

    expect(member.baptismDate).toBeUndefined();
  });
});

// Helper
function createActiveMember(): Member {
  const name = MemberName.create('John', 'Doe');
  const member = Member.create(name, undefined, MemberStatus.NEW);
  member.changeStatus(MemberStatus.ACTIVE);
  member.clearEvents();
  return member;
}
```

**2. Tests de Application** (`mark-member-baptized.use-case.spec.ts`):
```typescript
describe('MarkMemberBaptizedUseCase', () => {
  let useCase: MarkMemberBaptizedUseCase;
  let mockRepo: jest.Mocked<IMemberRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: jest.fn(),
      save: jest.fn(),
    } as any;

    useCase = new MarkMemberBaptizedUseCase(mockRepo);
  });

  it('should mark member as baptized successfully', async () => {
    const member = createActiveMember();
    const command = new MarkMemberBaptizedCommand(1, new Date('2024-01-01'));
    mockRepo.findById.mockResolvedValue(member);
    mockRepo.save.mockResolvedValue(member);

    const result = await useCase.execute(command);

    expect(result.baptismDate).toEqual(new Date('2024-01-01'));
    expect(mockRepo.save).toHaveBeenCalledWith(member);
  });

  it('should throw if member not found', async () => {
    const command = new MarkMemberBaptizedCommand(999, new Date());
    mockRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(command))
      .rejects
      .toThrow(EntityNotFoundException);
  });

  it('should propagate domain exceptions', async () => {
    const inactiveMember = Member.create(...); // Not active
    const command = new MarkMemberBaptizedCommand(1, new Date());
    mockRepo.findById.mockResolvedValue(inactiveMember);

    await expect(useCase.execute(command))
      .rejects
      .toThrow(BusinessRuleViolationException);
  });
});
```

**3. Tests de Mapper** (si se modificó):
```typescript
describe('MemberMapper - Baptism', () => {
  it('should map baptismDate to persistence', () => {
    const member = createActiveMember();
    member.markAsBaptized(new Date('2024-01-01'));

    const entity = MemberMapper.toPersistence(member);

    expect(entity.baptismDate).toEqual(new Date('2024-01-01'));
  });

  it('should map baptismDate to domain', () => {
    const entity = new MemberEntity();
    entity.baptismDate = new Date('2024-01-01');
    // ... other fields

    const member = MemberMapper.toDomain(entity);

    expect(member.baptismDate).toEqual(new Date('2024-01-01'));
  });
});
```

**Verificación de cobertura**:
```bash
npm run test:cov

# Resultado esperado:
# member.aggregate.ts: 100%
# mark-member-baptized.use-case.ts: 100%
# member.mapper.ts: 100%
```

✅ Cobertura alcanzada.

---

## REGLAS DE ARQUITECTURA INVIOLABLES

### 🚫 Prohibiciones Absolutas

#### 1. Domain NO puede importar:
```typescript
// ❌ PROHIBIDO
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Controller, Get } from '@nestjs/common';

// ✅ PERMITIDO
import { AggregateRoot } from '../../core/domain/base/aggregate-root';
import { ValueObject } from '../../core/domain/base/value-object';
import { DomainEvent } from '../../core/domain/base/domain-event';
```

#### 2. Application NO puede importar de Infrastructure:
```typescript
// ❌ PROHIBIDO
import { MemberRepositoryImpl } from '../infrastructure/...';
import { MemberEntity } from '../infrastructure/...';

// ✅ PERMITIDO
import { IMemberRepository } from '../domain/repositories/...';
import { Member } from '../domain/member.aggregate';
```

#### 3. Nunca poner lógica de negocio en:
```typescript
// ❌ PROHIBIDO
class MemberController {
  async create(dto: CreateMemberDto) {
    // ❌ NO! Validación de negocio en controller
    if (dto.age < 18) throw new Error('Must be adult');
  }
}

class CreateMemberUseCase {
  async execute(command) {
    // ❌ NO! Lógica de negocio en use case
    if (command.age < 18) throw new Error('Must be adult');
  }
}

// ✅ CORRECTO
class Member extends AggregateRoot {
  public static create(...) {
    // ✅ SÍ! Lógica en el dominio
    if (age < 18) throw new BusinessRuleViolationException('Must be adult');
  }
}
```

### ✅ Reglas Obligatorias

1. **Aggregate Roots**:
   - ✅ DEBEN heredar de `AggregateRoot`
   - ✅ DEBEN tener factory methods (`create`, `reconstitute`)
   - ✅ DEBEN encapsular estado (propiedades `private`)
   - ✅ DEBEN validar invariantes en cada método
   - ✅ DEBEN emitir domain events en cambios importantes

2. **Value Objects**:
   - ✅ DEBEN heredar de `ValueObject<T>`
   - ✅ DEBEN ser inmutables
   - ✅ DEBEN validar en el factory method `create`
   - ✅ DEBEN implementar `equals` por valor

3. **Use Cases**:
   - ✅ DEBEN inyectar interfaces (no implementaciones)
   - ✅ DEBEN recibir Commands/Queries
   - ✅ SOLO pueden orquestar (NO lógica de negocio)
   - ✅ DEBEN propagar domain exceptions

4. **Repositories**:
   - ✅ Interface DEBE estar en `domain/repositories/`
   - ✅ Implementación DEBE estar en `infrastructure/`
   - ✅ DEBEN trabajar con Aggregates (no entities de TypeORM)
   - ✅ DEBEN usar Mappers para traducir

5. **Controllers**:
   - ✅ DEBEN validar DTOs (framework-level)
   - ✅ DEBEN mapear DTOs → Commands
   - ✅ DEBEN mapear Domain → Response DTOs
   - ✅ NO deben contener lógica de negocio

---

## ÁRBOL DE DECISIONES

### ¿Dónde poner este código?

```
┌─────────────────────────────────────────────────┐
│ ¿Es una regla de negocio o validación de datos? │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │ SÍ                 │ NO
        ▼                    ▼
┌───────────────────┐  ┌─────────────────────────┐
│ ¿Es sobre un solo │  │ ¿Es coordinación de     │
│ concepto/valor?   │  │ múltiples operaciones?  │
└─────┬─────────────┘  └──────┬──────────────────┘
      │                       │
 ┌────┴────┐            ┌─────┴──────┐
 │ SÍ      │ NO         │ SÍ         │ NO
 ▼         ▼            ▼            ▼
┌──────────────┐  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐
│ Value Object │  │ Aggregate  │  │ Use Case     │  │ ¿Es sobre HTTP?  │
│              │  │ (método de │  │ (application)│  └──────┬───────────┘
│ domain/      │  │  negocio)  │  │              │         │
│ value-       │  │            │  │              │    ┌────┴────┐
│ objects/     │  │ domain/    │  │ application/ │    │ SÍ      │ NO
└──────────────┘  │ *.aggregate│  │ use-cases/   │    ▼         ▼
                  └────────────┘  └──────────────┘ ┌──────┐  ┌─────────┐
                                                    │DTO / │  │ Infra-  │
                                                    │Ctrl  │  │structure│
                                                    │      │  │         │
                                                    │prese │  │infra-   │
                                                    │ntat. │  │struct.  │
                                                    └──────┘  └─────────┘
```

### Ejemplos de Decisiones:

| Pregunta | Respuesta | Capa | Archivo |
|----------|-----------|------|---------|
| "Validar que el email sea válido" | Es validación de un concepto | Domain | `value-objects/email.vo.ts` |
| "Un miembro solo puede bautizarse si está activo" | Es regla de negocio del aggregate | Domain | `member.aggregate.ts` (método) |
| "Crear miembro y asignarlo a un GDI" | Es coordinación de operaciones | Application | `use-cases/register-member.use-case.ts` |
| "Validar que el request tenga todos los campos" | Es validación de entrada HTTP | Presentation | `dtos/create-member.dto.ts` |
| "Guardar en PostgreSQL" | Es detalle de infraestructura | Infrastructure | `*.repository.impl.ts` |

---

## CHECKLIST FINAL ANTES DE ENTREGAR

### Para Nuevas Features:
```markdown
- [ ] Lógica de negocio está en Domain (Aggregate/VO)
- [ ] Use Cases solo orquestan
- [ ] Repository interface en domain/repositories/
- [ ] Repository impl en infrastructure/
- [ ] Mapper traduce Domain ↔ Infrastructure
- [ ] Controller usa Application Service
- [ ] DTOs validan entrada/salida HTTP
- [ ] Domain NO importa framework
- [ ] Application NO importa Infrastructure
- [ ] Tests cubren domain (100%)
- [ ] Tests cubren use cases (90%)
- [ ] Código es portable
- [ ] Documentación actualizada
```

### Para Fixes:
```markdown
- [ ] Test reproduce el bug (Red)
- [ ] Fix en la capa correcta
- [ ] Test pasa (Green)
- [ ] No hay regresión (suite completa pasa)
- [ ] Arquitectura respetada
- [ ] Commit documenta el problema y solución
```

### Para Tests:
```markdown
- [ ] Domain: 100% cobertura
- [ ] Application: >=90% cobertura
- [ ] Tests son unitarios (no dependen de DB)
- [ ] Tests de edge cases incluidos
- [ ] Tests de error handling incluidos
- [ ] Tests son rápidos (<1s cada uno)
```

---

## GLOSARIO DE TÉRMINOS

- **Aggregate Root**: Entidad raíz que mantiene invariantes y puede generar eventos
- **Value Object**: Objeto sin identidad, definido por sus valores, inmutable
- **Domain Event**: Notificación de cambio importante en el dominio
- **Use Case**: Orquestador de lógica de aplicación (NO lógica de negocio)
- **Command**: Objeto inmutable que representa intención del usuario
- **Repository**: Contrato de persistencia (interfaz en domain, impl en infrastructure)
- **Mapper**: Traductor entre domain e infrastructure (Anti-Corruption Layer)
- **DTO**: Objeto de transferencia de datos (validación HTTP)
- **Application Service**: Coordinador de use cases

---

## RECURSOS ADICIONALES

- [CLEAN_ARCHITECTURE.md](../architecture/CLEAN_ARCHITECTURE.md) - Guía completa de la arquitectura
- [DEVELOPMENT_GUIDE.md](../guides/DEVELOPMENT_GUIDE.md) - Guía de desarrollo
- [STORED_PROCEDURES_EXAMPLES.sql](../guides/STORED_PROCEDURES_EXAMPLES.sql) - Ejemplos de SPs

---

**FIN DEL DOCUMENTO DE PROMPTS**

Última actualización: 2024-11-22
Versión: 1.0.0
