/*
 * Created: 2026-06-24
 * Purpose: Appointment feature module wiring controller, service, and repository.
 * Owner: Quang Trung
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../models/appointment.entity';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../services/appointment.service';
import { AppointmentRepository } from '../services/repositories/appointment.repository';
import { APPOINTMENT_REPOSITORY } from '../services/contracts';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), NotificationModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    { provide: APPOINTMENT_REPOSITORY, useClass: AppointmentRepository },
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
