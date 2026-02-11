import { useState } from "react";
import { useFoodSearch } from "@/hooks/use-food";
import { SearchBar } from "@/components/SearchBar";
import { FoodCard } from "@/components/FoodCard";
import { useDebounce } from "@/hooks/use-debounce";
import { AlertTriangle, Pizza, UtensilsCrossed, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { data: results, isLoading, error } = useFoodSearch(debouncedQuery);

  return (
    <div className="min-h-screen bg-background bg-grid-pattern relative overflow-x-hidden">
      {/* Top Stripe */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-6xl relative z-10">
        {/* Hero Header */}
        <div className="text-center mb-16 space-y-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider mb-4 border border-yellow-200 shadow-sm"
          >
            <AlertTriangle className="w-4 h-4" />
            Nutritional Warning System
          </motion.div>

          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-7xl md:text-9xl lg:text-[10rem] font-black uppercase tracking-tight leading-none text-yellow-400 drop-shadow-xl"
          >
            Don't <span className="text-yellow-500">Eat</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto"
          >
            See the true cost of your takeaway before you take a bite.
          </motion.p>
        </div>

        {/* Search Section */}
        <div className="mb-20 sticky top-4 z-50">
          <SearchBar
            value={query}
            onChange={setQuery}
            isLoading={isLoading && query.length >= 2}
          />
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-red-50 rounded-3xl border border-red-100"
            >
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-900 mb-2">
                System Error
              </h3>
              <p className="text-red-700">
                Unable to retrieve nutritional data. Please try again.
              </p>
            </motion.div>
          ) : !debouncedQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
            >
              <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Pizza className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-1">Search Food</h4>
                <p className="text-sm text-muted-foreground">
                  Type "Pepperoni Pizza"
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <Zap className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-1">See Data</h4>
                <p className="text-sm text-muted-foreground">
                  Instant traffic light analysis
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-300 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg mb-1">Decide</h4>
                <p className="text-sm text-muted-foreground">
                  Is it worth the run?
                </p>
              </div>
            </motion.div>
          ) : results && results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {results.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FoodCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            !isLoading &&
            debouncedQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No food found
                </h3>
                <p className="text-muted-foreground">
                  Try searching for generic items like 'Burger' or 'Chips'.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-sm font-bold text-muted-foreground uppercase tracking-widest bg-slate-50 border-t border-slate-200">
        <p>
          This is a health advisory simulation • Data provided by Open Food
          Facts
        </p>
      </footer>
    </div>
  );
}
