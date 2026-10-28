package handler

import (
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
	var filter promotiontxt.PromocaoHistoryFilter

	// Faz o bind dos parâmetros da query string (?matricula=...&data_inicio=...&data_fim=...) para a struct
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "parâmetros inválidos: " + err.Error()})
		return
	}

	// Se a matrícula não veio na query string, tenta pegar do contexto/sessão
	if filter.Matricula == 0 {
		if val, exists := c.Get("matricula"); exists {
			if m, ok := val.(int); ok {
				filter.Matricula = m
			}
		}
	}

	// Passa o contexto da requisição (c.Request.Context()) e o filtro para o Service
	historico, err := h.svc.GetHistory(c.Request.Context(), filter)
	if err != nil {
		// Se for o erro de validação que você definiu no service, retorna 400
		if err.Error() == "matricula, datainico e datafim são obrigatorios" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		log.Printf("[GetHistory Error]: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erro ao buscar histórico de promoções"})
		return
	}

	c.JSON(http.StatusOK, historico)
}
