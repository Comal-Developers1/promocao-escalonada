"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Calendar, Trash2 } from "lucide-react";
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
  setSelecionado?: (p: ProductsDTO | null) => void;
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
  setSelecionado,
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
  const promoRef = React.useRef<HTMLInputElement>(null);
  const qtdInicioRef = React.useRef<HTMLInputElement>(null);

  // 1. Restauração ao carregar a página
  React.useEffect(() => {
    const savedDataInicio = localStorage.getItem("promo_dataInicio");
    const savedDataFim = localStorage.getItem("promo_dataFim");
    const savedQtdInicio = localStorage.getItem("promo_qtdInicio");
    const savedQtdFim = localStorage.getItem("promo_qtdFim");
    const savedTermo = localStorage.getItem("promo_termo");
    const savedValorPromo = localStorage.getItem("promo_valorPromo");
    const savedSelecionado = localStorage.getItem("promo_selecionado");

    if (savedDataInicio) setDataInicio(savedDataInicio);
    if (savedDataFim) setDataFim(savedDataFim);
    if (savedQtdInicio) setQtdInicio(savedQtdInicio);
    if (savedQtdFim) setQtdFim(savedQtdFim);
    if (savedTermo) setTermo(savedTermo);
    if (savedValorPromo) setValorPromo(savedValorPromo);

    if (savedSelecionado) {
      try {
        const produtoObjeto: ProductsDTO = JSON.parse(savedSelecionado);
        if (produtoObjeto) {
          selecionarProduto(produtoObjeto);
          if (setSelecionado) setSelecionado(produtoObjeto);
        }
      } catch (e) {
        console.error("Erro ao fazer parse do produto salvo:", e);
      }
    }
  }, []);

  // 2. Salva os campos simples no localStorage
  React.useEffect(() => {
    if (dataInicio) localStorage.setItem("promo_dataInicio", dataInicio);
    else localStorage.removeItem("promo_dataInicio");

    if (dataFim) localStorage.setItem("promo_dataFim", dataFim);
    else localStorage.removeItem("promo_dataFim");

    if (qtdInicio) localStorage.setItem("promo_qtdInicio", qtdInicio);
    else localStorage.removeItem("promo_qtdInicio");

    if (qtdFim) localStorage.setItem("promo_qtdFim", qtdFim);
    else localStorage.removeItem("promo_qtdFim");

    if (termo) localStorage.setItem("promo_termo", termo);
    else localStorage.removeItem("promo_termo");

    if (valorPromo) localStorage.setItem("promo_valorPromo", valorPromo);
    else localStorage.removeItem("promo_valorPromo");
  }, [dataInicio, dataFim, qtdInicio, qtdFim, termo, valorPromo]);

  // 3. Salva o produto selecionado no localStorage sempre que ele mudar
  React.useEffect(() => {
    if (selecionado) {
      localStorage.setItem("promo_selecionado", JSON.stringify(selecionado));
    } else {
      localStorage.removeItem("promo_selecionado");
    }
  }, [selecionado]);

  const handleAdicionarProduto = () => {
    adicionarProduto();

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 50);
  };

  const handleLimparFiltros = () => {
    setDataInicio("");
    setDataFim("");
    setTermo("");
    setValorPromo("");
    setQtdInicio("");
    setQtdFim("99999");
    if (setSelecionado) setSelecionado(null);

    localStorage.removeItem("promo_dataInicio");
    localStorage.removeItem("promo_dataFim");
    localStorage.removeItem("promo_qtdInicio");
    localStorage.removeItem("promo_qtdFim");
    localStorage.removeItem("promo_termo");
    localStorage.removeItem("promo_valorPromo");
    localStorage.removeItem("promo_selecionado");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatarData = (date: Date) => {
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const dia = String(date.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const aplicarAtalhoHoje = () => {
    const hoje = formatarData(new Date());
    setDataInicio(hoje);
    setDataFim(hoje);
  };

  const aplicarAtalhoAmanha = () => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataAmanha = formatarData(amanha);
    setDataInicio(dataAmanha);
    setDataFim(dataAmanha);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setTermo(val);
    if (val.trim().length > 0 && !selecionado && isDatasPreenchidas) {
      setAberto(true);
    } else {
      setAberto(false);
    }
  };

  return (
    <Card className="overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">
          Adicionar produto à promoção
        </CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 text-xs text-muted-foreground hover:text-destructive gap-1"
          onClick={handleLimparFiltros}
        >
          <Trash2 className="h-3.5 w-3.5" /> Limpar Filtros
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 overflow-visible">
        {/* Bloco de Datas */}
        <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {!isDatasPreenchidas && (
          <p className="text-sm text-amber-600 font-medium">
            ⚠️ Preencha a data de início e fim da promoção acima para liberar a
            busca de produtos.
          </p>
        )}

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
                placeholder="Ex: 12345..."
                inputMode="numeric"
                disabled={!isDatasPreenchidas}
                value={termo}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Tab" || e.key === "Enter") {
                    if (aberto && sugestoes.length > 0) {
                      e.preventDefault();
                      const produtoParaSelecionar = sugestoes[0];
                      if (produtoParaSelecionar) {
                        selecionarProduto(produtoParaSelecionar);
                        setTermo(
                          `${produtoParaSelecionar.codprod} - ${produtoParaSelecionar.descricao}`,
                        );
                        setAberto(false);
                      }
                    } else if (e.key === "Enter") {
                      // Se o menu estiver fechado e apertar Enter no código, pula para o campo de Valor Promo
                      e.preventDefault();
                      promoRef.current?.focus();
                    }
                  }
                }}
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
                            setTermo(`${p.codprod} - ${p.descricao}`);
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

          {/* Valor Base */}
          <div className="space-y-1.5">
            <Label>Valor base (PTABELA1)</Label>
            <Input
              readOnly
              value={selecionado ? fmtBRL(selecionado.ptabela1) : ""}
              placeholder="Selecione um produto"
              className="bg-muted"
              disabled
            />
          </div>

          {/* Valor de Promoção e Quantidades */}
          <div className="space-y-4 md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="promo">Valor de Promoção (R$)</Label>
              <Input
                ref={promoRef}
                id="promo"
                inputMode="decimal"
                placeholder="0,00"
                disabled={!isDatasPreenchidas}
                value={valorPromo}
                onChange={(e) =>
                  setValorPromo(e.target.value.replace(/[^\d.,]/g, ""))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    qtdInicioRef.current?.focus(); // Vai para Qtd. Início ao apertar Enter
                  }
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qtdInicio">Qtd. Início</Label>
              <Input
                ref={qtdInicioRef}
                id="qtdInicio"
                inputMode="decimal"
                placeholder="0,0"
                disabled={!isDatasPreenchidas}
                value={qtdInicio}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^\d.,]/g, "");
                  const partes = val.split(/[,.]/);
                  if (partes.length > 2) {
                    val = partes[0] + "," + partes.slice(1).join("");
                  }
                  setQtdInicio(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // Se os campos forem válidos, adiciona o produto ao apertar Enter na quantidade!
                    if (selecionado && valorPromo && qtdInicio) {
                      handleAdicionarProduto();
                    }
                  }
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="qtdFim">Qtd. Fim (Padrão 99999)</Label>
              <Input
                id="qtdFim"
                inputMode="numeric"
                placeholder="99999"
                disabled
                value={qtdFim}
                onChange={(e) => setQtdFim(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="mt-5">
              <Button
                className="w-full"
                onClick={handleAdicionarProduto}
                disabled={
                  !selecionado ||
                  !valorPromo ||
                  !isDatasPreenchidas ||
                  !qtdInicio ||
                  !qtdFim
                }
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
