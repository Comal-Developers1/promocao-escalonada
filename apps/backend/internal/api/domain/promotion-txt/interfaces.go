package promotiontxt

type Repository interface {
	SaveHistory(promo *Promocao) error
	ListHistory(matricula int) ([]Promocao, error) // 🟢 Novo método para buscar histórico
}

type Service interface {
	GenerateAndSaveTXT(usuario string, matricula int, linhas []PromotionRowDTO) ([]byte, error)
	GetHistory(matricula int) ([]Promocao, error) // 🟢 Novo método no serviço
}
