import { NextResponse } from "next/server";
import { NutritionFood, searchSeedFoods } from "@/lib/nutrition";

interface OpenFoodFactsProduct {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  generic_name?: string;
  serving_size?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    "energy-kcal_serving"?: number;
    proteins_100g?: number;
    proteins_serving?: number;
    carbohydrates_100g?: number;
    carbohydrates_serving?: number;
    fat_100g?: number;
    fat_serving?: number;
  };
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeProduct(product: OpenFoodFactsProduct): NutritionFood | null {
  const name = product.product_name_en || product.product_name || product.generic_name;
  if (!name || !product.nutriments) return null;

  const calories = toNumber(product.nutriments["energy-kcal_serving"]) || toNumber(product.nutriments["energy-kcal_100g"]);
  const protein = toNumber(product.nutriments.proteins_serving) || toNumber(product.nutriments.proteins_100g);
  const carbs = toNumber(product.nutriments.carbohydrates_serving) || toNumber(product.nutriments.carbohydrates_100g);
  const fat = toNumber(product.nutriments.fat_serving) || toNumber(product.nutriments.fat_100g);

  if (!calories) return null;

  return {
    id: `off-${product.code || name.toLowerCase().replace(/\W+/g, "-")}`,
    name,
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10,
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    servingLabel: product.serving_size || "100 g",
    source: "open-food-facts",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";
  const seedResults = searchSeedFoods(query);

  if (!query) {
    return NextResponse.json({ foods: seedResults, source: "seed" });
  }

  try {
    const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
    url.searchParams.set("search_terms", query);
    url.searchParams.set("search_simple", "1");
    url.searchParams.set("action", "process");
    url.searchParams.set("json", "1");
    url.searchParams.set("page_size", "12");
    url.searchParams.set("fields", "code,product_name,product_name_en,generic_name,serving_size,nutriments");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "DietDost/1.0 (student nutrition tracker)",
      },
      next: { revalidate: 60 * 60 * 12 },
    });

    if (!response.ok) throw new Error(`Open Food Facts responded ${response.status}`);

    const data = (await response.json()) as { products?: OpenFoodFactsProduct[] };
    const publicResults = (data.products || [])
      .map(normalizeProduct)
      .filter((food): food is NutritionFood => Boolean(food));

    const seen = new Set<string>();
    const foods = [...seedResults, ...publicResults].filter((food) => {
      const key = food.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);

    return NextResponse.json({ foods, source: "open-food-facts" });
  } catch {
    return NextResponse.json(
      { foods: seedResults, source: "seed", warning: "Public nutrition lookup failed, using curated seed foods." },
      { status: 200 },
    );
  }
}
