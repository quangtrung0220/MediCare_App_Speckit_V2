import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên bệnh nhân không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  gender: string;

  @IsDateString({}, { message: 'Ngày sinh phải ở định dạng ngày chuẩn ISO YYYY-MM-DD' })
  dateOfBirth: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  allergies?: string;
}
