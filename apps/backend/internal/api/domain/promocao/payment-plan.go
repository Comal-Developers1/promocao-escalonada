package promocao

//Structs e entidades

type PaymentPlan struct {
	Codplpag  int     `json:"codplpag" gorm:"column:CODPLPAG"`
	Descricao string  `json:"descricao" gorm:"column:DESCRICAO"`
	Numdias   int     `json:"numdias" gorm:"column:NUMDIAS"`
	PertxFim  float64 `json:"pertxfim" gorm:"column:PERTXFIM"` // Mapeado explicitamente e como float64
	Numpr     int     `json:"numpr" gorm:"column:NUMPR"`
}
