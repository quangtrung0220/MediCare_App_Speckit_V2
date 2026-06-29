import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsOptional, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsEnum(['development', 'production', 'test'], {
    message: 'NODE_ENV phải là development, production hoặc test',
  })
  NODE_ENV: string;

  @IsNumber({}, { message: 'PORT phải là một số nguyên dương hợp lệ' })
  PORT: number;

  @IsString({ message: 'CORS_ORIGIN phải là một địa chỉ chuỗi URI hợp lệ' })
  CORS_ORIGIN: string;

  @IsEnum(['sqlite', 'postgres'], {
    message: 'DB_TYPE phải là sqlite hoặc postgres',
  })
  DB_TYPE: string;

  @IsString({ message: 'DB_DATABASE phải là đường dẫn hoặc tên CSDL hợp lệ' })
  DB_DATABASE: string;

  @IsNumber({}, { message: 'THROTTLE_TTL phải là số nguyên (mili-giây)' })
  @IsOptional()
  THROTTLE_TTL?: number;

  @IsNumber({}, { message: 'THROTTLE_LIMIT phải là số nguyên (lượt gọi tối đa)' })
  @IsOptional()
  THROTTLE_LIMIT?: number;
}

export function validate(config: Record<string, any>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    console.error('\n========================================================================');
    console.error('❌  LỖI CẤU HÌNH MÔI TRƯỜNG KHỞI ĐỘNG (ENVIRONMENT CONFIGURATION ERROR)');
    console.error('========================================================================');
    console.error('Phát hiện các biến cấu hình trong tệp .env bị thiếu hoặc sai định dạng:');
    
    errors.forEach((err) => {
      const constraints = err.constraints ? Object.values(err.constraints).join(', ') : 'Ràng buộc không xác định';
      console.error(`  - Biến [${err.property}]: ${constraints} (Giá trị nhận được: "${err.value ?? 'NULL'}")`);
    });
    
    console.error('\nHƯỚNG DẪN KHẮC PHỤC CHO NGƯỜI CÀI ĐẶT (INSTALLATION INSTRUCTIONS):');
    console.error('  1. Mở tệp .env ở thư mục gốc của backend (hoặc kiểm tra các biến môi trường hệ thống).');
    console.error('  2. Đối chiếu với tệp mẫu .env.example để sửa lại các giá trị cấu hình tương ứng.');
    console.error('  3. Lưu tệp cấu hình và khởi động lại dự án.');
    console.error('========================================================================\n');

    process.exit(1);
  }
  return validatedConfig;
}
