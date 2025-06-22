import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Patient {
  @Field(() => Int)
  id: number;

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
  createdAt: Date;

  @Field()
  updatedAt: Date;
} 