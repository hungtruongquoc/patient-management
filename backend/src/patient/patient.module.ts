import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientResolver } from './patient.resolver';
import { Patient } from './patient.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), AuthModule],
  providers: [PatientService, PatientResolver],
  exports: [PatientService],
})
export class PatientModule {}
