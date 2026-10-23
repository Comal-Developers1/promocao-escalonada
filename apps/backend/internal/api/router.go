package api

import (
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/handler"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine, pay handler.HandlerPromotion, txt *handler.HandlerTXT, update handler.HandlerUpdate) {
	v1 := r.Group("/api/v1")

	v2 := v1.Group("/promotion")
	v2.GET("/payment-plans", pay.GetPaymentPlan)
	v2.GET("/products", pay.GetProducts)
	v2.GET("/update", update.UpdatePCDESCONTO)

	v3 := v2.Group("/file")

	v3.POST("/txt", txt.ExportTXT)
	v3.GET("/history", txt.GetHistory)
}
