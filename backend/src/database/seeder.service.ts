import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../patient/patient.entity';
import { faker } from '@faker-js/faker';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async seedPatients(count: number = 10): Promise<void> {
    console.log(`Seeding ${count} patients...`);

    const patients: Partial<Patient>[] = [];

    for (let i = 0; i < count; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const patient: Partial<Patient> = {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        dateOfBirth: faker.date.birthdate({ min: 18, max: 90, mode: 'age' }),
        ssn: faker.string.numeric(9), // 9-digit SSN
        medicalRecordNumber: faker.string.alphanumeric(8).toUpperCase(),
        address: faker.location.streetAddress(true),
        emergencyContact: faker.phone.number(),
        insuranceProvider: faker.helpers.arrayElement([
          'Blue Cross Blue Shield',
          'Aetna',
          'Cigna',
          'UnitedHealth Group',
          'Humana',
          'Kaiser Permanente',
        ]),
        insuranceNumber: faker.string.alphanumeric(10).toUpperCase(),
        allergies: faker.helpers.arrayElement([
          'None',
          'Penicillin',
          'Peanuts',
          'Latex',
          'Shellfish',
          'Dairy',
        ]),
        medications: faker.helpers.arrayElement([
          'None',
          'Lisinopril 10mg daily',
          'Metformin 500mg twice daily',
          'Atorvastatin 20mg daily',
          'Aspirin 81mg daily',
        ]),
        medicalHistory: faker.lorem.paragraph(),
        TIN: faker.string.numeric(9), // 9-digit TIN
        createdBy: 'system',
        lastModifiedBy: 'system',
        organizationId: 'default-org',
      };

      patients.push(patient);
    }

    // Insert all patients
    await this.patientRepository.save(patients);
    console.log(`Successfully seeded ${count} patients`);
  }

  async clearPatients(): Promise<void> {
    console.log('Clearing all patients...');
    await this.patientRepository.clear();
    console.log('All patients cleared');
  }

  async seedSampleData(): Promise<void> {
    console.log('Starting database seeding...');

    // Clear existing data
    await this.clearPatients();

    // Seed patients
    await this.seedPatients(20);

    console.log('Database seeding completed!');
  }
}
