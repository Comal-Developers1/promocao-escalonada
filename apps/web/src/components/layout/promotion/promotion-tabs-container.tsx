"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Search } from "lucide-react";
import { PromotionFilter } from "@/types/promotion";
import { PromotionDataTab } from "@/components/layout/promotion/promotion-data-tab";
import { usePromotions } from "@/hooks/use-promotion";

interface PromotionTabsContainerProps {
  // Recebe os componentes da Aba 1 (Criar / Gerenciar)
  searchForm: React.ReactNode;
  pricingTable: React.ReactNode;
}

export function PromotionTabsContainer({
  searchForm,
  pricingTable,
}: PromotionTabsContainerProps) {
  // Filtros locais exclusivos da Aba 2 (Visualização / Consulta)
  const [queryFilter, setQueryFilter] = useState<PromotionFilter>({
    dtinicio: "",
    dtfim: "",
  });
  const [appliedFilter, setAppliedFilter] = useState<PromotionFilter>({
    dtinicio: "",
    dtfim: "",
  });
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  // Hook do React Query
  const { data, isLoading, isError } = usePromotions(
    appliedFilter,
    isQueryEnabled,
  );

  // Funções para formatar e aplicar os atalhos de data
  const formatarData = (date: Date) => {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const aplicarAtalhoHoje = () => {
    const hoje = formatarData(new Date());
    setQueryFilter({ dtinicio: hoje, dtfim: hoje });
  };

  const aplicarAtalhoAmanha = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAmanha = formatarData(amanha);
    setQueryFilter({ dtinicio: dataAmanha, dtfim: dataAmanha });
  };

  const handleConsultar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryFilter.dtinicio || !queryFilter.dtfim) return;
    setAppliedFilter(queryFilter);
    setIsQueryEnabled(true);
  };

  return (
    <Tabs defaultValue="cadastro" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cadastro">Criar / Gerenciar Promoção</TabsTrigger>
        <TabsTrigger value="visualizacao">
          Visualizar Dados Cadastrados
        </TabsTrigger>
      </TabsList>

      {/* ABA 1: Fluxo de Cadastro e Tabela de Inserção */}
      <TabsContent value="cadastro" className="space-y-6 mt-0">
        {searchForm}
        {pricingTable}
      </TabsContent>

      {/* ABA 2: Filtro isolado por Período e Tabela de Promoções em Banco */}
      <TabsContent value="visualizacao" className="space-y-6 mt-0">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Filtrar Promoções
              por Período
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form
              onSubmit={handleConsultar}
              className="flex flex-col sm:flex-row gap-4 items-end"
            >
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="view-dtinicio">Data Início</Label>
                <Input
                  id="view-dtinicio"
                  type="date"
                  value={queryFilter.dtinicio}
                  onChange={(e) =>
                    setQueryFilter({ ...queryFilter, dtinicio: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="view-dtfim">Data Fim</Label>
                <Input
                  id="view-dtfim"
                  type="date"
                  value={queryFilter.dtfim}
                  onChange={(e) =>
                    setQueryFilter({ ...queryFilter, dtfim: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" /> Consultar
              </Button>
            </form>

            {/* Atalhos de Datas na Aba 2 */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                <Calendar className="h-3.5 w-3.5" /> Atalhos:
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={aplicarAtalhoHoje}
              >
                Hoje
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5"
                onClick={aplicarAtalhoAmanha}
              >
                Amanhã
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela Shadcn UI que renderiza os dados da API */}
        <PromotionDataTab data={data} isLoading={isLoading} isError={isError} />
      </TabsContent>
    </Tabs>
  );
}
