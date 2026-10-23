import { useState } from "react";
import { ProductsDTO, PaymentPlans, LinhaTabela } from "@/types/promotion";
import { useProducts } from "@/hooks/use-products";
import { usePaymentPlans } from "@/hooks/use-payment-plans";
import {
  getValorTabelaPorNumpr,
  calcularValorNoPlano,
  calcularPctPromocao,
} from "@/modules/pricing/pricing.domain";

export function usePromotionalPricing() {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [termo, setTermo] = useState("");
  const [aberto, setAberto] = useState(false);
  const [selecionado, setSelecionado] = useState<ProductsDTO | null>(null);
  const [valorPromo, setValorPromo] = useState("");
  const [qtdInicio, setQtdInicio] = useState("");
  const [qtdFim, setQtdFim] = useState("150"); // Valor padrão 150
  const [linhas, setLinhas] = useState<LinhaTabela[]>([]);

  // Regra: Só libera os filtros se data inicial e final estiverem preenchidas
  const isDatasPreenchidas = Boolean(dataInicio && dataFim);

  const { data: produtosAPI, isLoading: isLoadingProdutos } = useProducts({
    codprod: isDatasPreenchidas && !selecionado ? termo : "",
  });
  const sugestoes: ProductsDTO[] = Array.isArray(produtosAPI)
    ? produtosAPI
    : [];

  // 2. Busca de planos de pagamento via React Query
  const { data: planosAPI, isLoading: isLoadingPlanos } = usePaymentPlans();
  const planos: PaymentPlans[] = Array.isArray(planosAPI) ? planosAPI : [];

  function selecionarProduto(p: ProductsDTO) {
    setSelecionado(p);
    setTermo(`${p.codprod} — ${p.descricao}`);
    setAberto(false);
  }

  function adicionarProduto() {
    if (!selecionado || !isDatasPreenchidas) return;
    const promo = Number(valorPromo.replace(",", "."));
    if (!promo || promo <= 0) return;

    const qInicio = Number(qtdInicio.replace(",", ".")) || 0;
    const qFim = Number(qtdFim.replace(",", ".")) || 150;

    const novasLinhas: LinhaTabela[] = planos.map((plano) => {
      const valorBaseTabela = getValorTabelaPorNumpr(selecionado, plano.numpr);
      const valorPlano = calcularValorNoPlano(valorBaseTabela, plano.pertxfim);

      return {
        produtoId: selecionado.codprod,
        codigo: String(selecionado.codprod),
        descricao: selecionado.descricao,
        valorBase: valorBaseTabela,
        valorPromocao: promo,
        plano: String(plano.codplpag),
        pertxfim: plano.pertxfim || 0,
        valorPlano,
        pctNecessaria: calcularPctPromocao(valorPlano, promo),
        dataInicio,
        dataFim,
        qtdInicio: qInicio,
        qtdFim: qFim,
      };
    });

    setLinhas((prev) => [...prev, ...novasLinhas]);
    setTermo("");
    setSelecionado(null);
    setValorPromo("");
    setQtdInicio("");
    setQtdFim("150");
    setAberto(false);
  }

  function removerProduto(produtoId: number) {
    setLinhas((prev) => prev.filter((l) => l.produtoId !== produtoId));
  }

  const handleSetTermo = (v: string) => {
    if (selecionado) {
      setSelecionado(null);
    }
    setTermo(v);
    setAberto(v.trim().length > 0 && isDatasPreenchidas);
  };

  return {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    isDatasPreenchidas,
    termo,
    setTermo: handleSetTermo,
    sugestoes,
    aberto,
    setAberto,
    selecionado,
    valorPromo,
    setValorPromo,
    qtdInicio,
    setQtdInicio,
    qtdFim,
    setQtdFim,
    linhas,
    selecionarProduto,
    adicionarProduto,
    removerProduto,
    isLoading: isLoadingProdutos || isLoadingPlanos,
  };
}
