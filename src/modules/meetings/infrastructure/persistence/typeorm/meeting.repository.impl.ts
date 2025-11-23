import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MeetingEntity } from './meeting.typeorm.entity';
import { IMeetingRepository } from '../../../domain/repositories/meeting.repository.interface';
import { Meeting } from '../../../domain/meeting.aggregate';
import { BaseRepository } from '../../../../../core/database/postgresql/base.repository';
import { MeetingMapper } from './mappers/meeting.mapper';

@Injectable()
export class MeetingRepositoryImpl
  extends BaseRepository<MeetingEntity>
  implements IMeetingRepository
{
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingRepository: Repository<MeetingEntity>,
    dataSource: DataSource,
  ) {
    super(meetingRepository, dataSource);
  }

  async save(meeting: Meeting): Promise<Meeting> {
    const entity = MeetingMapper.toPersistence(meeting);
    const savedEntity = await this.meetingRepository.save(entity);
    return MeetingMapper.toDomain(savedEntity);
  }

  async findById(id: number): Promise<Meeting | null> {
    const entity = await this.meetingRepository.findOne({
      where: { meetingId: id },
    });
    return entity ? MeetingMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Meeting[]> {
    const entities = await this.meetingRepository.find();
    return MeetingMapper.toDomainArray(entities);
  }

  async delete(id: number): Promise<void> {
    await this.meetingRepository.delete(id);
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.meetingRepository.count({
      where: { meetingId: id },
    });
    return count > 0;
  }
}
