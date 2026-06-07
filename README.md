# Aurum Vault — Frontend

Next.js 16 PWA for the Aurum Vault asset management platform. Authenticates via Keycloak and communicates with the [aurum-vault-service](../aurum-vault-service) backend.

## Prerequisites

- Node.js 22+
- The backend stack running (see `aurum-vault-service` README) — provides Keycloak on port 8080 and the API on port 3001

## Local Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure environment**

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=aurum-vault
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=aurum-vault-web
```

**3. Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker (OrbStack)

Ensure the backend stack is up first — Keycloak must be reachable at `http://localhost:8080` from the browser.

> `NEXT_PUBLIC_*` variables are baked in at build time. Edit `docker-compose.yml` or pass build args if your URLs differ from the defaults above.

```bash
# Build and run
docker compose up --build

# Run in background
docker compose up --build -d

# Tear down
docker compose down
```

The app is served at [http://localhost:3000](http://localhost:3000).

### OrbStack tips

- Ports are exposed directly — no extra port-forwarding config needed.
- Stream logs: `docker compose logs -f app`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve production build |