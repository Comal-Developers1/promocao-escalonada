package repository

import (
	"context"

	"github.com/Comal-Developers1/promocao-escalonada.git/db"
	"github.com/Comal-Developers1/promocao-escalonada.git/internal/api/domain/update"
	"gorm.io/gorm"
)

type updatePcDesconto struct {
	db *gorm.DB
}

func NewUpdatePcDesconto(db *gorm.DB) update.Repository {
	return &updatePcDesconto{db: db}
}

func (s *updatePcDesconto) UpdatePcDescontoREPO(c context.Context) error {
	query := db.UpdateQuery

	result := s.db.WithContext(c).Exec(query)

	return result.Error
}
