import { PaymentPlans, ProductFilter } from "@/types/promotion";
import { connectDB } from "./connect";

const api = connectDB();
export const ProductsAPI = async (
  filter: ProductFilter,
): Promise<ProductFilter> => {
  try {
    const response = await api.get("/promotion/products", {
      params: {
        codprod: filter.codprod,
      },
    });

    return response.data;
  } catch (err) {
    console.error("Erro ao buscar produtos: ", err);
    throw err;
  }
};

export const PaymentPlansAPI = async (): Promise<PaymentPlans> => {
  try {
    const response = await api.get("/promotion/payment-plans");
    return response.data;
  } catch (err) {
    console.error("Erro ao busca planos de pagamento: ", err);
    throw err;
  }
};
