import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1750626503029 implements MigrationInterface {
    name = 'InitialMigration1750626503029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "patients" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "phone" varchar NOT NULL, "dateOfBirth" datetime NOT NULL, "ssn" varchar, "medicalRecordNumber" varchar, "address" varchar, "emergencyContact" varchar, "insuranceProvider" varchar, "insuranceNumber" varchar, "allergies" varchar, "medications" varchar, "medicalHistory" varchar, "TIN" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdBy" varchar, "lastModifiedBy" varchar, "organizationId" varchar, "deletedAt" datetime, CONSTRAINT "UQ_64e2031265399f5690b0beba6a5" UNIQUE ("email"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "patients"`);
    }

}
