import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdatePatientDto {
  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsDateString({}, { message: 'Ngày sinh phải ở định dạng ngày chuẩn ISO YYYY-MM-DD' })
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  allergies?: string;
}
