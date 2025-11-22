# Grace Hub Service - Reglas de Arquitectura

> **Documento de referencia rápida**
>
> Este documento contiene las reglas arquitectónicas que DEBEN respetarse en todo momento.
> Para prompts completos de IA, ver [prompts.md](../prompts/prompts.md)

---

## 🎯 Regla de Oro

**Las dependencias SOLO fluyen hacia adentro (hacia el dominio)**

```
Presentation → Application → Domain ← Infrastructure
```

- **Presentation** puede depender de Application
- **Application** puede depender de Domain
- **Infrastructure** puede depender de Domain
- **Domain** NO depende de NADA (solo de sí mismo)

---

## 📋 Reglas por Capa

### Domain Layer

#### ✅ DEBE:
- Contener toda la lógica de negocio
- Usar Aggregate Roots para entidades con invariantes
- Usar Value Objects para conceptos con validación
- Emitir Domain Events en cambios importantes
- Definir Repository Interfaces (contratos)
- Lanzar Domain Exceptions

#### ❌ NO DEBE:
- Importar `@nestjs/*`
- Importar `typeorm`
- Importar ninguna otra capa
- Depender de frameworks
- Conocer detalles de persistencia
- Conocer detalles de HTTP

#### 📁 Estructura:
```
domain/
├── [entity].aggregate.ts
├── value-objects/
│   └── [concept].vo.ts
├── events/
│   └── [entity]-[action].event.ts
├── repositories/
│   └── [entity].repository.interface.ts
└── exceptions/  (si son específicas del módulo)
```

---

### Application Layer

#### ✅ DEBE:
- Orquestar use cases
- Recibir Commands/Queries
- Depender de Repository Interfaces (DIP)
- Coordinar múltiples operaciones
- Manejar transacciones
- Publicar domain events (futuro)

#### ❌ NO DEBE:
- Contener lógica de negocio
- Importar Infrastructure
- Depender de implementaciones concretas
- Validar reglas de negocio (eso es del domain)
- Conocer detalles de HTTP
- Conocer detalles de DB

#### 📁 Estructura:
```
application/
├── commands/
│   └── [action]-[entity].command.ts
├── queries/
│   └── [query]-[entity].query.ts
├── use-cases/
│   └── [action]-[entity]/
│       └── [action]-[entity].use-case.ts
└── services/
    └── [entity]-application.service.ts
```

---

### Infrastructure Layer

#### ✅ DEBE:
- Implementar Repository Interfaces
- Contener detalles de TypeORM
- Mapear Domain ↔ Persistence
- Ejecutar Stored Procedures
- Manejar conexiones a DB

#### ❌ NO DEBE:
- Contener lógica de negocio
- Ser importada por Application
- Exponer TypeORM Entities al exterior
- Depender de Presentation

#### 📁 Estructura:
```
infrastructure/
└── persistence/
    └── typeorm/
        ├── [entity].typeorm.entity.ts
        ├── [entity].repository.impl.ts
        └── mappers/
            └── [entity].mapper.ts
```

---

### Presentation Layer

#### ✅ DEBE:
- Manejar HTTP requests/responses
- Validar entrada HTTP (DTOs)
- Mapear DTOs → Commands
- Mapear Domain → Response DTOs
- Usar Application Services

#### ❌ NO DEBE:
- Contener lógica de negocio
- Llamar directamente a repositories
- Conocer detalles de persistencia
- Importar TypeORM

#### 📁 Estructura:
```
presentation/
├── controllers/
│   └── [entity].controller.ts
└── dtos/
    ├── create-[entity].dto.ts
    └── [entity]-response.dto.ts
```

---

## 🔒 Prohibiciones Absolutas

### 1. Domain NO puede importar:
```typescript
// ❌ PROHIBIDO
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Controller } from '@nestjs/common';
import { MemberRepositoryImpl } from '../../infrastructure/...';

// ✅ PERMITIDO
import { AggregateRoot } from '../../../core/domain/base/aggregate-root';
import { ValueObject } from '../../../core/domain/base/value-object';
```

### 2. Application NO puede importar Infrastructure:
```typescript
// ❌ PROHIBIDO
import { MemberRepositoryImpl } from '../../infrastructure/...';
import { MemberEntity } from '../../infrastructure/...';

// ✅ PERMITIDO
import { IMemberRepository, MEMBER_REPOSITORY } from '../../domain/repositories/...';
```

### 3. Lógica de Negocio SOLO en Domain:
```typescript
// ❌ PROHIBIDO - Lógica en Controller
@Post()
async create(@Body() dto: CreateMemberDto) {
  if (dto.age < 18) throw new Error('Must be adult'); // ❌
}

// ❌ PROHIBIDO - Lógica en Use Case
async execute(command: CreateMemberCommand) {
  if (command.age < 18) throw new Error('Must be adult'); // ❌
}

// ✅ CORRECTO - Lógica en Domain
public static create(age: number, ...): Member {
  if (age < 18) {
    throw new BusinessRuleViolationException('Must be adult'); // ✅
  }
}
```

---

## ✅ Patrones Obligatorios

### 1. Aggregate Root Pattern

