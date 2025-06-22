import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient as PatientEntity } from './patient.entity';
import {
  Patient,
  CreatePatientInput as SharedCreatePatientInput,
  UpdatePatientInput as SharedUpdatePatientInput,
} from '../../../types';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private patientRepository: Repository<PatientEntity>,
  ) {}

  async create(createPatientInput: SharedCreatePatientInput): Promise<Patient> {
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

  async findOneWithDOB(id: number): Promise<Patient> {
    const patient = await this.patientRepository
      .createQueryBuilder('patient')
      .addSelect('patient.dateOfBirth')
      .where('patient.id = :id', { id })
      .getOne();

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async findAllWithDOB(): Promise<Patient[]> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .addSelect('patient.dateOfBirth')
      .getMany();
  }

  async update(
    id: number,
    updatePatientInput: SharedUpdatePatientInput,
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
