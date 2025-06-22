import { Module } from '@nestjs/common';
import { PatientResolver } from './patient.resolver';
import { PatientService } from './patient.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PatientResolver, PatientService],
})
export class PatientModule {}
