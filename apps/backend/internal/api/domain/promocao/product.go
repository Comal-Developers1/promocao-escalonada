package promocao

type ProductDTO struct {
	Codprod    int     `json:"codprod"`
	Descricao  string  `json:"descricao"`
	Embalagem  string  `json:"embalagem"`
	Unidade    string  `json:"unidade"`
	Disponivel float64 `json:"disponivel"`
	Ptabela1   float64 `json:"ptabela1"`
	Ptabela2   float64 `json:"ptabela2"`
	Ptabela3   float64 `json:"ptabela3"`
	Ptabela4   float64 `json:"ptabela4"`
	Ptabela5   float64 `json:"ptabela5"`
	Ptabela6   float64 `json:"ptabela6"`
	Ptabela7   float64 `json:"ptabela7"`
}

type ProductFilter struct {
	Codprod string `json:"codprod" form:"codprod"`
}
