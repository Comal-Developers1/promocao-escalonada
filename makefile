.PHONY: dev build run prisma-migrate dev-api dev-interface

prisma-migrate:
	cd apps/backend && npx --yes prisma@5 migrate dev --name init_promocoes --skip-generate

dev-api: prisma-migrate
	cd apps/backend && go run cmd/main.go

dev-interface:
	cd apps/web && pnpm run dev