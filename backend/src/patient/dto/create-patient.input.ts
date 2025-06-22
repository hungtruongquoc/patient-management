import { InputType, Field } from '@nestjs/graphql';
import { CreatePatientInput as SharedCreatePatientInput } from '../../../../types';

@InputType()
export class CreatePatientInput implements SharedCreatePatientInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  dateOfBirth: Date;

  @Field()
  ssn: string;

  @Field({ nullable: true })
  medicalRecordNumber?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  emergencyContact?: string;

  @Field({ nullable: true })
  insuranceProvider?: string;

  @Field({ nullable: true })
  insuranceNumber?: string;

  @Field({ nullable: true })
  allergies?: string;

  @Field({ nullable: true })
  medications?: string;

  @Field({ nullable: true })
  medicalHistory?: string;

  @Field({ nullable: true })
  TIN?: string;

  @Field({ nullable: true })
  createdBy?: string;

  @Field({ nullable: true })
  lastModifiedBy?: string;

  @Field({ nullable: true })
  organizationId?: string;
}
