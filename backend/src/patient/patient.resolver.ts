import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Patient } from './patient.model';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientService } from './patient.service';
import { Patient as PrismaPatient } from '../../generated/prisma';
import { AppLogger } from '../common/logging/app-logger';

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
    AppLogger.info('Fetching all patients', { operation: 'patients.query' });
    const result = await this.patientService.findAll();
    AppLogger.info('Successfully fetched patients', {
      operation: 'patients.query',
      count: result.length,
    });
    return result;
  }

  @Query(() => Patient, { nullable: true })
  async patient(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<PatientBasicInfo | null> {
    AppLogger.info('Fetching patient by ID', {
      operation: 'patient.query',
      patientId: id,
    });

    // Only include sensitive fields if user is authorized (add your guard/logic here)
    const result = await this.patientService.findOne(id, false);

    if (result) {
      AppLogger.info('Successfully fetched patient', {
        operation: 'patient.query',
        patientId: id,
        patientName: `${result.firstName} ${result.lastName}`,
      });
    } else {
      AppLogger.warn('Patient not found', {
        operation: 'patient.query',
        patientId: id,
      });
    }

    return result;
  }

  @Mutation(() => Patient)
  async createPatient(
    @Args('createPatientInput') createPatientInput: CreatePatientInput,
  ): Promise<PrismaPatient> {
    AppLogger.info('Creating new patient', {
      operation: 'createPatient.mutation',
      patientEmail: createPatientInput.email,
    });

    const result = await this.patientService.create(createPatientInput);

    AppLogger.info('Successfully created patient', {
      operation: 'createPatient.mutation',
      patientId: result.id,
      patientName: `${result.firstName} ${result.lastName}`,
    });

    return result;
  }

  @Mutation(() => Patient, { nullable: true })
  async updatePatient(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePatientInput') updatePatientInput: UpdatePatientInput,
  ): Promise<PrismaPatient | null> {
    AppLogger.info('Updating patient', {
      operation: 'updatePatient.mutation',
      patientId: id,
      updateFields: Object.keys(updatePatientInput),
    });

    const updatedPatient = await this.patientService.update(
      id,
      updatePatientInput,
    );

    if (updatedPatient) {
      AppLogger.info('Successfully updated patient', {
        operation: 'updatePatient.mutation',
        patientId: id,
        patientName: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
      });
    } else {
      AppLogger.warn('Patient not found for update', {
        operation: 'updatePatient.mutation',
        patientId: id,
      });
    }

    return updatedPatient;
  }

  @Mutation(() => Boolean)
  async deletePatient(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    AppLogger.info('Attempting to delete patient', {
      operation: 'deletePatient.mutation',
      patientId: id,
    });

    try {
      await this.patientService.delete(id);
      AppLogger.info('Successfully deleted patient', {
        operation: 'deletePatient.mutation',
        patientId: id,
      });
      return true;
    } catch (error) {
      AppLogger.error('Failed to delete patient', {
        operation: 'deletePatient.mutation',
        patientId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }
}