```typescript
export class [Entity] extends AggregateRoot {
  // ✅ Propiedades privadas (encapsulación)
  private _property: ValueObject;

  // ✅ Factory method para crear
  public static create(...): [Entity] {
    // Validar
    // Crear
    // Emitir evento
    return entity;
  }

  // ✅ Factory method para reconstituir desde DB
  public static reconstitute(...): [Entity] {
    return new [Entity](...);
  }

  // ✅ Métodos de negocio (NO setters)
  public doSomething(): void {
    // Validar invariantes
    // Modificar estado
    // Emitir evento si corresponde
    this.touch();
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
```

### 2. Value Object Pattern

```typescript
export class [Concept] extends ValueObject<Props> {
  // ✅ Factory method con validación
  public static create(value: string): [Concept] {
    // Validar
    if (!value) throw new ValidationException('...');

    // Crear inmutable
    return new [Concept]({ value });
  }

  // ✅ Getters (NO setters)
  get value(): string {
    return this.props.value;
  }

  // ✅ Constructor privado
  private constructor(props: Props) {
    super(props);
  }
}
```

### 3. Repository Pattern (DIP)

**Interfaz en Domain**:
```typescript
// domain/repositories/[entity].repository.interface.ts
export interface I[Entity]Repository {
  save(entity: [Entity]): Promise<[Entity]>;
  findById(id: number): Promise<[Entity] | null>;
}

export const [ENTITY]_REPOSITORY = Symbol('[ENTITY]_REPOSITORY');
```

**Implementación en Infrastructure**:
```typescript
// infrastructure/persistence/typeorm/[entity].repository.impl.ts
@Injectable()
export class [Entity]RepositoryImpl implements I[Entity]Repository {
  constructor(
    @InjectRepository([Entity]Entity)
    private readonly repo: Repository<[Entity]Entity>,
  ) {}

  async save(domain: [Entity]): Promise<[Entity]> {
    const entity = [Entity]Mapper.toPersistence(domain);
    const saved = await this.repo.save(entity);
    return [Entity]Mapper.toDomain(saved);
  }
}
```

**Uso en Application**:
```typescript
// application/use-cases/...
@Injectable()
export class [Action]UseCase {
  constructor(
    @Inject([ENTITY]_REPOSITORY)
    private readonly repo: I[Entity]Repository, // ✅ Interfaz!
  ) {}
}
```

**Configuración en Module**:
```typescript
@Module({
  providers: [
    {
      provide: [ENTITY]_REPOSITORY,
      useClass: [Entity]RepositoryImpl,
    },
  ],
})
```

### 4. Mapper Pattern

```typescript
export class [Entity]Mapper {
  // Domain → Infrastructure
  public static toPersistence(domain: [Entity]): [Entity]Entity {
    const entity = new [Entity]Entity();
    entity.id = domain.id;
    entity.property = domain.valueObject.value; // Extraer de VO
    return entity;
  }

  // Infrastructure → Domain
  public static toDomain(entity: [Entity]Entity): [Entity] {
    const vo = ValueObject.create(entity.property);
    return [Entity].reconstitute(entity.id, vo, ...);
  }
}
```

### 5. Command Pattern

```typescript
// Inmutable
export class [Action][Entity]Command {
  constructor(
    public readonly field1: Type1,
    public readonly field2: Type2,
  ) {}
}
```

---

## 🧪 Reglas de Testing

### Domain (100% cobertura)
```typescript
// Tests unitarios puros
describe('[Entity] Aggregate', () => {
  it('should create valid entity', () => {
    const entity = [Entity].create(...);
    expect(entity).toBeDefined();
  });

  it('should throw on business rule violation', () => {
    expect(() => [Entity].create(invalid))
      .toThrow(BusinessRuleViolationException);
  });
});
```

### Application (90% cobertura)
```typescript
// Tests con mocks
describe('[Action]UseCase', () => {
  let mockRepo: jest.Mocked<I[Entity]Repository>;

  beforeEach(() => {
    mockRepo = { save: jest.fn() } as any;
  });

  it('should execute successfully', async () => {
    const result = await useCase.execute(command);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
```

### Infrastructure (80% cobertura)
```typescript
// Tests de integración (con DB de test)
describe('[Entity]RepositoryImpl', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = await createTestDataSource();
  });

  it('should persist entity', async () => {
    const saved = await repo.save(entity);
    expect(saved.id).toBeDefined();
  });
});
```

---

## 📊 Checklist de Validación

### Antes de Commit:
```markdown
- [ ] Domain no importa frameworks
- [ ] Application depende de interfaces, no implementaciones
- [ ] Lógica de negocio está en Aggregates/VOs
- [ ] Use Cases solo orquestan
- [ ] Mappers traducen entre capas
- [ ] Repository interface en domain
- [ ] Repository impl en infrastructure
- [ ] Tests cubren domain (100%)
- [ ] No hay regresión (suite completa pasa)
- [ ] Código es portable
```

---

## 🎓 Recursos

- [prompts.md](../prompts/prompts.md) - Prompts completos para IA
- [CLEAN_ARCHITECTURE.md](CLEAN_ARCHITECTURE.md) - Guía detallada
- [DEVELOPMENT_GUIDE.md](../guides/DEVELOPMENT_GUIDE.md) - Guía de desarrollo

---

**Última actualización**: 2024-11-22
**Versión**: 1.0.0
