"use client";

import { useQuery } from "@tanstack/react-query";
import { buscarHistoricoPromocao } from "@/services/txt";
import { useSession } from "@/providers/Provider.test";

export function usePromotionHistory() {
  const { token } = useSession();
  const matricula = token?.matricula || 0;

  return useQuery({
    queryKey: ["promotion-history", matricula],
    queryFn: () => buscarHistoricoPromocao(matricula),
    enabled: matricula > 0, // Só executa se houver matrícula válida
    refetchOnWindowFocus: false,
  });
}
