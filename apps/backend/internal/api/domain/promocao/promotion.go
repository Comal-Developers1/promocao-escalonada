package promocao

type PromotionDTO struct {
	Descricao string  `json:"descricao" gorm:"column:DESCRICAO"`
	DtInicio  string  `json:"dtinicio"  gorm:"column:DTINICIO"`
	DtFim     string  `json:"dtfim"     gorm:"column:DTFIM"`
	Codprod   int     `json:"codprod"   gorm:"column:CODPROD"`
	Produto   string  `json:"produto"   gorm:"column:PRODUTO"`
	QtMinima  float64 `json:"qtminima"  gorm:"column:QTMINIMA"`
	Preco     float64 `json:"preco"     gorm:"column:PRECO"`
}
type PromotionFilter struct {
	DtInicio string `json:"dtinicio" form:"dtinicio"`
	DtFim    string `json:"dtfim" form:"dtfim"`
}
