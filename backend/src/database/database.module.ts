import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Patient } from '../patient/patient.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get('DATABASE_PATH', 'patients.db'),
        entities: [Patient],
        synchronize: process.env.NODE_ENV !== 'production', // Auto-sync in development
        logging: process.env.NODE_ENV === 'development',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Patient]),
  ],
  providers: [SeederService],
  exports: [TypeOrmModule, SeederService],
})
export class DatabaseModule {}
