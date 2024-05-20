dev:
	docker compose -f docker-compose.dev.yml up -d --build
devi:
	docker compose -f docker-compose.dev.yml up --build
down:
	docker compose -f docker-compose.dev.yml down