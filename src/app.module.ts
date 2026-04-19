import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './core/database/database.module';
import { MembersModule } from './modules/members/members.module';
import { GdisModule } from './modules/gdis/gdis.module';
import { AreasModule } from './modules/areas/areas.module';
import { MeetingsModule } from './modules/meetings/meetings.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { TithesModule } from './modules/tithes/tithes.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database connection
    DatabaseModule,

    // Feature modules
    MembersModule,
    GdisModule,
    AreasModule,
    MeetingsModule,
    AttendanceModule,
    TithesModule,
    RolesModule,
  ],
})
export class AppModule {}
