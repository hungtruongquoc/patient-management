import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Patient } from '../../generated/prisma';

// Type for non-sensitive patient data (HIPAA compliant)
type PatientBasicInfo = Pick<
  Patient,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'dateOfBirth'
  | 'createdAt'
  | 'updatedAt'
>;

@Injectable()
export class PatientService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PatientBasicInfo[]> {
    // Only return non-sensitive fields by default for HIPAA compliance
    return this.prisma.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(
    id: number,
    includeSensitive = false,
  ): Promise<Patient | PatientBasicInfo | null> {
    if (includeSensitive) {
      return this.prisma.patient.findUnique({
        where: { id },
      });
    }

    return this.prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(data: Prisma.PatientCreateInput): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }

  async update(id: number, data: Prisma.PatientUpdateInput): Promise<Patient> {
    return this.prisma.patient.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Patient> {
    return this.prisma.patient.delete({ where: { id } });
  }
}
