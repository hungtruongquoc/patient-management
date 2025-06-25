import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Patient } from '../../patient/patient.entity';
import { Repository, Not, FindOptionsWhere } from 'typeorm';
import { Observable } from 'rxjs';
import { CreatePatientInput } from '../../patient/dto/create-patient.input';
import { UpdatePatientInput } from '../../patient/dto/update-patient.input';

interface GraphQLArgs {
  createPatientInput?: CreatePatientInput;
  updatePatientInput?: UpdatePatientInput;
  id?: number;
}

@Injectable()
export class PatientExistenceValidationInterceptor implements NestInterceptor {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const contextObj = GqlExecutionContext.create(context);
    const opArguments = contextObj.getArgs<GraphQLArgs>();

    // Use the arguments to determine operation type
    const isCreateOperation = !!opArguments.createPatientInput;
    const isUpdateOperation = !!opArguments.updatePatientInput;

    if (isCreateOperation && opArguments.createPatientInput) {
      await this.validateCreateOperation(opArguments.createPatientInput);
    } else if (
      isUpdateOperation &&
      opArguments.updatePatientInput &&
      opArguments.id
    ) {
      await this.validateUpdateOperation(
        opArguments.id,
        opArguments.updatePatientInput,
      );
    }

    return next.handle();
  }

  private async validateCreateOperation(
    createPatientInput: CreatePatientInput,
  ) {
    const existingPatient = await this.patientRepository.findOne({
      where: [
        { email: createPatientInput.email },
        { ssn: createPatientInput.ssn },
      ],
    });

    if (existingPatient) {
      throw new ConflictException(
        'Patient with this email or SSN already exists',
      );
    }
  }

  private async validateUpdateOperation(
    id: number,
    updatePatientInput: UpdatePatientInput,
  ) {
    const targetPatient = await this.patientRepository.findOne({
      where: { id },
    });

    if (!targetPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    if (updatePatientInput.email || updatePatientInput.ssn) {
      const whereConditions: FindOptionsWhere<Patient>[] = [];

      if (updatePatientInput.email) {
        whereConditions.push({ email: updatePatientInput.email, id: Not(id) });
      }

      if (updatePatientInput.ssn) {
        whereConditions.push({ ssn: updatePatientInput.ssn, id: Not(id) });
      }

      const conflictingPatient = await this.patientRepository.findOne({
        where: whereConditions,
      });

      if (conflictingPatient) {
        throw new ConflictException(`Patient with SSN or email already exists`);
      }
    }
  }
}
