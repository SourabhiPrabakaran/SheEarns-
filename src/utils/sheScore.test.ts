import { describe, it, expect } from 'vitest';
import {
  calculateSavingsStability,
  calculateCashFlowHealth,
  calculateEmergencyPreparedness,
  calculateFinancialLiteracy,
  calculateIncomeStability,
  calculateSheScore,
  getStatus
} from './sheScore';
import { PRIYA_DEMO_USER } from '../data/defaultUser';

describe('Frozen SheScore Specification - Calculation Engine', () => {
  describe('Official Priya Demo Profile', () => {
    it('calculates exact component scores for initial Priya profile', () => {
      const result = calculateSheScore(PRIYA_DEMO_USER);

      expect(result.components.savingsStability).toBe(60);
      expect(result.components.cashFlowHealth).toBe(100);
      expect(result.components.emergencyPrep).toBe(40);
      expect(result.components.financialLiteracy).toBe(70);
      expect(result.components.incomeStability).toBe(55);
    });

    it('calculates exact raw score 66.75 and display score 67 (Growing) initially', () => {
      const result = calculateSheScore(PRIYA_DEMO_USER);

      expect(result.rawScore).toBeCloseTo(66.75, 2);
      expect(result.displayScore).toBe(67);
      expect(result.status).toBe('Growing');
    });

    it('recalculates correctly after 1 completed module: Literacy 80, Raw 68.25, Display 68', () => {
      const updatedUser = {
        ...PRIYA_DEMO_USER,
        completedModules: ['m1']
      };
      const result = calculateSheScore(updatedUser);

      expect(result.components.financialLiteracy).toBe(80);
      expect(result.rawScore).toBeCloseTo(68.25, 2);
      expect(result.displayScore).toBe(68);
      expect(result.status).toBe('Growing');
    });

    it('recalculates correctly after 2 completed modules: Literacy 90, Raw 69.75, Display 70', () => {
      const updatedUser = {
        ...PRIYA_DEMO_USER,
        completedModules: ['m1', 'm2']
      };
      const result = calculateSheScore(updatedUser);

      expect(result.components.financialLiteracy).toBe(90);
      expect(result.rawScore).toBeCloseTo(69.75, 2);
      expect(result.displayScore).toBe(70);
      expect(result.status).toBe('Growing');
    });
  });

  describe('Component Bracket Boundaries', () => {
    it('evaluates Savings Stability brackets accurately', () => {
      expect(calculateSavingsStability(400, 10000)).toBe(20);   // 4% -> 20
      expect(calculateSavingsStability(500, 10000)).toBe(40);   // 5% -> 40
      expect(calculateSavingsStability(990, 10000)).toBe(40);   // 9.9% -> 40
      expect(calculateSavingsStability(1000, 10000)).toBe(60);  // 10% -> 60
      expect(calculateSavingsStability(1490, 10000)).toBe(60);  // 14.9% -> 60
      expect(calculateSavingsStability(1500, 10000)).toBe(75);  // 15% -> 75
      expect(calculateSavingsStability(1990, 10000)).toBe(75);  // 19.9% -> 75
      expect(calculateSavingsStability(2000, 10000)).toBe(90);  // 20% -> 90
      expect(calculateSavingsStability(2990, 10000)).toBe(90);  // 29.9% -> 90
      expect(calculateSavingsStability(3000, 10000)).toBe(100); // 30%+ -> 100
    });

    it('evaluates Cash Flow Health brackets accurately', () => {
      expect(calculateCashFlowHealth(10000, 12000)).toBe(10);  // negative surplus -> 10
      expect(calculateCashFlowHealth(10000, 9800)).toBe(30);   // 2% surplus -> 30
      expect(calculateCashFlowHealth(10000, 9300)).toBe(50);   // 7% surplus -> 50
      expect(calculateCashFlowHealth(10000, 8500)).toBe(75);   // 15% surplus -> 75
      expect(calculateCashFlowHealth(10000, 7500)).toBe(100);  // 25% surplus -> 100
    });

    it('evaluates Emergency Preparedness brackets accurately', () => {
      expect(calculateEmergencyPreparedness(4000, 10000)).toBe(20);   // 0.4 mo -> 20
      expect(calculateEmergencyPreparedness(5000, 10000)).toBe(40);   // 0.5 mo -> 40
      expect(calculateEmergencyPreparedness(9900, 10000)).toBe(40);   // 0.99 mo -> 40
      expect(calculateEmergencyPreparedness(10000, 10000)).toBe(60);  // 1.0 mo -> 60
      expect(calculateEmergencyPreparedness(19000, 10000)).toBe(60);  // 1.9 mo -> 60
      expect(calculateEmergencyPreparedness(20000, 10000)).toBe(80);  // 2.0 mo -> 80
      expect(calculateEmergencyPreparedness(29000, 10000)).toBe(80);  // 2.9 mo -> 80
      expect(calculateEmergencyPreparedness(30000, 10000)).toBe(100); // 3.0+ mo -> 100
    });

    it('evaluates Financial Literacy caps at 100', () => {
      expect(calculateFinancialLiteracy('Beginner', 0)).toBe(40);
      expect(calculateFinancialLiteracy('Intermediate', 0)).toBe(70);
      expect(calculateFinancialLiteracy('Confident', 0)).toBe(90);
      expect(calculateFinancialLiteracy('Confident', 1)).toBe(100);
      expect(calculateFinancialLiteracy('Confident', 3)).toBe(100); // capped at 100
    });

    it('evaluates Income Stability tiers accurately', () => {
      expect(calculateIncomeStability('Very consistent')).toBe(90);
      expect(calculateIncomeStability('Mostly consistent')).toBe(75);
      expect(calculateIncomeStability('Sometimes irregular')).toBe(55);
      expect(calculateIncomeStability('Highly irregular')).toBe(35);
    });

    it('evaluates Status tiers accurately', () => {
      expect(getStatus(39)).toBe('Starting');
      expect(getStatus(40)).toBe('Building');
      expect(getStatus(59)).toBe('Building');
      expect(getStatus(60)).toBe('Growing');
      expect(getStatus(79)).toBe('Growing');
      expect(getStatus(80)).toBe('Strong');
      expect(getStatus(100)).toBe('Strong');
    });
  });
});
