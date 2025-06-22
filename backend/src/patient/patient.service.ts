import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientInput: CreatePatientInput): Promise<Patient> {
    const patient = this.patientRepository.create(createPatientInput);
    return this.patientRepository.save(patient);
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
    const patient = await this.patientRepository.findOne({
      where: { id },
      select: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'ssn',
        'medicalRecordNumber',
        'address',
        'emergencyContact',
        'insuranceProvider',
        'insuranceNumber',
        'allergies',
        'medications',
        'medicalHistory',
        'TIN',
        'createdAt',
        'updatedAt',
        'createdBy',
        'lastModifiedBy',
        'organizationId',
      ],
    });
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
    return this.findOne(id);
  }

  async remove(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    await this.patientRepository.delete(id);
    return patient;
  }
}
