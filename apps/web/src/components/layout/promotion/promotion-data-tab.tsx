"use client";

import React from "react";
import { PromotionDTO } from "@/types/promotion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PromotionDataTabProps {
  data: PromotionDTO[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

export const PromotionDataTab: React.FC<PromotionDataTabProps> = ({
  data,
  isLoading,
  isError,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Carregando promoções...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Erro ao buscar os dados de promoção do servidor.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card shadow-sm">
        Nenhuma promoção encontrada para o período informado.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Início</TableHead>
            <TableHead>Fim</TableHead>
            <TableHead>Cód. Prod</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Qtd Mínima</TableHead>
            <TableHead className="text-right">Preço (R$)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={`${item.codprod}-${index}`}>
              <TableCell className="font-medium">{item.descricao}</TableCell>
              <TableCell>{item.dtinicio}</TableCell>
              <TableCell>{item.dtfim}</TableCell>
              <TableCell>{item.codprod}</TableCell>
              <TableCell>{item.produto}</TableCell>
              <TableCell className="text-right">{item.qtminima}</TableCell>
              <TableCell className="text-right font-semibold">
                {item.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
