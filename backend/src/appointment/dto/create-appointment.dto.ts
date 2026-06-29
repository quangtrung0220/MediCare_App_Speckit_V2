import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã bệnh nhân không được để trống' })
  patientId: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã bác sĩ không được để trống' })
  doctorId: string;

  @IsDateString({}, { message: 'Ngày hẹn khám phải ở định dạng chuẩn ISO YYYY-MM-DD' })
  appointmentDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Khung giờ khám không được để trống' })
  appointmentTime: string;

  @IsInt()
  @IsOptional()
  durationMinutes?: number;

  @IsEnum(['CONSULTATION', 'FOLLOW_UP', 'EMERGENCY', 'ROUTINE'], {
    message: 'Loại lịch hẹn không hợp lệ (CONSULTATION, FOLLOW_UP, EMERGENCY, ROUTINE)',
  })
  @IsOptional()
  type?: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE';

  @IsEnum(['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW'], {
    message: 'Trạng thái lịch hẹn không hợp lệ (SCHEDULED, CHECKED_IN, COMPLETED, CANCELLED, NO_SHOW)',
  })
  @IsOptional()
  status?: 'SCHEDULED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

  @IsString()
  @IsOptional()
  notes?: string;
}
