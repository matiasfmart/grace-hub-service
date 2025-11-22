# Grace Hub Service

> Backend NestJS con **Clean Architecture** para sistema de gestión de iglesia

[![Clean Architecture](https://img.shields.io/badge/architecture-clean-blue)](docs/architecture/CLEAN_ARCHITECTURE.md)
[![TypeScript](https://img.shields.io/badge/typescript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/nestjs-10.0-red)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-neon-green)](https://neon.tech/)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Inicio Rápido](#-inicio-rápido)
- [Arquitectura](#-arquitectura)
- [Documentación](#-documentación)
- [Desarrollo](#-desarrollo)
- [Testing](#-testing)
- [Contribución](#-contribución)

---

## ✨ Características

- ✅ **Clean Architecture** - Desacoplamiento total entre capas
- ✅ **Domain-Driven Design** - Aggregate Roots, Value Objects, Domain Events
- ✅ **SOLID Principles** - Todos los principios aplicados
- ✅ **Dependency Inversion** - Infraestructura depende de dominio
- ✅ **TypeORM + PostgreSQL** - Soporte para stored procedures
- ✅ **Testing Completo** - Unit, Integration, E2E
- ✅ **Portable** - Lógica de negocio independiente del framework

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- PostgreSQL (Neon recomendado)
- npm >= 9

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd grace-hub-service

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Neon

# Ejecutar schema SQL en Neon
# (Ver init-schema.sql)

# Iniciar servidor
npm run start:dev
```

El servidor estará disponible en: `http://localhost:3001/api/v1`

---

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** de forma estricta:

```
Presentation → Application → Domain ← Infrastructure
     ↓             ↓           ↑           ↑
Controllers   Use Cases   Aggregates  Repositories
   DTOs       Commands    V.Objects    TypeORM
              Services      Events      Mappers
```

### Principios Aplicados

- ✅ **Dependency Rule**: Dependencias apuntan hacia adentro
- ✅ **Single Responsibility**: Cada clase tiene una responsabilidad
- ✅ **Open/Closed**: Abierto a extensión, cerrado a modificación
- ✅ **Liskov Substitution**: Subtipos sustituibles
- ✅ **Interface Segregation**: Interfaces específicas
- ✅ **Dependency Inversion**: Depender de abstracciones

### Estructura de Capas

```
src/
├── core/                    # Compartido
│   ├── domain/             # Base classes (Aggregate, VO, Events)
│   ├── infrastructure/     # Filters, Interceptors
│   └── database/           # Base Repository
│
└── modules/
    └── [module]/
        ├── domain/         # 🟦 Business Logic
        ├── application/    # 🟨 Use Cases
        ├── infrastructure/ # 🟩 DB, External Services
        └── presentation/   # 🟪 HTTP Controllers
```

**Ver**: [docs/architecture/CLEAN_ARCHITECTURE.md](docs/architecture/CLEAN_ARCHITECTURE.md)

---

## 📚 Documentación

### Para Desarrolladores

| Documento | Descripción |
|-----------|-------------|
| [CLEAN_ARCHITECTURE.md](docs/architecture/CLEAN_ARCHITECTURE.md) | Guía completa de arquitectura |
| [ARCHITECTURE_RULES.md](docs/architecture/ARCHITECTURE_RULES.md) | Reglas y restricciones |
| [DEVELOPMENT_GUIDE.md](docs/guides/DEVELOPMENT_GUIDE.md) | Guía de desarrollo |
| [STORED_PROCEDURES_EXAMPLES.sql](docs/guides/STORED_PROCEDURES_EXAMPLES.sql) | Ejemplos de SPs |

### Para Asistentes de IA

| Documento | Descripción |
|-----------|-------------|
| [prompts.md](docs/prompts/prompts.md) | Prompts para crear features, fixes, tests |

Este proyecto incluye prompts completos para que modelos de IA (como Claude, GPT-4, etc.) puedan:
- ✅ Crear nuevas features respetando la arquitectura
- ✅ Corregir bugs en la capa correcta
- ✅ Generar tests con 100% de cobertura
- ✅ Mantener SOLID y Clean Architecture

**Ver**: [docs/prompts/prompts.md](docs/prompts/prompts.md)

---

## 💻 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run start:dev       # Inicia con hot-reload

# Build
npm run build           # Compila TypeScript

# Producción
npm run start:prod      # Inicia servidor compilado

# Linting
npm run lint            # Ejecuta ESLint
npm run format          # Formatea código con Prettier

# Testing
npm run test            # Tests unitarios
npm run test:cov        # Tests con cobertura
npm run test:e2e        # Tests E2E
```

### Agregar Nueva Feature

1. **Leer** [docs/prompts/prompts.md](docs/prompts/prompts.md) - Sección "Crear Features"
2. **Empezar por Domain** - Aggregate, Value Objects
3. **Implementar Application** - Use Cases, Commands
4. **Implementar Infrastructure** - Repository, Mapper
5. **Implementar Presentation** - Controller, DTOs
6. **Escribir Tests** - Domain (100%), Application (90%)
7. **Validar** - Checklist de arquitectura

### Reglas de Oro

```typescript
// ❌ NUNCA hagas esto
class MemberController {
  create(dto: CreateDto) {
    if (dto.age < 18) throw new Error('...'); // ❌ Lógica en controller
  }
}

// ✅ SIEMPRE haz esto
class Member extends AggregateRoot {
  public static create(age: number) {
    if (age < 18) throw new BusinessRuleViolationException('...'); // ✅
  }
}
```

**Ver**: [docs/architecture/ARCHITECTURE_RULES.md](docs/architecture/ARCHITECTURE_RULES.md)

---

## 🧪 Testing

### Estrategia de Testing

| Capa | Tipo | Cobertura Mínima | Velocidad |
|------|------|------------------|-----------|
| Domain | Unit | 100% | 🚀 Muy rápido |
| Application | Unit (mocks) | 90% | 🚀 Muy rápido |
| Infrastructure | Integration | 80% | 🐢 Lento |
| Presentation | E2E | 70% | 🐢 Muy lento |

### Ejecutar Tests

```bash
# Tests unitarios (rápidos)
npm test

# Tests con cobertura
npm run test:cov

# Tests de integración
npm run test:e2e

# Modo watch
npm run test:watch
```

### Ejemplo de Test de Domain

```typescript
describe('Member Aggregate', () => {
  it('should create valid member', () => {
    const name = MemberName.create('John', 'Doe');
    const member = Member.create(name);

    expect(member).toBeDefined();
    expect(member.name.fullName).toBe('John Doe');
  });

  it('should throw on business rule violation', () => {
    expect(() => Member.markAsBaptized(inactiveMember))
      .toThrow(BusinessRuleViolationException);
  });
});
```

**Ver**: [docs/prompts/prompts.md#3-prompt-para-crear-tests](docs/prompts/prompts.md#3-prompt-para-crear-tests)

---

## 📦 Módulos Disponibles

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| `members` | Gestión de miembros | ✅ CRUD + Tests |
| `tithes` | Registro de diezmos | ✅ Batch Upsert |
| `gdis` | Grupos de Integración | ✅ CRUD Básico |
| `areas` | Áreas de ministerio | ✅ CRUD Básico |
| `meetings` | Reuniones y series | ⚠️ En desarrollo |
| `attendance` | Registro de asistencia | ⚠️ En desarrollo |
| `roles` | Roles dinámicos | ⚠️ En desarrollo |

---

## 🤝 Contribución

### Workflow

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. **Leer [docs/prompts/prompts.md](docs/prompts/prompts.md)** antes de codear
4. Implementar feature respetando Clean Architecture
5. Escribir tests (100% en domain)
6. Commit con mensaje descriptivo
7. Push a la branch (`git push origin feature/AmazingFeature`)
8. Abrir Pull Request

### Convenciones de Commit

```
feat(module): add new feature
fix(module): fix bug description
refactor(module): refactor description
test(module): add tests for feature
docs: update documentation
```

### Checklist antes de PR

```markdown
- [ ] Lógica de negocio en Domain
- [ ] Use Cases solo orquestan
- [ ] Dependency Inversion respetada
- [ ] Tests cubren domain (100%)
- [ ] Tests cubren application (90%)
- [ ] Suite completa pasa
- [ ] Arquitectura validada
- [ ] Documentación actualizada
```

---

## 📖 Recursos de Aprendizaje

- [Clean Architecture - Robert C. Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [Domain-Driven Design - Eric Evans](https://www.amazon.com/Domain-Driven-Design-Tackling-Complexity-Software/dp/0321125215)
- [Implementing DDD - Vaughn Vernon](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577)
- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)

---

## 📄 Licencia

MIT

---

## 👥 Equipo

Desarrollado con ❤️ por el equipo de Grace Hub

---

## 🆘 Soporte

¿Tienes preguntas? Abre un issue en GitHub o consulta:
- [docs/prompts/prompts.md](docs/prompts/prompts.md) - Para trabajar con IA
- [docs/guides/DEVELOPMENT_GUIDE.md](docs/guides/DEVELOPMENT_GUIDE.md) - Para desarrollo manual
- [docs/architecture/ARCHITECTURE_RULES.md](docs/architecture/ARCHITECTURE_RULES.md) - Para reglas de arquitectura

---

**Última actualización**: 2024-11-22
