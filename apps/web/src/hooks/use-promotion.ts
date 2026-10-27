import { PromotionAPI } from "@/services/promotion";
import { PromotionFilter } from "@/types/promotion";
import { useQuery } from "@tanstack/react-query";

export const usePromotions = (filter: PromotionFilter, enabled: boolean) => {
  return useQuery({
    queryKey: ["promotions", filter],
    queryFn: () => PromotionAPI(filter),
    enabled: enabled && !!filter.dtinicio && !!filter.dtfim, // Só busca se as datas estiverem preenchidas e habilitado
  });
};
