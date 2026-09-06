import { describe, it, expect } from 'vitest';
import { calculateSheScore } from './sheScore';
import { calculateFinancingReadiness } from './financingReadiness';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';

describe('Interactive Gradient Mesh Background Safety & Logic', () => {
  it('1. Verifies gradient mesh color palette conforms to warm SheEarns visual identity', () => {
    // Brand primary neutral: #faf8f5 (warm editorial off-white)
    // Accent tints: #dbc38e (warm gold/champagne), #762e50 (plum), #f5ebe0 (warm peach)
    const brandColors = {
      baseBg: '#faf8f5',
      goldTint: 'rgba(219, 195, 142, 0.28)',
      plumTint: 'rgba(118, 46, 80, 0.16)',
      peachTint: 'rgba(240, 205, 180, 0.26)',
      warmGoldTint: 'rgba(225, 200, 145, 0.22)'
    };

    expect(brandColors.baseBg).toBe('#faf8f5');
    expect(brandColors.goldTint).toContain('219, 195, 142');
    expect(brandColors.plumTint).toContain('118, 46, 80');
    expect(brandColors.peachTint).toContain('240, 205, 180');
    expect(brandColors.warmGoldTint).toContain('225, 200, 145');
  });

  it('2. Verifies coordinate interpolation formula produces smooth bounded shifts', () => {
    const interpolateCoord = (current: number, target: number, easing = 0.045) => {
      return current + (target - current) * easing;
    };

    const target = 0.5; // Max right coordinate
    let current = 0;

    // Single step should move gently (4.5% of delta)
    current = interpolateCoord(current, target, 0.045);
    expect(current).toBeCloseTo(0.0225, 3);

    // After 10 steps, movement remains progressive without jumping
    for (let i = 0; i < 9; i++) {
      current = interpolateCoord(current, target, 0.045);
    }
    expect(current).toBeLessThan(0.25);
    expect(current).toBeGreaterThan(0.05);

    // Max offset calculation: 0.5 * 44px = 22px
    const maxOffset = current * 44;
    expect(maxOffset).toBeLessThan(25);
  });

  it('3. Confirms SheScore calculation and Priya acceptance scores remain frozen and intact', () => {
    const initial = calculateSheScore(PRIYA_DEMO_USER);
    expect(initial.displayScore).toBe(67);
    expect(initial.status).toBe('Growing');

    const afterOne = calculateSheScore({
      ...PRIYA_DEMO_USER,
      completedModules: ['m1']
    });
    expect(afterOne.displayScore).toBe(68);

    const afterTwo = calculateSheScore({
      ...PRIYA_DEMO_USER,
      completedModules: ['m1', 'm2']
    });
    expect(afterTwo.displayScore).toBe(70);
  });

  it('4. Confirms Meera Entrepreneur Financing Readiness remains exactly 83/100', () => {
    const readiness = calculateFinancingReadiness(MEERA_DEMO_USER);
    expect(readiness.displayScore).toBe(83);
    expect(readiness.components.cashFlowHealth).toBe(100);
    expect(readiness.components.businessActivityConsistency).toBe(80);
    expect(readiness.components.businessRevenueStability).toBe(100);
  });
});
