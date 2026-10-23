export interface ProductsDTO {
  codprod: number;
  descricao: string;
  embalagem: string;
  unidade: string;
  disponivel: number;
  ptabela1: number;
  ptabela2: number;
  ptabela3: number;
  ptabela4: number;
  ptabela5: number;
  ptabela6: number;
  ptabela7: number;
}

export type ProductFilter = {
  codprod: string;
};

export interface LinhaTabela {
  produtoId: number;
  codigo: string;
  descricao: string;
  valorBase: number;
  valorPromocao: number;
  plano: string;
  pertxfim: number;
  valorPlano: number;
  pctNecessaria: number;
  dataInicio: string; // <-- Novo
  dataFim: string; // <-- Novo
  qtdInicio: number; // <-- Novo
  qtdFim: number; // <-- Novo
}

export interface PaymentPlans {
  codplpag: number;
  descricao: string;
  numdias: number;
  pertxfim: number;
  numpr: number;
}
