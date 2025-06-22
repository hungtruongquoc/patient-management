import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePatientInput {
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
}
