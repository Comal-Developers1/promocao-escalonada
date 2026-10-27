export function calcPctNecessaria(
  valorPlano: number,
  valorPromo: number,
): number {
  if (valorPlano === 0) return 0;
  return ((valorPromo - valorPlano) / valorPlano) * 100;
}

export const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatarParaDataBR = (dataISO: string): string => {
  if (!dataISO) return "";
  const partes = dataISO.split("-");
  if (partes.length !== 3) return dataISO; // Retorna como está se já não for ISO
  const [ano, mes, dia] = partes;
  return `${dia}/${mes}/${ano}`;
};
