import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useFoodSearch(query: string) {
  return useQuery({
    queryKey: [api.food.search.path, query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      
      const url = `${api.food.search.path}?q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.food.search.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to fetch food data");
      }
      
      return api.food.search.responses[200].parse(await res.json());
    },
    enabled: query.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });
}
