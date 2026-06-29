import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'Họ không được để trống' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  firstName: string;

  @IsString()
  @IsOptional()
  email?: string;

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
