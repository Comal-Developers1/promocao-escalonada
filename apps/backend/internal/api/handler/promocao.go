package handler

import (
	"log"
	"net/http"

	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/promocao"
	"github.com/gin-gonic/gin"
)

type HandlerPromotion struct {
	svc promocao.Service
}

func NewPromotionHandler(svc promocao.Service) *HandlerPromotion {
	return &HandlerPromotion{svc: svc}
}

func (h *HandlerPromotion) GetPaymentPlan(c *gin.Context) {
	result, err := h.svc.PaymentPlanSVC(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro interno ao buscar planos de pagamentos"})
		log.Printf("[GetPaymentPlan]: %v", err)
		return
	}

	c.JSON(200, result)
}

func (h *HandlerPromotion) GetProducts(c *gin.Context) {
	var filters promocao.ProductFilter

	if err := c.ShouldBindQuery(&filters); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Parâmetros invalidos"})
		return
	}

	if filters.Codprod == "" {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Codprod é obrigatorio"})
		return
	}

	result, err := h.svc.ProductsSVC(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": "Erro interno no servidor ao buscar produtos"})
		log.Printf("[GetProducts]: %v", err)
		return
	}

	c.JSON(http.StatusOK, result)
}

func (h *HandlerPromotion) GetPromotion(c *gin.Context) {
	var filters promocao.PromotionFilter

	if err := c.ShouldBindQuery(&filters); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Parâmetros ivalidos"})
		return
	}

	if filters.DtInicio == "" || filters.DtFim == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Data inicio e data fim vazias"})
		return
	}

	result, err := h.svc.PromotionSVC(c.Request.Context(), filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno no servidor"})
		log.Printf("Erro ao buscar promoções: %v", err)
		return
	}

	c.JSON(200, result)
}
