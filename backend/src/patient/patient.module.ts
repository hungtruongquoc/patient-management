import { Module } from '@nestjs/common';
import { PatientResolver } from './patient.resolver';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [PatientResolver],
})
export class PatientModule {} 