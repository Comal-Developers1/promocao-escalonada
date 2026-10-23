"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import { ProductsDTO } from "@/types/promotion";
import { fmtBRL } from "@/utils/format";

interface ProductSearchFormProps {
  dataInicio: string;
  setDataInicio: (v: string) => void;
  dataFim: string;
  setDataFim: (v: string) => void;
  isDatasPreenchidas: boolean;
  termo: string;
  setTermo: (v: string) => void;
  sugestoes: ProductsDTO[];
  aberto: boolean;
  setAberto: (v: boolean) => void;
  selecionado: ProductsDTO | null;
  valorPromo: string;
  setValorPromo: (v: string) => void;
  qtdInicio: string;
  setQtdInicio: (v: string) => void;
  qtdFim: string;
  setQtdFim: (v: string) => void;
  selecionarProduto: (p: ProductsDTO) => void;
  adicionarProduto: () => void;
}

export function ProductSearchForm({
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
  selecionarProduto,
  adicionarProduto,
}: ProductSearchFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTermo(val);
    if (val.trim().length > 0 && !selecionado && isDatasPreenchidas) {
      setAberto(true);
    } else {
      setAberto(false);
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader>
        <CardTitle className="text-base">
          Adicionar produto à promoção
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-visible">
        {/* 1. Bloco de Datas no Topo (Obrigatório) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg border">
          <div className="space-y-1.5">
            <Label htmlFor="dataInicio">Data Início da Promoção *</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dataFim">Data Fim da Promoção *</Label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>
        </div>

        {/* Aviso se as datas não estiverem preenchidas */}
        {!isDatasPreenchidas && (
          <p className="text-sm text-amber-600 font-medium">
            ⚠️ Preencha a data de início e fim da promoção acima para liberar a
            busca de produtos.
          </p>
        )}

        {/* 2. Demais Campos (Bloqueados se não houver datas) */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-end transition-opacity ${!isDatasPreenchidas ? "opacity-50 pointer-events-none" : ""}`}
        >
          {/* Autocomplete de Código */}
          <div className="space-y-1.5 w-full relative">
            <Label htmlFor="codigo">Código do produto</Label>
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <Input
                ref={inputRef}
                id="codigo"
                className="pl-7"
                placeholder="Ex: ARROZ..."
                disabled={!isDatasPreenchidas}
                value={termo}
                onChange={handleInputChange}
                onFocus={() => {
                  if (
                    termo.trim().length > 0 &&
                    !selecionado &&
                    isDatasPreenchidas
                  ) {
                    setAberto(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => setAberto(false), 200);
                }}
              />

              {aberto && isDatasPreenchidas && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-popover text-popover-foreground border rounded-md shadow-xl overflow-hidden">
                  {sugestoes.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Nenhum produto encontrado para &quot;{termo}&quot;
                    </div>
                  ) : (
                    <ul className="max-h-64 overflow-auto py-1">
                      {sugestoes.map((p) => (
                        <li
                          key={p.codprod}
                          className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            selecionarProduto(p);
                            setAberto(false);
                          }}
                        >
                          <div>
                            <span className="font-medium">{p.codprod}</span>
                            <span className="text-muted-foreground">
                              {" "}
                              — {p.descricao}
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {fmtBRL(p.ptabela1)}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Valor Base (Somente leitura) */}
          <div className="space-y-1.5">
            <Label>Valor base (PTABELA1)</Label>
            <Input
              readOnly
              value={selecionado ? fmtBRL(selecionado.ptabela1) : ""}
              placeholder="Selecione um produto"
              className="bg-muted"
            />
          </div>

          {/* Valor de Promoção e Quantidades */}
          <div className="space-y-4 md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="promo">Valor de Promoção (R$)</Label>
              <Input
                id="promo"
                inputMode="decimal"
                placeholder="0,00"
                disabled={!isDatasPreenchidas}
                value={valorPromo}
                onChange={(e) =>
                  setValorPromo(e.target.value.replace(/[^\d.,]/g, ""))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qtdInicio">Qtd. Início</Label>
              <Input
                id="qtdInicio"
                inputMode="numeric"
                placeholder="0"
                disabled={!isDatasPreenchidas}
                value={qtdInicio}
                onChange={(e) =>
                  setQtdInicio(e.target.value.replace(/\D/g, ""))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qtdFim">Qtd. Fim (Padrão 150)</Label>
              <Input
                id="qtdFim"
                inputMode="numeric"
                placeholder="150"
                disabled={!isDatasPreenchidas}
                value={qtdFim}
                onChange={(e) => setQtdFim(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="mt-5">
              <Button
                className="w-full"
                onClick={adicionarProduto}
                disabled={!selecionado || !valorPromo || !isDatasPreenchidas || !qtdInicio || !qtdFim }
              >
                <Plus className="mr-1 h-4 w-4" /> Adicionar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
