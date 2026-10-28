package promotiontxt

import "time"

type PromotionRowDTO struct {
	Codigo        string  `json:"codigo"`
	Descricao     string  `json:"descricao"`
	ValorBase     float64 `json:"valorBase"`
	ValorPromocao float64 `json:"valorPromocao"`
	Plano         string  `json:"plano"`
	PertxFim      float64 `json:"pertxfim"`
	ValorPlano    float64 `json:"valorPlano"`
	PctNecessaria float64 `json:"pctNecessaria"`
	DataInicio    string  `json:"dataInicio"`
	DataFim       string  `json:"dataFim"`
	QtdInicio     float64 `json:"qtdInicio"`
	QtdFim        float64 `json:"qtdFim"`
}

type ExportTXTRequest struct {
	Usuario   string            `json:"usuario"`
	Matricula int               `json:"matricula"`
	Linhas    []PromotionRowDTO `json:"linhas"`
}

type Promocao struct {
	ID         uint           `gorm:"primaryKey;column:id" json:"id"`
	Usuario    string         `gorm:"column:usuario" json:"usuario"`
	Matricula  int            `gorm:"column:matricula" json:"matricula"`
	DataInicio string         `gorm:"column:data_inicio;type:date" json:"dataInicio"` // 🟢 Ajustado para data_inicio
	DataFim    string         `gorm:"column:data_fim;type:date" json:"dataFim"`       // 🟢 Ajustado para data_fim
	QtdLinhas  int            `gorm:"column:qtd_linhas" json:"qtdLinhas"`
	CriadoEm   time.Time      `gorm:"column:criado_em;autoCreateTime" json:"criadoEm"`
	Itens      []PromocaoItem `gorm:"foreignKey:PromocaoID" json:"itens,omitempty"`
}

func (Promocao) TableName() string {
	return "promocoes"
}

type PromocaoHistoryFilter struct {
	Matricula  int        `json:"matricula" form:"matricula"`
	DataInicio *time.Time `json:"data_inicio" form:"data_inicio" time_format:"2006-01-02"`
	DataFim    *time.Time `json:"data_fim" form:"data_fim" time_format:"2006-01-02"`
}

type PromocaoItem struct {
	ID               uint      `gorm:"primaryKey;column:id" json:"id"`
	PromocaoID       uint      `gorm:"column:promocao_id" json:"promocaoId"`
	CodigoProduto    string    `gorm:"column:codigo_produto" json:"codigoProduto"`
	DescricaoProduto string    `gorm:"column:descricao_produto" json:"descricaoProduto"`
	ValorBase        float64   `gorm:"column:valor_base" json:"valorBase"`
	ValorPromocao    float64   `gorm:"column:valor_promocao" json:"valorPromocao"`
	PlanoPagamento   string    `gorm:"column:plano_pagamento" json:"planoPagamento"`
	PertxFim         float64   `gorm:"column:pertxfim" json:"pertxfim"`
	ValorPlano       float64   `gorm:"column:valor_plano" json:"valorPlano"`
	PctNecessaria    float64   `gorm:"column:pct_necessaria" json:"pctNecessaria"`
	QtdInicio        float64   `gorm:"column:qtd_inicio" json:"qtdInicio"`
	QtdFim           float64   `gorm:"column:qtd_fim" json:"qtdFim"`
	CriadoEm         time.Time `gorm:"column:criado_em;autoCreateTime" json:"criadoEm"`
}

func (PromocaoItem) TableName() string {
	return "promocao_itens"
}
