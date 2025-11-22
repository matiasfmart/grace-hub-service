export class Meeting {
  meetingId: number;
  seriesId?: number;
  name: string;
  date: Date;
  time?: string;
  location?: string;
  isManual: boolean;
  minute?: string;
  createdAt: Date;
  updatedAt: Date;
}
