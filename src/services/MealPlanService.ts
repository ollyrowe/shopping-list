import type { MealPlan } from '@/types';

export class MealPlanService {
  public static getMealPlans(): MealPlan[] {
    const mealPlans = localStorage.getItem(mealPlansLocalStorageKey);

    if (mealPlans) {
      return JSON.parse(mealPlans);
    }

    return [];
  }

  public static createMealPlan(mealPlan: MealPlan) {
    const mealPlans = MealPlanService.getMealPlans();

    mealPlans.push(mealPlan);

    localStorage.setItem(mealPlansLocalStorageKey, JSON.stringify(mealPlans));
  }

  public static updateMealPlan(mealPlan: MealPlan) {
    const mealPlans = MealPlanService.getMealPlans();

    const updatedMealPlans = mealPlans.map((existingMealPlan) =>
      existingMealPlan.date === mealPlan.date
        ? { ...existingMealPlan, ...mealPlan }
        : existingMealPlan
    );

    localStorage.setItem(mealPlansLocalStorageKey, JSON.stringify(updatedMealPlans));
  }

  public static deleteMealPlan(mealPlan: MealPlan) {
    const mealPlans = MealPlanService.getMealPlans();

    const updatedMealPlans = mealPlans.filter(
      (exitingMealPlan) => exitingMealPlan.date !== mealPlan.date
    );

    localStorage.setItem(mealPlansLocalStorageKey, JSON.stringify(updatedMealPlans));
  }
}

const mealPlansLocalStorageKey = 'mealPlans';
