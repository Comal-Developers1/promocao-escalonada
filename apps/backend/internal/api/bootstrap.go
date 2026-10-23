package api

import (
	"fmt"
	"log"
	"time"

	"github.com/Comal-Developers1/promocao-escalonada.git/configs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func Bootstrap() { // Nota: Corrigido também o typo "unc" para "func"
	cfg := configs.Load()

	dbs := configs.InitDatabases()

	// Pega o *sql.DB subjacente para conseguir fechar a conexão
	if sqlDB, err := dbs.Oracle.DB(); err == nil {
		defer sqlDB.Close()
	}

	// Default inicializa com os middlewares Logger e Recovery configurados para usar o gin.DefaultWriter
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://192.168.1.79:3000", "http://localhost:3001", "http://painelcomal:4024", "https://painelcomal.duckdns.org"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	HdlPaymentPlan := PaymentPlanRGS(dbs)
	HdlGenerationTXT := GenerationTXT(dbs)
	HdlUpdate := UpdatePCDESCONTO(dbs)

	SetupRoutes(r, *HdlPaymentPlan, HdlGenerationTXT, *HdlUpdate)

	if err := r.Run(fmt.Sprintf(":%s", cfg.ServerPort)); err != nil {
		log.Fatalf("[bootstrap] erro ao iniciar servidor: %v", err)
	}
}
