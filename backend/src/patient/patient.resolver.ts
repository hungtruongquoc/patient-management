import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Patient } from './patient.model';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientService } from './patient.service';
import { Patient as PrismaPatient } from '../../generated/prisma';

// Type for non-sensitive patient data (HIPAA compliant)
type PatientBasicInfo = Pick<
  PrismaPatient,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'dateOfBirth'
  | 'createdAt'
  | 'updatedAt'
>;

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient])
  async patients(): Promise<PatientBasicInfo[]> {
    return this.patientService.findAll();
  }

  @Query(() => Patient, { nullable: true })
  async patient(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PatientBasicInfo | null> {
    // Only include sensitive fields if user is authorized (add your guard/logic here)
    return this.patientService.findOne(id, false);
  }

  @Mutation(() => Patient)
  async createPatient(
    @Args('createPatientInput') createPatientInput: CreatePatientInput,
  ): Promise<PrismaPatient> {
    return this.patientService.create(createPatientInput);
  }

  @Mutation(() => Patient, { nullable: true })
  async updatePatient(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePatientInput') updatePatientInput: UpdatePatientInput,
  ): Promise<PrismaPatient | null> {
    const updatedPatient = await this.patientService.update(
      id,
      updatePatientInput,
    );
    return updatedPatient;
  }

  @Mutation(() => Boolean)
  async deletePatient(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    try {
      await this.patientService.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
