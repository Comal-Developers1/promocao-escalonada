import { useQuery } from "@tanstack/react-query";
import { PaymentPlansAPI } from "@/services/promotion";
import { toast } from "@/components/ui/toast";

export function usePaymentPlans() {
  return useQuery({
    queryKey: ["payment-plans"],
    queryFn: async () => {
      try {
        return await PaymentPlansAPI();
      } catch (error) {
        toast.add({
          type: "error",
          title: "Erro buscar planos de pagamentos",
          description: "Consulte o setor de T.I para corrigimos o erro",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30, // Cache de 30 minutos
    refetchOnWindowFocus: false,
  });
}
