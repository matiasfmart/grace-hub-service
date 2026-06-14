import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProspectEntity } from './prospect.typeorm.entity';
import { IProspectRepository, ProspectEditableFields } from '../../../domain/repositories/prospect.repository.interface';
import { Prospect, ProspectStatus, ProspectSource } from '../../../domain/prospect.aggregate';
import { GetProspectsFilteredOptions } from '../../../application/use-cases/get-prospects-filtered/get-prospects-filtered.options';

@Injectable()
export class ProspectRepositoryImpl implements IProspectRepository {
  constructor(
    @InjectRepository(ProspectEntity)
    private readonly repository: Repository<ProspectEntity>,
  ) {}

  async save(prospect: Prospect): Promise<Prospect> {
    const entity = this.toEntity(prospect);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: number): Promise<Prospect | null> {
    const qb = this.repository
      .createQueryBuilder('prospect')
      .leftJoin('members', 'm', 'm.member_id = prospect.added_by')
      .addSelect("CONCAT(m.first_name, ' ', m.last_name)", 'addedByName')
      .leftJoin('meeting_series', 'ms', 'ms.series_id = prospect.meeting_series_id')
      .addSelect('ms.name', 'meetingSeriesName')
      .where('prospect.prospect_id = :id', { id });
    const { entities, raw } = await qb.getRawAndEntities();
    if (entities.length === 0) return null;
    const prospect = this.toDomain(entities[0]);
    prospect.addedByName = (raw[0]['addedByName'] as string | null) ?? undefined;
    prospect.meetingSeriesName = (raw[0]['meetingSeriesName'] as string | null) ?? undefined;
    return prospect;
  }

  async findFiltered(options: GetProspectsFilteredOptions): Promise<Prospect[]> {
    const qb = this.repository
      .createQueryBuilder('prospect')
      .leftJoin('members', 'm', 'm.member_id = prospect.added_by')
      .addSelect("CONCAT(m.first_name, ' ', m.last_name)", 'addedByName')
      .leftJoin('meeting_series', 'ms', 'ms.series_id = prospect.meeting_series_id')
      .addSelect('ms.name', 'meetingSeriesName');
    if (options.status !== undefined) {
      qb.where('prospect.status = :status', { status: options.status });
    }
    qb.orderBy('prospect.visit_at', 'DESC').addOrderBy('prospect.created_at', 'DESC');
    const { entities, raw } = await qb.getRawAndEntities();
    return entities.map((entity, i) => {
      const prospect = this.toDomain(entity);
      prospect.addedByName = (raw[i]['addedByName'] as string | null) ?? undefined;
      prospect.meetingSeriesName = (raw[i]['meetingSeriesName'] as string | null) ?? undefined;
      return prospect;
    });
  }

  async countPending(): Promise<number> {
    return this.repository.count({ where: { status: ProspectStatus.PENDING } });
  }

  async update(
    id: number,
    data: Partial<{ status: ProspectStatus; memberId: number }>,
  ): Promise<Prospect> {
    await this.repository.update({ prospectId: id }, data);
    const updated = await this.repository.findOneOrFail({ where: { prospectId: id } });
    return this.toDomain(updated);
  }

  async updateFields(id: number, fields: ProspectEditableFields): Promise<Prospect> {
    const updateData: Record<string, unknown> = {};
    if (fields.firstName !== undefined) updateData['firstName'] = fields.firstName;
    if (fields.lastName !== undefined) updateData['lastName'] = fields.lastName;
    if (fields.contact !== undefined) updateData['contact'] = fields.contact;
    if (fields.notes !== undefined) updateData['notes'] = fields.notes;
    if (fields.visitAt !== undefined) updateData['visitAt'] = fields.visitAt;
    if (fields.meetingSeriesId !== undefined) updateData['meetingSeriesId'] = fields.meetingSeriesId;

    await this.repository.update({ prospectId: id }, updateData);
    const updated = await this.findById(id);
    if (!updated) throw new Error(`Prospect ${id} not found after update`);
    return updated;
  }

  // ─── Mappers ─────────────────────────────────────────────────────────────────
  private toEntity(prospect: Prospect): ProspectEntity {
    const entity = new ProspectEntity();
    if (prospect.id) entity.prospectId = prospect.id;
    entity.firstName = prospect.firstName;
    entity.lastName = prospect.lastName;
    entity.contact = prospect.contact;
    entity.source = prospect.source;
    entity.addedBy = prospect.addedBy;
    entity.visitAt = prospect.visitAt;
    entity.meetingSeriesId = prospect.meetingSeriesId;
    entity.notes = prospect.notes;
    entity.status = prospect.status;
    entity.memberId = prospect.memberId;
    return entity;
  }

  private toDomain(entity: ProspectEntity): Prospect {
    return Prospect.reconstitute(
      entity.prospectId,
      entity.firstName,
      entity.lastName,
      entity.contact,
      entity.source as ProspectSource,
      entity.addedBy,
      entity.visitAt,
      entity.notes,
      entity.status as ProspectStatus,
      entity.memberId,
      entity.meetingSeriesId,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
