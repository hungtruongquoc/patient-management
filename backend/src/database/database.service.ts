import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Database from 'better-sqlite3';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private db: Database.Database;

  onModuleInit() {
    this.db = new Database('patients.db');
    this.initializeTables();
  }

  private initializeTables() {
    // Create patients table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        dateOfBirth TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }

  getDatabase(): Database.Database {
    return this.db;
  }

  closeDatabase() {
    if (this.db) {
      this.db.close();
    }
  }
} 