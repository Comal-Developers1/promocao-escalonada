import { ProductsDTO, PaymentPlans } from "@/types/promotion";

/**
 * Retorna o valor da tabela correspondente ao numpr do plano (1 até 7).
 */
export function getValorTabelaPorNumpr(
  produto: ProductsDTO,
  numpr: number,
): number {
  switch (numpr) {
    case 1:
      return produto.ptabela1;
    case 2:
      return produto.ptabela2;
    case 3:
      return produto.ptabela3;
    case 4:
      return produto.ptabela4;
    case 5:
      return produto.ptabela5;
    case 6:
      return produto.ptabela6;
    case 7:
      return produto.ptabela7;
    default:
      return produto.ptabela1;
  }
}

/**
 * Calcula o valor no plano aplicando o pertxfim e arredondando para 2 casas decimais (centavos).
 */
export function calcularValorNoPlano(
  valorTabela: number,
  pertxfim: number,
): number {
  const taxa = pertxfim || 0;
  const valorCalculado = valorTabela * (1 + taxa / 100);

  // Arredonda para 2 casas decimais para alinhar com o valor monetário exibido na tabela
  return Number(valorCalculado.toFixed(2));
}

/**
 * Calcula a porcentagem baseada na fórmula: ((valorPlano - valorPromocao) / valorPlano) * 100
 */
export function calcularPctPromocao(
  valorPlano: number,
  valorPromocao: number,
): number {
  if (valorPlano === 0) return 0;
  const resultado = ((valorPlano - valorPromocao) / valorPlano) * 100;
  return Number(resultado.toFixed(6));
}
