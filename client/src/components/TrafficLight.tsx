import { cn } from "@/lib/utils";
import { type NutritionLevel } from "@shared/routes";

interface TrafficLightProps {
  label: string;
  value: number;
  unit: string;
  level: NutritionLevel;
}

export function TrafficLight({ label, value, unit, level }: TrafficLightProps) {
  const colors = {
    low: "bg-emerald-500 border-emerald-600 text-white",
    moderate: "bg-amber-400 border-amber-500 text-amber-950",
    high: "bg-red-500 border-red-600 text-white",
  };

  const ringColor = {
    low: "ring-emerald-200",
    moderate: "ring-amber-200",
    high: "ring-red-200",
  };

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div 
        className={cn(
          "w-16 h-16 rounded-full flex flex-col items-center justify-center border-b-4 shadow-lg transition-transform group-hover:scale-110 duration-200",
          colors[level],
          "ring-4 ring-offset-2 ring-offset-background",
          ringColor[level]
        )}
      >
        <span className="text-sm font-bold leading-none">{value}</span>
        <span className="text-[10px] uppercase opacity-90">{unit}</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
