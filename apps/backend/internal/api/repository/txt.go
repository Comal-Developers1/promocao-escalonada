package repository

import (
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

func (r *promotionSaveRepositoy) ListHistory(matricula int) ([]promotiontxt.Promocao, error) {
	var promocoes []promotiontxt.Promocao

	query := r.db.Preload("Itens").Order("criado_em DESC")

	// Se passar matrícula, filtra por ela. Se for 0, pode retornar tudo ou ajustar conforme regra.
	if matricula > 0 {
		query = query.Where("matricula = ?", matricula)
	}

	if err := query.Find(&promocoes).Error; err != nil {
		return nil, err
	}

	return promocoes, nil
}
