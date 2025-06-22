import { DataSource } from 'typeorm';
import { Patient } from './src/patient/patient.entity';

export default new DataSource({
  type: 'sqlite',
  database: 'patients.db',
  entities: [Patient],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Disable auto-sync in production
  logging: process.env.NODE_ENV === 'development',
}); 