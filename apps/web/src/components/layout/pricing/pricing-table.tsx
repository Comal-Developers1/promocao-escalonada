"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Trash2,
  Percent,
  Download,
  Loader2,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { LinhaTabela } from "@/types/promotion";
import { fmtBRL } from "@/utils/format";
import { exportarTxtPromocao } from "@/services/txt";
import { useSession } from "@/providers/Provider.test";
import { useQueryClient } from "@tanstack/react-query";

interface PricingTableProps {
  linhas: LinhaTabela[];
  removerProduto: (produtoId: number) => void;
  isLoading?: boolean;
}

export function PricingTable({
  linhas,
  removerProduto,
  isLoading = false,
}: PricingTableProps) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [expandedProducts, setExpandedProducts] = React.useState<
    Record<number, boolean>
  >({});

  const queryClient = useQueryClient();
  const { token } = useSession();

  const toggleExpand = (produtoId: number) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [produtoId]: !prev[produtoId],
    }));
  };

  // Agrupa as linhas por produtoId
  const groupedRows = React.useMemo(() => {
    const groups: { [key: number]: LinhaTabela[] } = {};
    linhas.forEach((linha) => {
      if (!groups[linha.produtoId]) {
        groups[linha.produtoId] = [];
      }
      groups[linha.produtoId].push(linha);
    });
    return groups;
  }, [linhas]);

  const handleExport = async () => {
    if (linhas.length === 0) return;
    setIsExporting(true);
    try {
      const usuario = token?.usuario || token?.nome || "SISTEMA";
      const matricula = token?.matricula || 0;

      await exportarTxtPromocao(usuario, matricula, linhas);

      queryClient.invalidateQueries({
        queryKey: ["promotion-history", matricula],
      });
    } catch (error) {
      console.error("Erro na exportação:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">Produtos na promoção</CardTitle>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline">{linhas.length} linhas</Badge>

          <Button
            onClick={handleExport}
            disabled={linhas.length === 0 || isExporting}
            size="sm"
            className="gap-1.5"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isExporting ? "Gerando TXT..." : "Exportar TXT Winthor"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border max-h-100 overflow-y-auto relative">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">
                  Valor base (Tabela)
                </TableHead>
                <TableHead className="text-right">Valor promo</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead className="text-right">Taxa/Desc. Plano</TableHead>
                <TableHead className="text-right">Valor no plano</TableHead>
                <TableHead className="text-right">% p/ atingir promo</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linhas.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground h-24"
                  >
                    Nenhum produto adicionado. Preencha o período e busque um
                    produto acima para começar.
                  </TableCell>
                </TableRow>
              )}

              {Object.entries(groupedRows).map(([produtoIdStr, items]) => {
                const produtoId = Number(produtoIdStr);
                const isExpanded = !!expandedProducts[produtoId];
                const firstItem = items[0];
                const totalPlanoCount = items.length;

                // Se estiver recolhido, mostra apenas o primeiro plano
                const itemsToDisplay = isExpanded ? items : [firstItem];

                return (
                  <React.Fragment key={produtoId}>
                    {itemsToDisplay.map((l, index) => {
                      const isFirst = index === 0;
                      return (
                        <TableRow
                          key={`${l.produtoId}-${l.plano}-${index}`}
                          className={
                            !isExpanded && totalPlanoCount > 1
                              ? "bg-muted/20"
                              : ""
                          }
                        >
                          <TableCell className="font-medium flex items-center gap-1.5">
                            {isFirst && totalPlanoCount > 1 ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 hover:bg-muted"
                                onClick={() => toggleExpand(produtoId)}
                                title={
                                  isExpanded
                                    ? "Recolher planos"
                                    : `Ver todos os ${totalPlanoCount} planos`
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-primary" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-primary" />
                                )}
                              </Button>
                            ) : (
                              <span className="w-6" />
                            )}
                            {l.codigo}
                          </TableCell>

                          <TableCell className="pb-3">{l.descricao}</TableCell>

                          <TableCell className="text-right">
                            {fmtBRL(l.valorBase)}
                          </TableCell>

                          <TableCell className="text-right font-semibold">
                            {fmtBRL(l.valorPromocao)}
                          </TableCell>

                          <TableCell>{l.plano}</TableCell>

                          <TableCell className="text-right">
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded ${
                                l.pertxfim < 0
                                  ? "text-green-600 bg-green-50"
                                  : l.pertxfim > 0
                                    ? "text-amber-600 bg-amber-50"
                                    : "text-muted-foreground bg-muted"
                              }`}
                            >
                              {l.pertxfim > 0 ? "+" : ""}
                              {l.pertxfim.toFixed(2).replace(".", ",")}%
                            </span>
                          </TableCell>

                          <TableCell className="text-right">
                            {fmtBRL(l.valorPlano)}
                          </TableCell>

                          <TableCell className="text-right">
                            <Badge
                              variant={
                                l.pctNecessaria <= 0 ? "default" : "destructive"
                              }
                              className="gap-1"
                            >
                              <Percent className="h-3 w-3" />
                              {l.pctNecessaria.toFixed(2).replace(".", ",")}%
                              {l.pctNecessaria > 0
                                ? " ↑"
                                : " ↓"}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-center">
                            {isFirst && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removerProduto(l.produtoId)}
                                title="Remover produto da promoção"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
