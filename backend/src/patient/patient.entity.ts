import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@Entity('patients')
@ObjectType()
export class Patient {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  phone: string;

  @Column('datetime', { select: false, nullable: true })
  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true, select: false }) // Hidden by default
  @Field({ nullable: true })
  ssn?: string;

  @Column({ nullable: true, select: false }) // Hidden by default
  medicalRecordNumber?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  emergencyContact?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  insuranceProvider?: string;

  @Column({ nullable: true, select: false }) // Hidden by default
  insuranceNumber?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  allergies?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  medications?: string;

  @Column({ nullable: true, select: false }) // Hidden by default
  medicalHistory?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  TIN?: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @UpdateDateColumn()
  @Field()
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  lastModifiedBy?: string;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  deletedAt?: Date;
}
