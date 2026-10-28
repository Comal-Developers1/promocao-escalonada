package promotiontxt

import "context"

type Repository interface {
	SaveHistory(promo *Promocao) error
	ListHistory(c context.Context, filter PromocaoHistoryFilter) ([]Promocao, error) // 🟢 Novo método para buscar histórico
}

type Service interface {
	GenerateAndSaveTXT(usuario string, matricula int, linhas []PromotionRowDTO) ([]byte, error)
	GetHistory(c context.Context, filter PromocaoHistoryFilter) ([]Promocao, error) // 🟢 Novo método no serviço
}
