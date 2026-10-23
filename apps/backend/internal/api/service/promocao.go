package service

import (
	"context"
	"fmt"

	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/promocao"
)

type PromocaoSVC struct {
	repo promocao.Repository
}

func NewPromotionSVC(repo promocao.Repository) promocao.Service {
	return &PromocaoSVC{repo: repo}
}

func (s *PromocaoSVC) PaymentPlanSVC(c context.Context) ([]promocao.PaymentPlan, error) {
	return s.repo.PaymentPlanREPO(c)
}

func (s *PromocaoSVC) ProductsSVC(c context.Context, filter promocao.ProductFilter) ([]promocao.ProductDTO, error) {
	if filter.Codprod == "" {
		return nil, fmt.Errorf("Codprod é obrigatorio")
	}

	products, err := s.repo.ProductsREPO(c, filter)
	if err != nil {
		return nil, err
	}

	return products, nil
}
