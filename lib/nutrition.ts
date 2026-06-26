export interface NutritionFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingLabel: string;
  source: "seed" | "open-food-facts";
}

export const INDIAN_FOOD_SEED: NutritionFood[] = [
  { id: "seed-masala-dosa", name: "Masala Dosa", calories: 350, protein: 7, carbs: 54, fat: 12, servingLabel: "1 plate", source: "seed" },
  { id: "seed-paneer-butter-masala", name: "Paneer Butter Masala", calories: 380, protein: 14, carbs: 10, fat: 32, servingLabel: "1 bowl", source: "seed" },
  { id: "seed-veg-biryani", name: "Veg Biryani", calories: 420, protein: 8, carbs: 70, fat: 12, servingLabel: "1 plate", source: "seed" },
  { id: "seed-samosa", name: "Samosa", calories: 260, protein: 4, carbs: 32, fat: 14, servingLabel: "1 piece", source: "seed" },
  { id: "seed-aloo-paratha", name: "Aloo Paratha", calories: 290, protein: 5, carbs: 48, fat: 9, servingLabel: "1 piece", source: "seed" },
  { id: "seed-boiled-egg", name: "Boiled Egg", calories: 75, protein: 6.5, carbs: 0.6, fat: 5.3, servingLabel: "1 egg", source: "seed" },
  { id: "seed-chicken-tikka", name: "Chicken Tikka", calories: 280, protein: 34, carbs: 4, fat: 14, servingLabel: "6 pieces", source: "seed" },
  { id: "seed-gulab-jamun", name: "Gulab Jamun", calories: 300, protein: 4, carbs: 48, fat: 11, servingLabel: "2 pieces", source: "seed" },
  { id: "seed-dal-tadka", name: "Dal Tadka", calories: 150, protein: 8, carbs: 20, fat: 4, servingLabel: "1 bowl", source: "seed" },
  { id: "seed-idli", name: "Idli with Coconut Chutney", calories: 220, protein: 6, carbs: 42, fat: 3, servingLabel: "2 idlis", source: "seed" },
  { id: "seed-poha", name: "Poha", calories: 250, protein: 6, carbs: 45, fat: 6, servingLabel: "1 plate", source: "seed" },
  { id: "seed-rajma-chawal", name: "Rajma Chawal", calories: 430, protein: 14, carbs: 76, fat: 8, servingLabel: "1 plate", source: "seed" },
];

export function searchSeedFoods(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return INDIAN_FOOD_SEED.slice(0, 8);

  return INDIAN_FOOD_SEED.filter((food) => food.name.toLowerCase().includes(normalized)).slice(0, 8);
}
