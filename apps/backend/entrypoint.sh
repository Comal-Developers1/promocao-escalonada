#!/bin/sh
set -e

echo "[Docker] Executando migrações do Prisma..."
npx --yes prisma@5 migrate deploy

echo "[Docker] Iniciando a API Go..."
exec ./api