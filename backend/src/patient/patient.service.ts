import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { AppLogger } from '../common/logging/app-logger';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientInput: CreatePatientInput): Promise<Patient> {
    try {
      const patient = this.patientRepository.create(createPatientInput);
      return this.patientRepository.save(patient);
    } catch (error) {
      AppLogger.error('Failed to create patient', {
        operation: 'create.patient',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error(
        `Failed to create patient: ${(error as Error).message}`,
        {},
      );
    }
  }

  async findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findOneWithSensitiveData(id: number): Promise<Patient> {
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .addSelect('patient.dateOfBirth')
      .addSelect('patient.ssn')
      .where('patient.id = :id', { id })
      .getOne();

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(
    id: number,
    updatePatientInput: UpdatePatientInput,
  ): Promise<Patient> {
    await this.patientRepository.update(id, updatePatientInput);
    return await this.patientRepository
      .createQueryBuilder('patient')
      .addSelect('patient.ssn') // This adds ssn to the default selected fields
      .where('patient.id = :id', { id })
      .getOneOrFail();
  }

  async remove(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    await this.patientRepository.delete(id);
    return patient;
  }
}
