"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  FilterX,
  Package,
} from "lucide-react";
import { usePromotionHistory } from "@/hooks/use-history";
import { exportarTxtPromocao } from "@/services/txt";
import { LinhaTabela } from "@/types/promotion";
import { PromocaoHistorico } from "@/types/history";

// Função utilitária para pegar a data atual no formato YYYY-MM-DD
const getHojeFormatado = () => {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export function PromotionHistoryList() {
  // Inicializa os estados com a data de hoje por padrão
  const [dataInicio, setDataInicio] =
    React.useState<string>(getHojeFormatado());
  const [dataFim, setDataFim] = React.useState<string>(getHojeFormatado());

  // Hook escutando as mudanças das datas
  const {
    data: historico,
    isLoading,
    isError,
  } = usePromotionHistory(dataInicio, dataFim);

  const [downloadingId, setDownloadingId] = React.useState<number | null>(null);

  const handleResetarHoje = () => {
    const hoje = getHojeFormatado();
    setDataInicio(hoje);
    setDataFim(hoje);
  };

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

    const clean = dateStr.split(".")[0].replace("Z", "");
    const [datePart, timePart] = clean.split("T");

    if (!datePart || !timePart) return dateStr;

    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");

    return `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
  };

  // Verifica se o filtro atual é diferente de "hoje" para decidir se exibe o botão de resetar
  const hoje = getHojeFormatado();
  const isDiferenteDeHoje = dataInicio !== hoje || dataFim !== hoje;

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-base">
            Histórico de Lotes Exportados
          </CardTitle>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* --- Filtros de Data --- */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              De:
            </span>
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="h-8 w-auto text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground font-medium">
              Até:
            </span>
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="h-8 w-auto text-xs"
            />
          </div>

          {isDiferenteDeHoje && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetarHoje}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Voltar para a data de hoje"
            >
              <FilterX className="h-4 w-4 mr-1" />
              Hoje
            </Button>
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
                <TableHead>Produtos</TableHead>
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
                    Nenhum histórico de exportação encontrado para o período.
                  </TableCell>
                </TableRow>
              )}

              {historico?.map((hist) => {
                // Extrai apenas os códigos de produtos únicos do array de itens usando Set
                const codigosUnicos = Array.from(
                  new Set(hist.itens.map((item) => item.codigoProduto)),
                );

                return (
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
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1 max-w-xs">
                        {codigosUnicos.map((codigo) => (
                          <Badge
                            key={codigo}
                            variant="outline"
                            className="text-xs font-mono"
                          >
                            <Package className="h-3 w-3 mr-1 text-muted-foreground" />
                            {codigo}
                          </Badge>
                        ))}
                      </div>
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
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
