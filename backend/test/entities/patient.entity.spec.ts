import { Patient } from '../../src/patient/patient.entity';

describe('Patient Entity', () => {
  let patient: Patient;

  beforeEach(() => {
    patient = new Patient();
  });

  describe('Last Four SSN', () => {
    it('should return the last four digits of the SSN', () => {
      patient.ssn = '123456789';
      expect(patient.ssnLastFour).toBe('*****6789');
    });
  });
});
