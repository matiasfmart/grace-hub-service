import { Meeting } from '../meeting.aggregate';

export interface IMeetingRepository {
  save(meeting: Meeting): Promise<Meeting>;
  findById(id: number): Promise<Meeting | null>;
  findAll(): Promise<Meeting[]>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}

export const MEETING_REPOSITORY = Symbol('MEETING_REPOSITORY');
