import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../patient/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'patients.db',
      entities: [Patient],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Patient]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {} 