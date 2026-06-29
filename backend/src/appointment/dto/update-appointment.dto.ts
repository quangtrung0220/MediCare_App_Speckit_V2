import { IsString, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsString()
  @IsOptional()
  patientId?: string;

  @IsString()
  @IsOptional()
  doctorId?: string;

  @IsDateString({}, { message: 'Ngày hẹn khám phải ở định dạng chuẩn ISO YYYY-MM-DD' })
  @IsOptional()
  appointmentDate?: string;

  @IsString()
  @IsOptional()
  appointmentTime?: string;

  @IsInt()
  @IsOptional()
  durationMinutes?: number;

  @IsEnum(['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'ROUTINE'], {
    message: 'Loại lịch hẹn không hợp lệ',
  })
  @IsOptional()
  type?: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE';

  @IsEnum(['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'], {
    message: 'Trạng thái lịch hẹn không hợp lệ',
  })
  @IsOptional()
  status?: 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

  @IsString()
  @IsOptional()
  notes?: string;
}
