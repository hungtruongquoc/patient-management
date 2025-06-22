import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Patient } from './patient.model';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientService } from './patient.service';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient])
  async patients(): Promise<unknown[]> {
    return this.patientService.findAll();
  }

  @Query(() => Patient, { nullable: true })
  async patient(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<unknown | null> {
    // Only include sensitive fields if user is authorized (add your guard/logic here)
    return this.patientService.findOne(id, false);
  }

  @Mutation(() => Patient)
  async createPatient(
    @Args('createPatientInput') createPatientInput: CreatePatientInput,
  ): Promise<unknown> {
    return this.patientService.create(createPatientInput);
  }

  @Mutation(() => Patient, { nullable: true })
  async updatePatient(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePatientInput') updatePatientInput: UpdatePatientInput,
  ): Promise<unknown | null> {
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
