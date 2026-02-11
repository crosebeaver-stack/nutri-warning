import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce"; // We'll need to create this simple hook or inline it

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ value, onChange, isLoading }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        {isLoading ? (
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        ) : (
          <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SEARCH FOOD (E.G. 'BIG MAC')"
        className="
          w-full pl-14 pr-6 py-6 rounded-2xl
          bg-white border-2 border-border
          text-xl font-bold placeholder:font-medium placeholder:text-muted-foreground/50
          shadow-xl shadow-black/5
          focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10
          transition-all duration-300
          uppercase tracking-wide
        "
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
        <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded border">
          ENTER
        </span>
      </div>
    </div>
  );
}
