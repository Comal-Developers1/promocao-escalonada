package api

import (
	"github.com/Comal-Developers1/promocao-escalonada.git/configs"
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/handler"
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/repository"
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/service"
)

func PaymentPlanRGS(dbs *configs.DataBases) *handler.HandlerPromotion {
	repo := repository.NewPromotionRepo(*dbs.Oracle)
	svc := service.NewPromotionSVC(repo)
	hdl := handler.NewPromotionHandler(svc)

	return hdl
}

func GenerationTXT(dbs *configs.DataBases) *handler.HandlerTXT {
	repo := repository.NewPromotionSaveRepo(dbs.Postgres)
	svc := service.NewTXTService(repo)
	hdl := handler.NewHandlerTXT(svc)

	return hdl
}

func UpdatePCDESCONTO(dbs *configs.DataBases) *handler.HandlerUpdate {
	repo := repository.NewUpdatePcDesconto(dbs.Oracle)
	svc := service.NewServiceUpdate(repo)
	svc.InitCronJobsUpdateSVC()
	hdl := handler.NewHandlerUpdate(svc)

	return hdl
}
