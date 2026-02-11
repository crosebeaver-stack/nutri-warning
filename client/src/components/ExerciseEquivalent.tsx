import { Footprints, PersonStanding } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseEquivalentProps {
  runningMinutes: number;
  walkingMinutes: number;
}

export function ExerciseEquivalent({ runningMinutes, walkingMinutes }: ExerciseEquivalentProps) {
  return (
    <div className="mt-6 pt-6 border-t border-dashed border-gray-200">
      <h4 className="text-sm font-bold text-muted-foreground uppercase mb-3 flex items-center gap-2">
        Payment Required (Sweat Equity)
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full text-orange-600">
            <PersonStanding className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="block text-lg font-black text-slate-800">{runningMinutes} min</span>
            <span className="text-xs text-slate-500 uppercase font-bold">Running</span>
          </div>
        </div>
        
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-lg font-black text-slate-800">{walkingMinutes} min</span>
            <span className="text-xs text-slate-500 uppercase font-bold">Walking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
