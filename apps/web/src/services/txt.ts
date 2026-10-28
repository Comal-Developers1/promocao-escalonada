import { LinhaTabela } from "@/types/promotion";
import { connectDB } from "./connect";
import { PromocaoHistorico } from "@/types/history";

const api = connectDB();

export async function exportarTxtPromocao(
  usuario: string,
  matricula: number,
  linhas: LinhaTabela[],
) {
  try {
    // Inclui usuario e matricula no corpo da requisição POST
    const response = await api.post(
      "/promotion/file/txt",
      { usuario, matricula, linhas },
      {
        responseType: "blob",
      },
    );

    const blob = new Blob([response.data], {
      type: "text/plain; charset=utf-8",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "importacao_promocao_winthor.txt";
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro na exportação do TXT:", error);
    throw error;
  }
}

export async function buscarHistoricoPromocao(
  matricula: number,
  dataInicio?: string,
  dataFim?: string,
): Promise<PromocaoHistorico[]> {
  const response = await api.get("/promotion/file/history", {
    params: {
      matricula,
      data_inicio: dataInicio || undefined,
      data_fim: dataFim || undefined,
    },
  });
  return response.data;
}
