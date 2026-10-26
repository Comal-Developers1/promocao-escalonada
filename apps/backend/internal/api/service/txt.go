package service

import (
	"bytes"
	"fmt"
	"strings"

	promotiontxt "github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/promotion-txt"
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/utils"
)

type TXTService struct {
	repo promotiontxt.Repository // 🟢 Aponta para a interface definida no domínio
}

func NewTXTService(repo promotiontxt.Repository) *TXTService {
	return &TXTService{repo: repo}
}

func (s *TXTService) GenerateAndSaveTXT(usuario string, matricula int, linhas []promotiontxt.PromotionRowDTO) ([]byte, error) {
	if len(linhas) == 0 {
		return nil, fmt.Errorf("nenhuma linha informada para exportação")
	}

	// 1. Mapeia os dados para as structs do banco (Master-Detail)
	promocao := promotiontxt.Promocao{
		Usuario:    usuario,
		Matricula:  matricula,
		DataInicio: linhas[0].DataInicio,
		DataFim:    linhas[0].DataFim,
		QtdLinhas:  len(linhas),
	}

	for _, l := range linhas {
		promocao.Itens = append(promocao.Itens, promotiontxt.PromocaoItem{
			CodigoProduto:    l.Codigo,
			DescricaoProduto: l.Descricao,
			ValorBase:        l.ValorBase,
			ValorPromocao:    l.ValorPromocao,
			PlanoPagamento:   l.Plano,
			PertxFim:         l.PertxFim,
			ValorPlano:       l.ValorPlano,
			PctNecessaria:    l.PctNecessaria,
			QtdInicio:        l.QtdInicio,
			QtdFim:           l.QtdFim,
		})
	}

	// 2. Salva o histórico no PostgreSQL
	if err := s.repo.SaveHistory(&promocao); err != nil {
		return nil, err
	}

	// 3. Gera o conteúdo do TXT conforme a estrutura da imagem Winthor
	var buffer bytes.Buffer

	for _, l := range linhas {
		dataIni := utils.FormatarDataWinthor(l.DataInicio)
		dataFim := utils.FormatarDataWinthor(l.DataFim)

		percenStr := fmt.Sprintf("%.4f", l.PctNecessaria)
		percenStr = strings.ReplaceAll(percenStr, ".", ",")

		// 🟢 Formata a quantidade início com casas decimais (ex: 2 casas) e troca ponto por vírgula
		qtdInicioStr := fmt.Sprintf("%.2f", l.QtdInicio)
		qtdInicioStr = strings.ReplaceAll(qtdInicioStr, ".", ",")

		qtdFimStr := fmt.Sprintf("%.2f", l.QtdFim)
		qtdFimStr = strings.ReplaceAll(qtdFimStr, ".", ",")

		// Mapeamento correto com as variáveis formatadas
		line := fmt.Sprintf(
			"%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n",
			l.Codigo,  // 1. PRODUTO
			dataIni,   // 2. INICIO
			dataFim,   // 3. FIM
			percenStr, // 4. PERCEN
			"",        // 5. Vazio (1º de 4 entre Percen e Praca)
			"",        // 6. Vazio (2º)
			"",        // 7. Vazio (3º)
			"",        // 8. Vazio (4º)
			"1",       // 9. PRACA (Fixo: 1)
			"",        // 10. Vazio (1º de 5 entre Praca e Plano)
			"",        // 11. Vazio (2º)
			"",        // 12. Vazio (3º)
			"",        // 13. Vazio (4º)
			"",        // 14. Vazio (5º)
			l.Plano,   // 15. PLA PGTO (Código do Plano)
			"N",       // 16. APLI DESC
			"S",       // 18. CLASSE
			"S",       // 19. CESTA
			"",        // 20. COD PRIN
			"",        // 21. CREDITA SPLIT
			"",        // 22. ORIGEM PED
			"N",
			"O", // 23. TIPO APLIC DESC
			"",  // 24. TIP CARG / DESC REDE
			"",
			"",
			qtdInicioStr,          // 25. QT INICIAL (Agora formatado como string com decimal)
			qtdFimStr,             // 26. QT FINAL (Agora formatado como string com decimal)
			"S",                   // 27. PRIORITARIA
			"S",                   // 28. PRIORITARIA GERAL
			"POLITICA ESCALONADA", // 29. DESCRICAO
			"",
			"",
			"1",
		)

		buffer.WriteString(line)
	}

	return buffer.Bytes(), nil
}

func (s *TXTService) GetHistory(matricula int) ([]promotiontxt.Promocao, error) {
	return s.repo.ListHistory(matricula)
}
