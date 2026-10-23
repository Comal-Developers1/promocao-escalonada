package promocao

import "context"

type Repository interface {
	PaymentPlanREPO(c context.Context) ([]PaymentPlan, error)
	ProductsREPO(c context.Context, filter ProductFilter) ([]ProductDTO, error)
}

type Service interface {
	PaymentPlanSVC(c context.Context) ([]PaymentPlan, error)
	ProductsSVC(c context.Context, filter ProductFilter) ([]ProductDTO, error)
}
