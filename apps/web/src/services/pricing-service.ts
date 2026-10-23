// Exemplo de função pura de cálculo
export function calcularPctNecessaria(
  valorPlano: number,
  valorPromo: number,
): number {
  if (valorPlano === 0) return 0;
  return ((valorPromo - valorPlano) / valorPlano) * 100;
}
