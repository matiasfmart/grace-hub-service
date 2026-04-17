# Arquitectura de Reuniones - Documentación Técnica

## Índice
1. [Visión General](#visión-general)
2. [Modelo de Dominio](#modelo-de-dominio)
3. [Discriminador audience_type](#discriminador-audience_type)
4. [Flujo de Capas](#flujo-de-capas)
5. [Casos de Uso](#casos-de-uso)
6. [Relaciones entre Entidades](#relaciones-entre-entidades)
7. [Extensibilidad](#extensibilidad)

---

## Visión General

El módulo de reuniones implementa un sistema unificado para gestionar tanto **reuniones de grupo** (GDI, Área) como **reuniones generales** (por categorías, todos los activos). La arquitectura utiliza un **discriminador `audience_type`** en lugar de tablas separadas, permitiendo:

- Lógica centralizada en un único flujo de código
- Flexibilidad para agregar nuevos tipos de audiencia
- Consultas SQL eficientes con índices parciales
- Mantenibilidad mejorada al evitar duplicación de código

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MÓDULO DE REUNIONES                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐    │
│   │    GDI      │    │    AREA     │    │  BY_CATEGORIES/     │    │
│   │  Meetings   │    │  Meetings   │    │    ALL_ACTIVE       │    │
│   └──────┬──────┘    └──────┬──────┘    └──────────┬──────────┘    │
│          │                  │                      │               │
│          └──────────────────┴──────────────────────┘               │
│                             │                                       │
│                    ┌────────▼────────┐                             │
│                    │  meeting_series │                             │
│                    │ (audience_type) │                             │
│                    └────────┬────────┘                             │
│                             │                                       │
│                    ┌────────▼────────┐                             │
│                    │    meetings     │                             │
│                    │  (instances)    │                             │
│                    └────────┬────────┘                             │
│                             │                                       │
│              ┌──────────────┼──────────────┐                       │
│              ▼              ▼              ▼                       │
│        ┌──────────┐  ┌───────────┐  ┌───────────────┐             │
│        │attendance│  │ meeting_  │  │   meeting_    │             │
│        │          │  │ attendees │  │   types       │             │
│        └──────────┘  └───────────┘  └───────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Modelo de Dominio

### Aggregates

#### MeetingSeries (Aggregate Root)
Representa la plantilla/serie de reuniones recurrentes o únicas.

```typescript
MeetingSeries {
  // Identidad
  id: number
  name: SeriesName (Value Object)
  description: string | null
  
  // Discriminador
  audienceType: AudienceType  // 'gdi' | 'area' | 'by_categories' | 'all_active'
  
  // Foreign Keys condicionales
  gdiId: number | null        // Requerido si audienceType = 'gdi'
  areaId: number | null       // Requerido si audienceType = 'area'
  meetingTypeId: number | null // Requerido si audienceType = 'by_categories'
  
  // Recurrencia
  frequency: MeetingFrequency
  startDate: Date
  endDate: Date | null
  defaultTime: string | null
  defaultLocation: string | null
  
  // Reglas de recurrencia específicas
  oneTimeDate: Date | null           // Para frequency = 'one_time'
  weeklyDays: DayOfWeek[] | null     // Para frequency = 'weekly'
  monthlyRuleType: MonthlyRuleType   // Para frequency = 'monthly'
  monthlyDayOfMonth: number | null
  monthlyWeekOrdinal: WeekOrdinal | null
  monthlyDayOfWeek: DayOfWeek | null
}
```

#### Meeting (Aggregate Root)
Representa una instancia específica (ocurrencia) de una serie.

```typescript
Meeting {
  id: number
  seriesId: number      // FK a meeting_series
  date: Date
  time: string | null   // Override del defaultTime de la serie
  location: string | null // Override del defaultLocation de la serie
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Value Objects

#### SeriesName
Valida que el nombre de la serie no esté vacío y no exceda 255 caracteres.

```typescript
SeriesName {
  value: string
  
  static create(name: string): SeriesName {
    // Validaciones de dominio
  }
}
```

---

## Discriminador audience_type

El campo `audience_type` en `meeting_series` determina **quién debe asistir** a las reuniones:

| audience_type | Descripción | FK Requerida | Audiencia |
|---------------|-------------|--------------|-----------|
| `gdi` | Reunión de GDI | `gdi_id` | Miembros del GDI específico |
| `area` | Reunión de Área Ministerial | `area_id` | Miembros del área específica |
| `by_categories` | Reunión por categorías | `meeting_type_id` | Miembros que coincidan con las categorías configuradas |
| `all_active` | Reunión general | Ninguna | Todos los miembros activos |

### Constraints de Base de Datos

```sql
-- Check constraint para validar coherencia
ALTER TABLE meeting_series ADD CONSTRAINT chk_audience_type_fks CHECK (
  (audience_type = 'gdi' AND gdi_id IS NOT NULL AND area_id IS NULL) OR
  (audience_type = 'area' AND area_id IS NOT NULL AND gdi_id IS NULL) OR
  (audience_type = 'by_categories' AND meeting_type_id IS NOT NULL AND gdi_id IS NULL AND area_id IS NULL) OR
  (audience_type = 'all_active' AND gdi_id IS NULL AND area_id IS NULL)
);
```

### Índices Parciales

```sql
-- Optimización de consultas por tipo de audiencia
CREATE INDEX idx_series_gdi ON meeting_series(gdi_id) WHERE audience_type = 'gdi';
CREATE INDEX idx_series_area ON meeting_series(area_id) WHERE audience_type = 'area';
CREATE INDEX idx_series_meeting_type ON meeting_series(meeting_type_id) WHERE audience_type = 'by_categories';
```

---

## Flujo de Capas

### Clean Architecture en el Módulo de Reuniones

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                           │
│  ┌─────────────────────┐    ┌─────────────────────────────┐    │
│  │ MeetingsController  │    │ MeetingSeriesController     │    │
│  │  - POST /meetings   │    │  - POST /meeting-series     │    │
│  │  - GET /meetings    │    │  - GET /meeting-series      │    │
│  │  - PUT /meetings/:id│    │                             │    │
│  └──────────┬──────────┘    └─────────────┬───────────────┘    │
│             │                             │                     │
│  ┌──────────▼──────────┐    ┌─────────────▼───────────────┐    │
│  │ CreateMeetingDto    │    │ CreateMeetingSeriesDto      │    │
│  │ UpdateMeetingDto    │    │ MeetingSeriesResponseDto    │    │
│  │ MeetingResponseDto  │    │                             │    │
│  └──────────┬──────────┘    └─────────────┬───────────────┘    │
└─────────────┼─────────────────────────────┼─────────────────────┘
              │                             │
┌─────────────▼─────────────────────────────▼─────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                       Commands                           │   │
│  │  CreateMeetingCommand    CreateMeetingSeriesCommand     │   │
│  │  UpdateMeetingCommand                                    │   │
│  │  DeleteMeetingCommand                                    │   │
│  └─────────────────────────┬───────────────────────────────┘   │
│                            │                                    │
│  ┌─────────────────────────▼───────────────────────────────┐   │
│  │                      Use Cases                           │   │
│  │  CreateMeetingUseCase      CreateMeetingSeriesUseCase   │   │
│  │  UpdateMeetingUseCase      GetMeetingByIdUseCase        │   │
│  │  DeleteMeetingUseCase      GetAllMeetingsUseCase        │   │
│  └─────────────────────────┬───────────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                      DOMAIN LAYER                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Aggregates                            │   │
│  │  MeetingSeries                 Meeting                   │   │
│  │   - createForGdi()              - create()               │   │
│  │   - createForArea()             - updateDate()           │   │
│  │   - createByCategories()        - updateTime()           │   │
│  │   - createForAllActive()        - updateLocation()       │   │
│  │   - reconstitute()              - reconstitute()         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Repository Interfaces                       │   │
│  │  IMeetingRepository          IMeetingSeriesRepository   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                   INFRASTRUCTURE LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 TypeORM Entities                         │   │
│  │  MeetingSeriesTypeormEntity    MeetingTypeormEntity      │   │
│  │  MeetingTypeEntity             MeetingAttendeeEntity     │   │
│  │  AttendanceCategoryEntity      MeetingTypeCategoryEntity │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Mappers                               │   │
│  │  MeetingSeriesMapper            MeetingMapper            │   │
│  │   - toDomain()                   - toDomain()            │   │
│  │   - toPersistence()              - toPersistence()       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Repository Implementations                 │   │
│  │  MeetingTypeormRepository    MeetingSeriesTypeormRepo   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Casos de Uso

### 1. Crear Serie de Reuniones (CreateMeetingSeriesUseCase)

**Flujo:**
1. Controller recibe `CreateMeetingSeriesDto`
2. Valida y construye `CreateMeetingSeriesCommand`
3. Use Case valida reglas según `audienceType`
4. Invoca factory method apropiado del aggregate
5. Persiste mediante repository
6. Retorna `MeetingSeriesResponseDto`

```typescript
// src/modules/meetings/application/use-cases/create-meeting-series/create-meeting-series.use-case.ts

async execute(command: CreateMeetingSeriesCommand): Promise<MeetingSeries> {
  const name = SeriesName.create(command.name);
  let series: MeetingSeries;

  switch (command.audienceType) {
    case AudienceType.GDI:
      if (!command.gdiId) throw new BadRequestException('gdiId required');
      series = MeetingSeries.createForGdi(command.gdiId, name, command.frequency, command.startDate, options);
      break;
      
    case AudienceType.AREA:
      if (!command.areaId) throw new BadRequestException('areaId required');
      series = MeetingSeries.createForArea(command.areaId, name, command.frequency, command.startDate, options);
      break;
      
    case AudienceType.BY_CATEGORIES:
      if (!command.meetingTypeId) throw new BadRequestException('meetingTypeId required');
      series = MeetingSeries.createByCategories(command.meetingTypeId, name, command.frequency, command.startDate, options);
      break;
      
    case AudienceType.ALL_ACTIVE:
      series = MeetingSeries.createForAllActive(name, command.frequency, command.startDate, options);
      break;
  }

  return await this.seriesRepository.save(series);
}
```

### 2. Crear Instancia de Reunión (CreateMeetingUseCase)

**Flujo:**
1. Controller recibe `CreateMeetingDto` con `seriesId`
2. Construye `CreateMeetingCommand`
3. Use Case crea instancia de `Meeting`
4. Persiste y retorna `MeetingResponseDto`

```typescript
// src/modules/meetings/application/use-cases/create-meeting/create-meeting.use-case.ts

async execute(command: CreateMeetingCommand): Promise<Meeting> {
  const meeting = Meeting.create(command.seriesId, command.date, {
    time: command.time,
    location: command.location,
    notes: command.notes,
  });
  
  return await this.meetingRepository.save(meeting);
}
```

### 3. Determinar Asistentes Esperados

La lógica para determinar quién debe asistir varía según `audience_type`:

```typescript
// Pseudocódigo para obtener asistentes esperados
async getExpectedAttendees(seriesId: number): Promise<Member[]> {
  const series = await this.seriesRepository.findById(seriesId);
  
  switch (series.audienceType) {
    case AudienceType.GDI:
      // Miembros del GDI específico
      return await this.memberRepository.findByGdiId(series.gdiId);
      
    case AudienceType.AREA:
      // Miembros del área específica
      return await this.memberRepository.findByAreaId(series.areaId);
      
    case AudienceType.BY_CATEGORIES:
      // Miembros que coincidan con categorías del meeting_type
      const categories = await this.meetingTypeRepo.getCategoriesById(series.meetingTypeId);
      return await this.memberRepository.findByCategories(categories);
      
    case AudienceType.ALL_ACTIVE:
      // Todos los miembros activos
      return await this.memberRepository.findAllActive();
  }
}
```

---

## Relaciones entre Entidades

### Diagrama ER Simplificado

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      gdis       │       │      areas      │       │  meeting_types  │
│                 │       │                 │       │                 │
│ gdi_id (PK)     │       │ area_id (PK)    │       │ meeting_type_id │
│ name            │       │ name            │       │ name            │
│ ...             │       │ ...             │       │ description     │
└────────┬────────┘       └────────┬────────┘       └────────┬────────┘
         │                         │                         │
         │                         │                         │
         │    ┌────────────────────┴───────────────────┐     │
         │    │                                        │     │
         └────┼───────────►┌────────────────────┐◄─────┼─────┘
              │            │   meeting_series   │      │
              │            │                    │      │
              │            │ series_id (PK)     │      │
              │            │ audience_type      │◄─────┘
              │            │ gdi_id (FK)        │
              │            │ area_id (FK)       │
              │            │ meeting_type_id(FK)│
              │            │ frequency          │
              │            │ start_date         │
              │            │ ...                │
              │            └─────────┬──────────┘
              │                      │
              │                      │ 1:N
              │                      ▼
              │            ┌────────────────────┐
              │            │     meetings       │
              │            │                    │
              │            │ meeting_id (PK)    │
              │            │ series_id (FK)     │
              │            │ date               │
              │            │ time               │
              │            │ location           │
              │            │ notes              │
              │            └─────────┬──────────┘
              │                      │
              │                      │ 1:N
              │                      ▼
              │            ┌────────────────────┐
              │            │    attendance      │
              │            │                    │
              │            │ attendance_id (PK) │
              │            │ meeting_id (FK)    │
              │            │ member_id (FK)     │
              │            │ status             │
              │            │ snapshot_*         │
              │            └────────────────────┘
              │
              │
              │            ┌────────────────────┐
              │            │ meeting_attendees  │
              │            │                    │
              │            │ meeting_id (FK)    │
              │            │ member_id (FK)     │
              │            │ invited_at         │
              │            │ (manual overrides) │
              │            └────────────────────┘
              │
              │            ┌────────────────────────┐
              │            │ meeting_type_categories│
              │            │                        │
              │            │ meeting_type_id (FK)   │
              │            │ category_id (FK)       │
              │            └───────────┬────────────┘
              │                        │
              │                        ▼
              │            ┌────────────────────┐
              │            │attendee_categories │
              │            │                    │
              │            │ category_id (PK)   │
              │            │ name               │
              │            │ (area_leader, etc) │
              │            └────────────────────┘
```

### Flujo de Asistencia por Categorías

Para reuniones de tipo `by_categories`:

```
meeting_types ──┬── meeting_type_categories ──┬── attendee_categories
                │                             │
    "Consejo    │     meeting_type_id=1       │    category_id=1
     General"   │     category_id=1           │    "area_leader"
                │     category_id=2           │
                │                             │    category_id=2
                │                             │    "gdi_guide"
```

**Query para obtener miembros:**
```sql
SELECT DISTINCT m.*
FROM members m
JOIN member_roles mr ON m.member_id = mr.member_id
JOIN attendee_categories ac ON mr.category_id = ac.category_id
JOIN meeting_type_categories mtc ON ac.category_id = mtc.category_id
WHERE mtc.meeting_type_id = :meetingTypeId
  AND m.status = 'active';
```

---

## Extensibilidad

### Agregar Nuevo Tipo de Audiencia

1. **Agregar valor al enum:**
```sql
ALTER TYPE audience_type_enum ADD VALUE 'new_type';
```

2. **Actualizar constants:**
```typescript
export enum AudienceType {
  GDI = 'gdi',
  AREA = 'area',
  BY_CATEGORIES = 'by_categories',
  ALL_ACTIVE = 'all_active',
  NEW_TYPE = 'new_type',  // Agregar
}
```

3. **Agregar factory method en aggregate:**
```typescript
public static createForNewType(
  /* parámetros específicos */
  name: SeriesName,
  frequency: MeetingFrequency,
  startDate: Date,
  options?: { ... }
): MeetingSeries {
  return new MeetingSeries(
    // ...
    AudienceType.NEW_TYPE,
    // ...
  );
}
```

4. **Agregar case en use case:**
```typescript
case AudienceType.NEW_TYPE:
  // Validaciones específicas
  series = MeetingSeries.createForNewType(...);
  break;
```

### Agregar Nueva Categoría de Asistente

```sql
INSERT INTO attendee_categories (name) VALUES ('new_category');
```

Luego vincular a meeting_types según necesidad.

---

## Archivos Clave

| Capa | Archivo | Propósito |
|------|---------|-----------|
| Domain | `meeting-series.aggregate.ts` | Aggregate root para series |
| Domain | `meeting.aggregate.ts` | Aggregate root para instancias |
| Domain | `series-name.vo.ts` | Value Object para nombre |
| Application | `create-meeting-series.use-case.ts` | Crear series por tipo |
| Application | `create-meeting.use-case.ts` | Crear instancia |
| Application | `create-meeting-series.command.ts` | Comando con audienceType |
| Infrastructure | `meeting-series.typeorm.entity.ts` | Entity TypeORM |
| Infrastructure | `meeting-series.mapper.ts` | Domain ↔ Persistence |
| Presentation | `create-meeting-series.dto.ts` | Validación entrada |
| Presentation | `meeting-series-response.dto.ts` | Respuesta API |
| Constants | `status.constants.ts` | AudienceType, AttendeeCategory |

---

## Consideraciones de Performance

1. **Índices parciales** en `meeting_series` optimizan consultas por tipo
2. **Snapshots en attendance** evitan JOINs para datos históricos
3. **meeting_attendees** permite override manual sin recalcular cada vez
4. **Lazy loading** en relaciones TypeORM para evitar N+1

---

*Última actualización: Febrero 2026*
