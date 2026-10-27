import {
  PaymentPlans,
  ProductFilter,
  PromotionDTO,
  PromotionFilter,
} from "@/types/promotion";
import { connectDB } from "./connect";
import { formatarParaDataBR } from "@/utils/format";

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

export const PromotionAPI = async (
  filter: PromotionFilter,
): Promise<PromotionDTO[]> => {
  try {
    const response = await api.get("/promotion/get", {
      params: {
        dtinicio: formatarParaDataBR(filter.dtinicio),
        dtfim: formatarParaDataBR(filter.dtfim),
      },
    });
    return response.data;
  } catch (err) {
    console.error("Erro ao buscar promoções:", err);
    throw err;
  }
};
