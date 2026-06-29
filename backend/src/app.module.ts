import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('THROTTLE_TTL') ? Number(configService.get('THROTTLE_TTL')) : 60000,
          limit: configService.get<number>('THROTTLE_LIMIT') ? Number(configService.get('THROTTLE_LIMIT')) : 100,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
