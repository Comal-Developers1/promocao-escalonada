"use client";

import { usePromotionalPricing } from "@/hooks/usePromotionalPricing";
import { ProductSearchForm } from "@/components/layout/pricing/product-search-form";
import { PricingTable } from "@/components/layout/pricing/pricing-table";
import { PromotionHistoryList } from "@/components/layout/pricing/promotion-history-list";
import { PromotionTabsContainer } from "@/components/layout/promotion/promotion-tabs-container";

export default function PrecificacaoPromocionalPage() {
  const {
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    isDatasPreenchidas,
    termo,
    setTermo,
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
    isLoading,
  } = usePromotionalPricing();

  return (
    <div className="mx-auto max-w-8xl p-5 space-y-6 overflow-visible">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Precificação Promocional
        </h1>
        <p className="text-muted-foreground text-sm">
          Informe o período da promoção, busque o produto, defina os valores e
          quantidades para gerar os dados.
        </p>
      </div>

      {/* Componente de Abas Organizado */}
      <PromotionTabsContainer
        searchForm={
          <ProductSearchForm
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
            isDatasPreenchidas={isDatasPreenchidas}
            termo={termo}
            setTermo={setTermo}
            sugestoes={sugestoes}
            aberto={aberto}
            setAberto={setAberto}
            selecionado={selecionado}
            valorPromo={valorPromo}
            setValorPromo={setValorPromo}
            qtdInicio={qtdInicio}
            setQtdInicio={setQtdInicio}
            qtdFim={qtdFim}
            setQtdFim={setQtdFim}
            selecionarProduto={selecionarProduto}
            adicionarProduto={adicionarProduto}
          />
        }
        pricingTable={
          <div className="space-y-6">
            <PricingTable
              linhas={linhas}
              removerProduto={removerProduto}
              isLoading={isLoading}
            />
            {/* 🟢 Histórico de arquivos baixados mantido na aba de criação */}
            <PromotionHistoryList />
          </div>
        }
      />
    </div>
  );
}
