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
  Download,
  Loader2,
  History as HistoryIcon,
  Calendar,
} from "lucide-react";
import { usePromotionHistory } from "@/hooks/use-history";
import { exportarTxtPromocao } from "@/services/txt";
import { LinhaTabela } from "@/types/promotion";
import { PromocaoHistorico } from "@/types/history";

export function PromotionHistoryList() {
  const { data: historico, isLoading, isError } = usePromotionHistory();
  const [downloadingId, setDownloadingId] = React.useState<number | null>(null);

  const handleReexport = async (hist: PromocaoHistorico) => {
    setDownloadingId(hist.id);
    try {
      const linhasMapeadas: LinhaTabela[] = hist.itens.map((item) => ({
        produtoId: item.id,
        codigo: item.codigoProduto,
        descricao: item.descricaoProduto,
        valorBase: item.valorBase,
        valorPromocao: item.valorPromocao,
        plano: item.planoPagamento,
        pertxfim: item.pertxFim,
        valorPlano: item.valorPlano,
        pctNecessaria: item.pctNecessaria,
        qtdInicio: item.qtdInicio,
        qtdFim: item.qtdFim,
        dataInicio: hist.dataInicio.split("T")[0],
        dataFim: hist.dataFim.split("T")[0],
      }));

      await exportarTxtPromocao(hist.usuario, hist.matricula, linhasMapeadas);
    } catch (error) {
      console.error("Erro ao baixar TXT do histórico:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const cleanDate = dateStr.split("T")[0];
    const [year, month, day] = cleanDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "";
    // 🟢 Remove a letra Z para evitar que o navegador aplique -3h duas vezes
    const cleanDateStr = dateStr.replace("Z", "");
    const date = new Date(cleanDateStr);

    return date.toLocaleString("pt-BR");
  };
  
  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">
            Histórico de Lotes Exportados
          </CardTitle>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border max-h-100 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
              <TableRow>
                <TableHead>ID Lote</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Período Promoção</TableHead>
                <TableHead className="text-center">Qtd Linhas</TableHead>
                <TableHead>Gerado em</TableHead>
                <TableHead className="text-center">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-destructive h-24"
                  >
                    Erro ao carregar o histórico de promoções.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && (!historico || historico.length === 0) && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground h-24"
                  >
                    Nenhum histórico de exportação encontrado para este usuário.
                  </TableCell>
                </TableRow>
              )}

              {historico?.map((hist) => (
                <TableRow key={hist.id}>
                  <TableCell className="font-medium">#{hist.id}</TableCell>
                  <TableCell>
                    {hist.usuario} (Mat: {hist.matricula})
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(hist.dataInicio)} até{" "}
                      {formatDate(hist.dataFim)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{hist.qtdLinhas} itens</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(hist.criadoEm)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReexport(hist)}
                      disabled={downloadingId === hist.id}
                      className="gap-1.5"
                    >
                      {downloadingId === hist.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                      Baixar TXT
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
