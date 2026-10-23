package handler

import (
	"fmt"
	"log"
	"net/http"

	promotiontxt "github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/promotion-txt"
	"github.com/gin-gonic/gin"
)

type HandlerTXT struct {
	svc promotiontxt.Service
}

func NewHandlerTXT(svc promotiontxt.Service) *HandlerTXT {
	return &HandlerTXT{svc: svc}
}

func (h *HandlerTXT) ExportTXT(c *gin.Context) {
	var req promotiontxt.ExportTXTRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados de envio incorretos"})
		return
	}

	if len(req.Linhas) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Nenhuma linha informada"})
		return
	}

	// 🟢 Pega o usuário e matrícula enviados pelo frontend (com fallback caso venham vazios)
	usuario := req.Usuario
	if usuario == "" {
		usuario = "SISTEMA"
	}

	matricula := req.Matricula

	// Chama o serviço passando os dados corretos do usuário logado
	fileBytes, err := h.svc.GenerateAndSaveTXT(usuario, matricula, req.Linhas)

	if err != nil {
		log.Printf("[ExportTXT Error]: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro interno ao processar histórico e arquivo"})
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", "attachment; filename=importacao_promocao_winthor.txt")
	c.Header("Content-Type", "text/plain; charset=utf-8")
	c.Data(http.StatusOK, "text/plain; charset=utf-8", fileBytes)
}

func (h *HandlerTXT) GetHistory(c *gin.Context) {
	// Exemplo lendo da query string opcionalmente, ou da session/contexto
	matriculaStr := c.Query("matricula")
	var matricula int
	if matriculaStr != "" {
		fmt.Sscanf(matriculaStr, "%d", &matricula)
	} else {
		// Ou pega da session/contexto se preferir filtrar pelo usuário logado
		matricula = c.GetInt("matricula")
	}

	historico, err := h.svc.GetHistory(matricula)
	if err != nil {
		log.Printf("[GetHistory Error]: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar histórico de promoções"})
		return
	}

	c.JSON(http.StatusOK, historico)
}
