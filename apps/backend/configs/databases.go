package configs

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/sijms/go-ora/v2" // Driver Oracle para database/sql
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type DataBases struct {
	Oracle   *gorm.DB
	Postgres *gorm.DB
}

func InitDatabases() *DataBases {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Aviso: Arquivo .env não encontrado")
	}

	// ----------------------------------------
	// 1. CONEXÃO E POOL DO ORACLE (GORM + sql.DB)
	// ----------------------------------------
	oracleDSN := os.Getenv("ORACLE_URL")
	sqlOraDB, err := sql.Open("oracle", oracleDSN)
	if err != nil {
		log.Fatalf("Erro ao abrir conexão Oracle: %v", err)
	}

	// Configuração do Pool de Conexões (database/sql subjacente)
	sqlOraDB.SetMaxOpenConns(25)
	sqlOraDB.SetMaxIdleConns(10)
	sqlOraDB.SetConnMaxLifetime(1 * time.Hour)
	sqlOraDB.SetConnMaxIdleTime(15 * time.Minute)

	if err = sqlOraDB.Ping(); err != nil {
		log.Fatalf("Erro ao pingar Oracle: %v", err)
	}

	// Integrando o pool do Oracle ao GORM
	oraDB, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlOraDB,
	}), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Erro ao iniciar GORM para o Oracle: %v", err)
	}
	fmt.Println("Banco de dados Oracle (GORM Pool) conectado com sucesso")

	// ----------------------------------------
	// 2. CONEXÃO E POOL DO POSTGRESQL (Nativo GORM)
	// ----------------------------------------
	postgresDSN := os.Getenv("POSTGRES_URL")
	pgDB, err := gorm.Open(postgres.Open(postgresDSN), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Erro ao conectar ao PostgreSQL com GORM: %v", err)
	}

	// Obtendo a instância SQL subjacente para configurar o pool do Postgres
	sqlPgDB, err := pgDB.DB()
	if err != nil {
		log.Fatalf("Erro ao obter instância SQL do Postgres: %v", err)
	}

	sqlPgDB.SetMaxOpenConns(20)
	sqlPgDB.SetMaxIdleConns(5)
	sqlPgDB.SetConnMaxLifetime(30 * time.Minute)
	sqlPgDB.SetConnMaxIdleTime(10 * time.Minute)

	if err = sqlPgDB.Ping(); err != nil {
		log.Fatalf("Erro ao pingar Postgres: %v", err)
	}
	fmt.Println("Banco de dados PostgreSQL (GORM Pool) conectado com sucesso")

	return &DataBases{
		Oracle: oraDB,
		Postgres: pgDB,
	}
}
