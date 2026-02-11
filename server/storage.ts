import { db } from "./db";
import { cachedSearches, type InsertCachedSearch } from "@shared/schema";
import { eq } from "drizzle-orm";
import { type FoodItem, type NutritionLevel } from "@shared/routes";

export interface IStorage {
  searchFood(term: string): Promise<FoodItem[]>;
  getComparison(id: string): Promise<{ original: FoodItem, variants: FoodItem[] } | undefined>;
}

export class DatabaseStorage implements IStorage {
  async searchFood(term: string): Promise<FoodItem[]> {
    const normalizedTerm = term.toLowerCase().trim();
    
    // For "big mac", we specifically want to prioritize the UK version and collapse others
    const isBigMac = normalizedTerm === "big mac";
    
    // Check DB cache first
    const [cached] = await db
      .select()
      .from(cachedSearches)
      .where(eq(cachedSearches.term, normalizedTerm));

    if (cached) {
      console.log(`Cache hit for "${term}"`);
      return cached.results as FoodItem[];
    }

    console.log(`Cache miss for "${term}", fetching from Open Food Facts`);
    
    try {
      // Fetch specifically with country filter if possible, but OFF search is broad
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=50`
      );
      
      if (!response.ok) {
        throw new Error(`Open Food Facts API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const products = data.products || [];
      
      let results: FoodItem[] = products.map((p: any) => this.mapProductToFoodItem(p))
        .filter((item: FoodItem) => item.name && item.calories > 0);

      if (isBigMac) {
        // Find the UK one
        const ukBigMac = results.find(item => item.country?.toLowerCase() === 'uk' || item.country?.toLowerCase() === 'united kingdom') 
          || results.find(item => item.name.toLowerCase().includes('big mac') && (item.brand?.toLowerCase().includes('mcdonald')));
        
        if (ukBigMac) {
          // Return only the primary one for the search result list
          results = [ukBigMac];
        } else if (results.length > 0) {
          results = [results[0]];
        }
      }

      // Cache results
      if (results.length > 0) {
        await db.insert(cachedSearches).values({
          term: normalizedTerm,
          results: results,
        });
      }
      
      return results;
    } catch (error) {
      console.error("Error searching food:", error);
      return [];
    }
  }

  async getComparison(id: string): Promise<{ original: FoodItem, variants: FoodItem[] } | undefined> {
    // Fetch the original item
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${id}`);
    if (!response.ok) return undefined;
    
    const data = await response.json();
    if (!data.product) return undefined;
    
    const original = this.mapProductToFoodItem(data.product);
    
    // Search for variants around the world using the same name
    const searchResponse = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(original.name)}&search_simple=1&action=process&json=1&page_size=50`
    );
    
    const searchData = await searchResponse.json();
    const products = searchData.products || [];
    
    const variants = products
      .map((p: any) => this.mapProductToFoodItem(p))
      .filter((item: FoodItem) => item.id !== original.id && item.calories > 0)
      // Deduplicate by country to keep the comparison clean
      .reduce((acc: FoodItem[], current: FoodItem) => {
        const country = current.country || 'Unknown';
        if (!acc.find(item => item.country === country)) {
          acc.push(current);
        }
        return acc;
      }, []);

    return { original, variants };
  }

  private mapProductToFoodItem(p: any): FoodItem {
    const nutriments = p.nutriments || {};
    const calories100g = nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0;
    const caloriesServing = nutriments['energy-kcal_serving'];
    const displayCalories = caloriesServing ? Math.round(caloriesServing) : Math.round(calories100g);
    
    const fat = nutriments['fat_100g'] || nutriments.fat || 0;
    const sugar = nutriments['sugars_100g'] || nutriments.sugars || 0;
    const salt = nutriments['salt_100g'] || nutriments.salt || 0;
    
    // Try to determine country from 'countries_tags' or 'countries_hierarchy'
    const countries = p.countries_tags || [];
    const country = countries.length > 0 ? countries[0].replace('en:', '').toUpperCase() : 'Unknown';

    return {
      id: p.code || Math.random().toString(),
      name: p.product_name || "Unknown Product",
      brand: p.brands || undefined,
      calories: displayCalories,
      fat: Number(fat.toFixed(1)),
      sugar: Number(sugar.toFixed(1)),
      salt: Number(salt.toFixed(1)),
      image: p.image_front_url || p.image_url,
      country: country,
      trafficLight: {
        fat: this.getTrafficLight(fat, 'fat'),
        sugar: this.getTrafficLight(sugar, 'sugar'),
        salt: this.getTrafficLight(salt, 'salt'),
        calories: this.getTrafficLight(calories100g, 'calories'),
      },
      exerciseEquivalent: {
        runningMinutes: Math.round(displayCalories / 10),
        walkingMinutes: Math.round(displayCalories / 4),
      }
    };
  }

  private getTrafficLight(value: number, type: 'fat' | 'sugar' | 'salt' | 'calories'): NutritionLevel {
    switch (type) {
      case 'fat':
        if (value > 17.5) return 'high';
        if (value > 3) return 'moderate';
        return 'low';
      case 'sugar':
        if (value > 22.5) return 'high';
        if (value > 5) return 'moderate';
        return 'low';
      case 'salt':
        if (value > 1.5) return 'high';
        if (value > 0.3) return 'moderate';
        return 'low';
      case 'calories':
        if (value > 400) return 'high';
        if (value > 100) return 'moderate';
        return 'low';
    }
  }
}

export const storage = new DatabaseStorage();
