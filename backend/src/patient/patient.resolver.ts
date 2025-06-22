import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Patient } from './patient.model';
import { CreatePatientInput } from './dto/create-patient.input';
import { UpdatePatientInput } from './dto/update-patient.input';
import { DatabaseService } from '../database/database.service';

interface PatientRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

@Resolver(() => Patient)
export class PatientResolver {
  constructor(private readonly databaseService: DatabaseService) {}

  @Query(() => [Patient])
  async patients(): Promise<Patient[]> {
    const db = this.databaseService.getDatabase();
    const stmt = db.prepare('SELECT * FROM patients');
    const rows = stmt.all() as PatientRow[];
    
    return rows.map(row => ({
      ...row,
      dateOfBirth: new Date(row.dateOfBirth),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  }

  @Query(() => Patient, { nullable: true })
  async patient(@Args('id', { type: () => Int }) id: number): Promise<Patient | null> {
    const db = this.databaseService.getDatabase();
    const stmt = db.prepare('SELECT * FROM patients WHERE id = ?');
    const row = stmt.get(id) as PatientRow | undefined;
    
    if (!row) return null;
    
    return {
      ...row,
      dateOfBirth: new Date(row.dateOfBirth),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  }

  @Mutation(() => Patient)
  async createPatient(@Args('createPatientInput') createPatientInput: CreatePatientInput): Promise<Patient> {
    const db = this.databaseService.getDatabase();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO patients (firstName, lastName, email, phone, dateOfBirth, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      createPatientInput.firstName,
      createPatientInput.lastName,
      createPatientInput.email,
      createPatientInput.phone,
      createPatientInput.dateOfBirth.toISOString(),
      now,
      now,
    );
    
    const createdPatient = await this.patient(result.lastInsertRowid as number);
    if (!createdPatient) {
      throw new Error('Failed to create patient');
    }
    
    return createdPatient;
  }

  @Mutation(() => Patient, { nullable: true })
  async updatePatient(
    @Args('id', { type: () => Int }) id: number,
    @Args('updatePatientInput') updatePatientInput: UpdatePatientInput,
  ): Promise<Patient | null> {
    const db = this.databaseService.getDatabase();
    const now = new Date().toISOString();
    
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updatePatientInput.firstName !== undefined) {
      fields.push('firstName = ?');
      values.push(updatePatientInput.firstName);
    }
    if (updatePatientInput.lastName !== undefined) {
      fields.push('lastName = ?');
      values.push(updatePatientInput.lastName);
    }
    if (updatePatientInput.email !== undefined) {
      fields.push('email = ?');
      values.push(updatePatientInput.email);
    }
    if (updatePatientInput.phone !== undefined) {
      fields.push('phone = ?');
      values.push(updatePatientInput.phone);
    }
    if (updatePatientInput.dateOfBirth !== undefined) {
      fields.push('dateOfBirth = ?');
      values.push(updatePatientInput.dateOfBirth.toISOString());
    }
    
    fields.push('updatedAt = ?');
    values.push(now);
    values.push(id);
    
    const stmt = db.prepare(`UPDATE patients SET ${fields.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);
    
    if (result.changes === 0) return null;
    
    return this.patient(id);
  }

  @Mutation(() => Boolean)
  async deletePatient(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const stmt = db.prepare('DELETE FROM patients WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }
} 