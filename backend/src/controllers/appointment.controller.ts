/*
 * Created: 2026-06-24
 * Purpose: Appointment REST controller exposing CRUD and status transition endpoints (T030).
 * Owner: Quang Trung
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../models/appointment.entity';
import { CreateAppointmentDto } from '../appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointment/dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<{ data: Appointment[]; total: number }> {
    const [data, total] = await Promise.all([
      this.appointmentService.findAll({
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
      }),
      this.appointmentService.count(),
    ]);
    return { data, total };
  }

  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string): Promise<Appointment[]> {
    return this.appointmentService.findByPatient(patientId);
  }

  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId') doctorId: string): Promise<Appointment[]> {
    return this.appointmentService.findByDoctor(doctorId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return this.appointmentService.update(id, data);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.cancel(id);
  }

  @Patch(':id/complete')
  async complete(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentService.complete(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.appointmentService.delete(id);
  }
}
