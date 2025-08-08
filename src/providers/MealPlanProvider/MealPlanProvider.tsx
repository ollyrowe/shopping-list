import React, { use, useMemo, useState } from 'react';
import { MealPlanService } from '@/services';
import type { MealPlan } from '@/types';

interface MealPlanContextValue {
  mealPlans: MealPlan[];
  createMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => void;
  deleteMealPlan: (mealPlan: MealPlan) => void;
}

const MealPlanContext = React.createContext<MealPlanContextValue>({
  mealPlans: [],
  createMealPlan: () => {},
  deleteMealPlan: () => {},
});

interface MealPlanProviderProps {
  children: React.ReactNode;
}

const MealPlanProvider: React.FC<MealPlanProviderProps> = ({ children }) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(MealPlanService.getMealPlans());

  const createMealPlan = (mealPlan: Omit<MealPlan, 'id'>) => {
    const existingMealPlan = mealPlans.find(
      (existingMealPlan) => existingMealPlan.date === mealPlan.date
    );

    if (existingMealPlan) {
      MealPlanService.updateMealPlan({ ...existingMealPlan, ...mealPlan });
    } else {
      MealPlanService.createMealPlan(mealPlan);
    }

    setMealPlans(MealPlanService.getMealPlans());
  };

  const deleteMealPlan = (mealPlan: MealPlan) => {
    MealPlanService.deleteMealPlan(mealPlan);
    setMealPlans(MealPlanService.getMealPlans());
  };

  const value = useMemo(() => ({ mealPlans, createMealPlan, deleteMealPlan }), [mealPlans]);

  return <MealPlanContext value={value}>{children}</MealPlanContext>;
};

export default MealPlanProvider;

export const useMealPlans = () => {
  const context = use(MealPlanContext);

  if (!context) {
    throw new Error('useMealPlans must be used within a MealPlanProvider');
  }

  return context;
};
