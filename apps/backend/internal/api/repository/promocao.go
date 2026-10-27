package repository

import (
	"context"

	"github.com/Comal-Developers1/promocao-escalonada.git/db"
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/promocao"
	"gorm.io/gorm"
)

type PromocaoRepo struct {
	oracleDB gorm.DB
}

func NewPromotionRepo(oracleDB gorm.DB) promocao.Repository {
	return &PromocaoRepo{oracleDB: oracleDB}
}

func (r *PromocaoRepo) PaymentPlanREPO(c context.Context) ([]promocao.PaymentPlan, error) {
	var plans []promocao.PaymentPlan

	err := r.oracleDB.WithContext(c).Raw(db.PaymentPlanQuery).Scan(&plans).Error

	if err != nil {
		return nil, err
	}

	return plans, nil

}

func (r *PromocaoRepo) ProductsREPO(c context.Context, filter promocao.ProductFilter) ([]promocao.ProductDTO, error) {
	var products []promocao.ProductDTO

	err := r.oracleDB.WithContext(c).Raw(db.ProductsQuery, filter.Codprod).Scan(&products).Error

	if err != nil {
		return make([]promocao.ProductDTO, 0), err
	}

	return products, nil
}

func (r *PromocaoRepo) PromotionREPO(c context.Context, filter promocao.PromotionFilter) ([]promocao.PromotionDTO, error) {
	query := db.PromotionQuery
	var promotions []promocao.PromotionDTO

	err := r.oracleDB.WithContext(c).Raw(query, filter.DtInicio, filter.DtFim).Scan(&promotions).Error

	if err != nil {
		return make([]promocao.PromotionDTO, 0), err
	}

	return promotions, nil
}
