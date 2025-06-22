import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Patient } from './patient.entity';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { PatientService } from './patient.service';
import { AppLogger } from '../common/logging/app-logger';

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient])
  async patients(): Promise<Patient[]> {
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
  ): Promise<Patient | null> {
    AppLogger.info('Fetching patient by ID', {
      operation: 'patient.query',
      patientId: id,
    });

    try {
      const result = await this.patientService.findOne(id);

      AppLogger.info('Successfully fetched patient', {
        operation: 'patient.query',
        patientId: id,
        patientName: `${result.firstName} ${result.lastName}`,
      });

      return result;
    } catch (error) {
      AppLogger.warn('Patient not found', {
        operation: 'patient.query',
        patientId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  @Query(() => Patient, { nullable: true })
  async patientWithSensitiveData(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Patient | null> {
    AppLogger.info('Fetching patient with sensitive data', {
      operation: 'patientWithSensitiveData.query',
      patientId: id,
    });

    try {
      const result = await this.patientService.findOneWithSensitiveData(id);

      AppLogger.info('Successfully fetched patient with sensitive data', {
        operation: 'patientWithSensitiveData.query',
        patientId: id,
        patientName: `${result.firstName} ${result.lastName}`,
      });

      return result;
    } catch (error) {
      AppLogger.warn('Patient not found for sensitive data access', {
        operation: 'patientWithSensitiveData.query',
        patientId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }

  @Mutation(() => Patient)
  async createPatient(
    @Args('createPatientInput') createPatientInput: CreatePatientInput,
  ): Promise<Patient> {
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
  ): Promise<Patient | null> {
    AppLogger.info('Updating patient', {
      operation: 'updatePatient.mutation',
      patientId: id,
      updateFields: Object.keys(updatePatientInput),
    });

    try {
      const updatedPatient = await this.patientService.update(
        id,
        updatePatientInput,
      );

      AppLogger.info('Successfully updated patient', {
        operation: 'updatePatient.mutation',
        patientId: id,
        patientName: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
      });

      return updatedPatient;
    } catch (error) {
      AppLogger.warn('Patient not found for update', {
        operation: 'updatePatient.mutation',
        patientId: id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
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
      await this.patientService.remove(id);
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
