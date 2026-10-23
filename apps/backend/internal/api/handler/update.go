package handler

import (
	"log"
	"net/http"

	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/update"
	"github.com/gin-gonic/gin"
)

type HandlerUpdate struct {
	svc update.Service
}

func NewHandlerUpdate(svc update.Service) *HandlerUpdate {
	return &HandlerUpdate{svc: svc}
}

func (h *HandlerUpdate) UpdatePCDESCONTO(c *gin.Context) {
	ctx := c.Request.Context()

	err := h.svc.UpdateManual(ctx)

	if err != nil {
		log.Printf("[UpdatePCDESCONTO]: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro interno no servidor"})
		return
	}

	c.JSON(200, gin.H{"message": "Politica escalonada atualizada com sucesso"})
}
