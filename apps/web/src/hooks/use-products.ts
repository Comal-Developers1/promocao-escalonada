import { useQuery } from "@tanstack/react-query";
import { ProductsAPI } from "@/services/promotion";
import { ProductFilter } from "@/types/promotion";
import { toast } from "@/components/ui/toast";

export function useProducts(filter: ProductFilter) {
  return useQuery({
    queryKey: ["products", filter],
    queryFn: async () => {
      try {
        return await ProductsAPI(filter);
      } catch (error) {
        toast.add({
            title: "Erro ao buscar produtos",
            description: "Consulte ao setor de T.I para corrigimos o erro",
            type: "error"
        })
        throw error;
      }
    },
    enabled: Boolean(filter.codprod && filter.codprod.trim().length > 0),
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });
}
