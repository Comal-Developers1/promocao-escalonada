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
	cronScheduler := cron.New(cron.WithLocation(time.Local))

	// Exemplo: Executa todo dia à meia-noite ("0 0 * * *")
	_, err := cronScheduler.AddFunc("*/3 * * * *", func() {
		log.Println("[CRON] Iniciando atualização automática da PCDESCONTO...")

		// Como o cron não tem requisição HTTP, criamos um contexto com timeout de segurança de 5 minutos
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Minute)
		defer cancel()

		// O cron chama o mesmo método do service, passando o contexto
		if err := s.UpdateManual(ctx); err != nil {
			log.Printf("[CRON] Erro ao atualizar política escalonada: %v\n", err)
		} else {
			log.Println("[CRON] PCDESCONTO atualizado com sucesso via Cron!")
		}
	})

	if err != nil {
		log.Fatalf("[CRON] Erro ao configurar o agendador: %v", err)
	}

	cronScheduler.Start()
	log.Println("[CRON] Agendador de atualização da PCDESCONTO iniciado com sucesso.")
}
