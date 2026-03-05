# CAE-ETM — Enterprise Task Manager

Sistema de gerenciamento de tarefas desenvolvido pela equipe **Ctrl Alt Elite** para um projeto da **KA Solution**, promovido pela **Accenture**.

## Tecnologias

| Camada | Stack |
|--------|-------|
| Backend | Java 25 · Spring Boot 4 · Spring Security + JWT · JPA · H2 |
| Frontend | React 18 · Vite 5 · Tailwind CSS · Axios · React Hook Form + Zod |
| Infra | Docker · Nginx |

## Como rodar

### Com Docker (recomendado)

```bash
docker-compose up --build -d
```

- Frontend: http://localhost
- Backend: http://localhost:8080

### Sem Docker

**Pré-requisitos:** Java 25+ e Node.js 20+

Terminal 1 — Backend:
```bash
cd backend
./mvnw spring-boot:run
```

Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## Equipe Ctrl Alt Elite

Projeto acadêmico KA Solution — Accenture.
