export interface PromocaoHistoricoItem {
  id: number;
  codigoProduto: string;
  descricaoProduto: string;
  valorBase: number;
  valorPromocao: number;
  planoPagamento: string;
  pertxFim: number;
  valorPlano: number;
  pctNecessaria: number;
  qtdInicio: number;
  qtdFim: number;
}

export interface PromocaoHistorico {
  id: number;
  usuario: string;
  matricula: number;
  dataInicio: string;
  dataFim: string;
  qtdLinhas: number;
  criadoEm: string;
  itens: PromocaoHistoricoItem[];
}
