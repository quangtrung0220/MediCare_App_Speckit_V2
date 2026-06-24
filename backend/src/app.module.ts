import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';

/**
 * AppModule — Root module.
 *
 * Registers all feature modules. DatabaseModule provides TypeORM with
 * env-driven SQLite/PostgreSQL configuration.
 */
@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    PatientModule,
    AppointmentModule,
    // AuthModule will be added when T028 is implemented
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
