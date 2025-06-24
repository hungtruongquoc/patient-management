import { InputType, Field } from '@nestjs/graphql';


import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDateString,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsNumberString,
  Length,
} from 'class-validator';

@InputType()
export class CreatePatientInput {
  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(255, { message: 'First name cannot exceed 255 characters' })
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(255, { message: 'Last name cannot exceed 255 characters' })
  lastName: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email cannot exceed 255 characters' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('US', {
    message: 'Phone number must be a valid US phone number',
  })
  phone: string;

  @Field()
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  dateOfBirth: string;

  @Field()
  @IsNotEmpty({ message: 'SSN is required' })
  @Length(9, 9, { message: 'SSN must be 9 characters long' })
  @IsNumberString({}, { message: 'SSN must be a valid number' })
  ssn: string;
}
