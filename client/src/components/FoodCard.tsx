import { type FoodItem } from "@shared/routes";
import { TrafficLight } from "./TrafficLight";
import { ExerciseEquivalent } from "./ExerciseEquivalent";
import { AlertTriangle } from "lucide-react";

interface FoodCardProps {
  item: FoodItem;
}

export function FoodCard({ item }: FoodCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header Image/Pattern */}
      <div className="h-32 bg-slate-100 relative overflow-hidden group">
        {item.image ? (
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200">
            <AlertTriangle className="w-12 h-12 text-slate-400 opacity-20" />
          </div>
        )}
        
        {item.trafficLight.calories === 'high' && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
            HIGH CALORIE
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-1 font-display">
            {item.name}
          </h3>
          {item.brand && (
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
              {item.brand}
            </p>
          )}
        </div>

        <div className="flex justify-between items-start gap-2 mb-6 px-1">
          <TrafficLight 
            label="Fat" 
            value={item.fat} 
            unit="g" 
            level={item.trafficLight.fat} 
          />
          <TrafficLight 
            label="Sugar" 
            value={item.sugar} 
            unit="g" 
            level={item.trafficLight.sugar} 
          />
          <TrafficLight 
            label="Salt" 
            value={item.salt} 
            unit="g" 
            level={item.trafficLight.salt} 
          />
          <TrafficLight 
            label="Cals" 
            value={item.calories} 
            unit="kcal" 
            level={item.trafficLight.calories} 
          />
        </div>

        <ExerciseEquivalent 
          runningMinutes={item.exerciseEquivalent.runningMinutes}
          walkingMinutes={item.exerciseEquivalent.walkingMinutes}
        />
      </div>
    </div>
  );
}
