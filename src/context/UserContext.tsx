import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  SheScoreResult,
  Recommendation,
  FinancingReadinessResult,
  FinancialHistoryRecord
} from '../types';
import { PRIYA_DEMO_USER, MEERA_DEMO_USER } from '../data/defaultUser';
import { PRIYA_SAMPLE_HISTORY, MEERA_SAMPLE_HISTORY } from '../data/financialHistoryData';
import { calculateSheScore, getRecommendations } from '../utils/sheScore';
import { calculateFinancingReadiness } from '../utils/financingReadiness';

interface UserContextValue {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUser: (fields: Partial<UserProfile>) => void;
  scoreData: SheScoreResult;
  recommendations: Recommendation[];
  financingReadiness: FinancingReadinessResult | null;
  toggleModule: (moduleId: string) => void;
  isModuleCompleted: (moduleId: string) => boolean;
  resetToPriya: () => void;
  loadMeera: () => void;
  financialHistory: FinancialHistoryRecord[];
  addFinancialHistoryRecord: (record: Omit<FinancialHistoryRecord, 'id'>) => void;
  resetFinancialHistory: () => void;
}

const STORAGE_KEY = 'sheearns_user';

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isBiz = parsed.incomeType === 'Business';
        // Ensure required fields and appropriate default history exist
        return {
          ...(isBiz ? MEERA_DEMO_USER : PRIYA_DEMO_USER),
          ...parsed,
          completedModules: parsed.completedModules || [],
          financialHistory:
            parsed.financialHistory && parsed.financialHistory.length > 0
              ? parsed.financialHistory
              : isBiz
              ? [...MEERA_SAMPLE_HISTORY]
              : [...PRIYA_SAMPLE_HISTORY]
        };
      }
    } catch {
      // ignore
    }
    return {
      ...PRIYA_DEMO_USER,
      financialHistory: [...PRIYA_SAMPLE_HISTORY]
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user]);

  const updateUser = (fields: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...fields }));
  };

  const toggleModule = (moduleId: string) => {
    setUser(prev => {
      const current = prev.completedModules || [];
      const updated = current.includes(moduleId)
        ? current.filter(id => id !== moduleId)
        : [...current, moduleId];
      return { ...prev, completedModules: updated };
    });
  };

  const isModuleCompleted = (moduleId: string): boolean => {
    return (user.completedModules || []).includes(moduleId);
  };

  const resetToPriya = () => {
    setUser({
      ...PRIYA_DEMO_USER,
      financialHistory: [...PRIYA_SAMPLE_HISTORY]
    });
  };

  const loadMeera = () => {
    setUser({
      ...MEERA_DEMO_USER,
      financialHistory: [...MEERA_SAMPLE_HISTORY]
    });
  };

  const financialHistory: FinancialHistoryRecord[] = useMemo(() => {
    if (user.financialHistory && user.financialHistory.length > 0) {
      return user.financialHistory;
    }
    return user.incomeType === 'Business'
      ? [...MEERA_SAMPLE_HISTORY]
      : [...PRIYA_SAMPLE_HISTORY];
  }, [user.financialHistory, user.incomeType]);

  const addFinancialHistoryRecord = (record: Omit<FinancialHistoryRecord, 'id'>) => {
    setUser(prev => {
      const currentHistory = prev.financialHistory || (
        prev.incomeType === 'Business' ? [...MEERA_SAMPLE_HISTORY] : [...PRIYA_SAMPLE_HISTORY]
      );
      const newRecord: FinancialHistoryRecord = {
        ...record,
        id: `rec-${Date.now()}`
      };
      return {
        ...prev,
        financialHistory: [...currentHistory, newRecord]
      };
    });
  };

  const resetFinancialHistory = () => {
    setUser(prev => ({
      ...prev,
      financialHistory: prev.incomeType === 'Business'
        ? [...MEERA_SAMPLE_HISTORY]
        : [...PRIYA_SAMPLE_HISTORY]
    }));
  };

  // Pure deterministic score calculation from frozen specification
  const scoreData = useMemo(() => calculateSheScore(user), [user]);

  // Recommendations dynamically computed from current scores
  const recommendations = useMemo(() => getRecommendations(scoreData, user), [scoreData, user]);

  // Entrepreneur Financing Readiness (Alternative non-traditional assessment for Business users)
  const financingReadiness = useMemo(() => {
    if (user.incomeType === 'Business') {
      return calculateFinancingReadiness(user);
    }
    return null;
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        scoreData,
        recommendations,
        financingReadiness,
        toggleModule,
        isModuleCompleted,
        resetToPriya,
        loadMeera,
        financialHistory,
        addFinancialHistoryRecord,
        resetFinancialHistory
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
