"use client";

import { useQuery } from "@tanstack/react-query";
import { buscarHistoricoPromocao } from "@/services/txt";
import { useSession } from "@/providers/Provider.test";

export function usePromotionHistory(dataInicio?: string, dataFim?: string) {
  const { token } = useSession();
  const matricula = token?.matricula || 0;

  return useQuery({
    queryKey: ["promotion-history", matricula, dataInicio, dataFim],
    queryFn: () => buscarHistoricoPromocao(matricula, dataInicio, dataFim),
    enabled: matricula > 0,
    refetchOnWindowFocus: false,
  });
}
