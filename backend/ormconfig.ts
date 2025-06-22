import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Patient } from './src/patient/patient.entity';

// Load environment variables from .env file
config();

export default new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || 'patients.db',
  entities: [Patient],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Disable auto-sync in production
  logging: process.env.NODE_ENV === 'development',
}); 