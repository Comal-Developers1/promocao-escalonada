package repository

import (
	"context"
	"time"

	promotiontxt "github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/promotion-txt"
	"gorm.io/gorm"
)

type promotionSaveRepositoy struct {
	db *gorm.DB
}

func NewPromotionSaveRepo(db *gorm.DB) promotiontxt.Repository {
	return &promotionSaveRepositoy{db: db}
}

func (r *promotionSaveRepositoy) SaveHistory(promo *promotiontxt.Promocao) error {
	if err := r.db.Create(promo).Error; err != nil {
		return err
	}
	return nil
}

func (r *promotionSaveRepositoy) ListHistory(c context.Context, filter promotiontxt.PromocaoHistoryFilter) ([]promotiontxt.Promocao, error) {
	var promocoes []promotiontxt.Promocao

	query := r.db.Preload("Itens").Order("criado_em DESC")

	if filter.Matricula > 0 {
		query = query.Where("matricula = ?", filter.Matricula)
	}

	// Filtra a partir da data inicial (se informada)
	if filter.DataInicio != nil {
		query = query.Where("criado_em >= ?", &filter.DataInicio)
	}

	if filter.DataFim != nil {
		// 🟢 Define o final do dia (23:59:59) para a data de fim
		dataFimAjustada := time.Date(
			filter.DataFim.Year(),
			filter.DataFim.Month(),
			filter.DataFim.Day(),
			23, 59, 59, 999999999,
			filter.DataFim.Location(),
		)
		query = query.Where("criado_em <= ?", dataFimAjustada)
	}
	if err := query.Find(&promocoes).Error; err != nil {
		return nil, err
	}

	return promocoes, nil
}
