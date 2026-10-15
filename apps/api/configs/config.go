package configs

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	OracleDSN   string
	ServerPort  string
	GeminiKey   string
	GeminiModel string
	XlsServiceURL string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("[config] .env não encontrado, usando variáveis de ambiente do sistema")
	}

	return &Config{
		OracleDSN:   getEnv("ORACLE_DSN", "user/password@host:1521/service"),
		ServerPort:  getEnv("SERVER_PORT", "8080"),
		GeminiKey:   getEnv("GEMINI_API_KEY", ""),
		GeminiModel: getEnv("GEMINI_MODEL", "gemini-3.5-flash"),
		XlsServiceURL: getEnv("XLS_SERVICE_URL", ""),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
