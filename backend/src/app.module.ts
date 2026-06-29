import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { DoctorModule } from './doctor/doctor.module';
import { ClinicalModule } from './clinical/clinical.module';
import { InventoryModule } from './inventory/inventory.module';
import { BillingModule } from './billing/billing.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

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
    DoctorModule,
    ClinicalModule,
    InventoryModule,
    BillingModule,
    ReportsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
})
export class AppModule {}
