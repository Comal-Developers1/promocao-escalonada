export function calcPctNecessaria(valorPlano: number, valorPromo: number): number {
  if (valorPlano === 0) return 0;
  return ((valorPromo - valorPlano) / valorPlano) * 100;
}

export const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
