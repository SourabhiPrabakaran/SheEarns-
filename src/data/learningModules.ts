import { LearningModule } from '../types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: "m1",
    title: "Building an Emergency Fund",
    time: "3 min",
    category: "Security",
    description: "Learn how to calculate, store, and build a 3–6 month emergency cushion that protects your independence.",
    iconName: "book"
  },
  {
    id: "m2",
    title: "Understanding Cash Flow",
    time: "4 min",
    category: "Budgeting",
    description: "Master the flow of income and expenses, identify surplus leaks, and optimize your monthly breathing room.",
    iconName: "zap"
  },
  {
    id: "m3",
    title: "Smart Saving Habits",
    time: "3 min",
    category: "Growth",
    description: "Simple, automated saving strategies designed to reach 20%+ savings rate consistently over time.",
    iconName: "sprout"
  }
];
