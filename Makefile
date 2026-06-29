.PHONY: setup dev db migrate seed stop clean

## setup   — configura todo o ambiente (banco + deps + migrate + seed)
setup:
	bash setup.sh

## dev     — sobe loja + API + dashboard ao mesmo tempo
dev:
	bash dev.sh

## db      — sobe apenas o PostgreSQL (Docker)
db:
	docker compose up -d db

## migrate — aplica migrations do Prisma
migrate:
	cd backend && npx prisma migrate dev

## seed    — popula o banco com dados de demonstração
seed:
	cd backend && npx prisma db seed

## stop    — para o banco
stop:
	docker compose down

## clean   — remove banco + node_modules dos 3 apps
clean:
	docker compose down -v
	rm -rf backend/node_modules frontend/node_modules dashboard/node_modules
