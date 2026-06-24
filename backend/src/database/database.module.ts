/*
 * Created: 2026-06-24
 * Purpose: NestJS DatabaseModule that registers TypeORM with env-driven config.
 * Owner: Quang Trung
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { buildDataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => buildDataSourceOptions(),
    }),
  ],
})
export class DatabaseModule {}
