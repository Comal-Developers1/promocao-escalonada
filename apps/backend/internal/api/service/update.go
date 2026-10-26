package service

import (
	"context"
	"log"
	"time"

	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/update"
	"github.com/robfig/cron/v3"
)

type service struct {
	repo update.Repository
}

func NewServiceUpdate(repo update.Repository) update.Service {
	return &service{repo: repo}
}

func (s *service) UpdateManual(c context.Context) error {
	return s.repo.UpdatePcDescontoREPO(c)
}

func (s *service) InitCronJobsUpdateSVC() {
	cronScheduler := cron.New(
		cron.WithLocation(time.Local),
		cron.WithSeconds(),
	)
	
	_, err := cronScheduler.AddFunc("@every 10s", func() {
		log.Println("[CRON] Verificando registros pendentes para atualização da PCDESCONTO...")

		// 🟢 3. Timeout ajustado para 10 segundos (compatível com o intervalo de execução)
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// O UpdateManual já possui a cláusula WHERE/CHECK para que só afete/custe se houver dados pendentes (IS NULL)
		if err := s.UpdateManual(ctx); err != nil {
			log.Printf("[CRON] Erro ao atualizar política escalonada: %v\n", err)
		} else {
			log.Println("[CRON] PCDESCONTO verificado/atualizado com sucesso via Cron!")
		}
	})

	if err != nil {
		log.Fatalf("[CRON] Erro ao configurar o agendador: %v", err)
	}

	cronScheduler.Start()
	log.Println("[CRON] Agendador de atualização da PCDESCONTO iniciado a cada 10 segundos.")
}
