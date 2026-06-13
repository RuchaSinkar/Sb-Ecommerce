# ShopNest — Docker, CI/CD & Deployment Guide

This guide takes you from "running locally with `mvn` and `npm run dev`" to a
fully containerized stack with automated build → push → deploy.

---

## 0. File placement

Unzip this package at the **same level** as your `sb-ecom` and `ecom-frontend`
folders, so your project root looks like:

```
my-ecommerce-project/
├── sb-ecom/                  ← your existing Spring Boot project
│   ├── Dockerfile            ← copy from backend/Dockerfile
│   ├── .dockerignore
│   └── src/main/resources/
│       └── application-docker.properties
├── ecom-frontend/            ← your existing React project
│   ├── Dockerfile            ← copy from frontend/Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── .github/workflows/
│   ├── ci.yml
│   └── cd.yml
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── .gitignore
```

---

## 1. One-time backend changes

### 1.1 Add Actuator dependency

Open `sb-ecom/pom.xml` and add the dependency from `backend/pom-addition.xml`
into your `<dependencies>` block. This powers the Docker healthcheck.

### 1.2 Copy `application-docker.properties`

Copy `backend/application-docker.properties` into
`sb-ecom/src/main/resources/`. This profile is used **only inside Docker** —
your existing `application.properties` is untouched for local dev.

### 1.3 Copy Dockerfile + .dockerignore

Copy `backend/Dockerfile` and `backend/.dockerignore` into `sb-ecom/`.

---

## 2. One-time frontend changes

Copy `frontend/Dockerfile`, `frontend/nginx.conf`, and `frontend/.dockerignore`
into `ecom-frontend/`.

No code changes needed — Nginx handles the `/api` and `/images` proxying that
Vite's dev server did during development.

---

## 3. Run everything locally with Docker

```bash
# From the project root (where docker-compose.yml lives)
cp .env.example .env
# Edit .env — fill in DB_PASSWORD, JWT_SECRET, RAZORPAY keys

docker compose up -d --build
```

This starts 3 containers:
- `shopnest-db` — Postgres on :5432
- `shopnest-backend` — Spring Boot on :8080
- `shopnest-frontend` — Nginx serving React on :80

Open **http://localhost** — the frontend, talking to the backend through Nginx.

### Seed the database

The first time, run your `seed_data.sql` against the containerized Postgres:

```bash
docker exec -i shopnest-db psql -U postgres -d sb_ecom < seed_data.sql
```

### Copy product images into the volume

```bash
docker cp ./seed-images/. shopnest-backend:/app/images/
```

### Useful commands

```bash
docker compose logs -f backend     # tail backend logs
docker compose down                # stop everything
docker compose down -v             # stop + wipe volumes (fresh start)
docker compose up -d --build       # rebuild after code changes
```

---

## 4. Push code to GitHub

```bash
git init
git add .
git commit -m "Add Docker + CI/CD setup"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`.gitignore` already excludes `.env`, `node_modules`, `target`, and local images.

---

## 5. CI Pipeline (GitHub Actions) — automatic

`.github/workflows/ci.yml` runs on every push to `main`:

1. **backend-test** — `mvn test` + build jar
2. **frontend-test** — `npm run build`
3. **docker-build-push** — builds both Docker images and pushes to
   **GitHub Container Registry (GHCR)** as:
   - `ghcr.io/<you>/<repo>/backend:latest`
   - `ghcr.io/<you>/<repo>/frontend:latest`

No setup needed — `GITHUB_TOKEN` is provided automatically by GitHub Actions.

**First time only:** go to your repo → Settings → Actions → General →
Workflow permissions → enable "Read and write permissions" (so it can push
to GHCR).

---

## 6. Provision a VPS (for CD)

Any cheap VPS works — DigitalOcean, Hetzner, AWS Lightsail (~$5/month, 1GB RAM
is enough to start).

### 6.1 Install Docker on the VPS

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# log out and back in
```

### 6.2 Set up the deploy directory

```bash
sudo mkdir -p /opt/shopnest
sudo chown $USER:$USER /opt/shopnest
cd /opt/shopnest
```

Copy `docker-compose.prod.yml` here as `docker-compose.yml`, and edit the
image names:
```yaml
image: ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO/backend:latest
image: ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO/frontend:latest
```

Create `.env` here too (same format as `.env.example`) with **real**
production secrets.

### 6.3 Make GHCR images pullable

Your GHCR images are private by default. Either:

- **Easiest:** make the packages public — repo → Packages → package settings
  → Change visibility → Public
- **Or:** create a GitHub Personal Access Token with `read:packages` scope and
  run on the VPS:
  ```bash
  echo $GHCR_PAT | docker login ghcr.io -u <your-username> --password-stdin
  ```

### 6.4 First manual deploy

```bash
cd /opt/shopnest
docker compose pull
docker compose up -d
docker exec -i shopnest-db psql -U postgres -d sb_ecom < seed_data.sql
docker cp ./seed-images/. shopnest-backend:/app/images/
```

Visit `http://<vps-ip>` — should be live.

---

## 7. CD Pipeline — automatic deploy on every push

### 7.1 Generate an SSH key for GitHub Actions

On your **local machine**:
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f gh-actions-key
```
This creates `gh-actions-key` (private) and `gh-actions-key.pub` (public).

### 7.2 Add the public key to your VPS

```bash
ssh-copy-id -i gh-actions-key.pub <vps-user>@<vps-ip>
```

### 7.3 Add GitHub Secrets

Repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret name | Value |
|---|---|
| `VPS_HOST` | your VPS IP address |
| `VPS_USER` | your VPS username |
| `VPS_SSH_KEY` | contents of `gh-actions-key` (the **private** key) |

### 7.4 That's it

`.github/workflows/cd.yml` triggers automatically after CI succeeds on `main`.
It SSHes into your VPS and runs `docker compose pull && up -d`.

**Flow:** push to `main` → CI builds/tests/pushes images → CD pulls new
images on VPS and restarts containers. Fully automated.

---

## 8. Next steps (Phase 4-6 from the roadmap)

Once the above is working end-to-end, consider:

- **HTTPS** — add [Traefik](https://traefik.io/) or
  [Caddy](https://caddyserver.com/) as a reverse proxy in front of the
  frontend container for automatic Let's Encrypt certificates
- **Managed Postgres** — swap the `postgres` service for AWS RDS / Neon /
  Supabase so DB survives even if the VPS is rebuilt
- **Image storage** — move `project.image` from a Docker volume to S3 /
  Cloudflare R2 so images survive container recreation and scale across
  multiple backend replicas
- **Monitoring** — add `docker compose logs`, or go further with
  Grafana + Loki for centralized logging

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Backend can't connect to DB | Check `DB_HOST=postgres` matches the service name in compose, and `.env` has correct `DB_PASSWORD` |
| Images 404 on frontend | Check `docker cp` copied images into the `product-images` volume, and Nginx `/images/` proxy points to `backend:8080` |
| CI fails on `docker login` | Enable "Read and write permissions" for Actions in repo settings |
| CD can't SSH | Verify `VPS_SSH_KEY` is the **private** key with no passphrase, and the public key is in `~/.ssh/authorized_keys` on the VPS |
| 502 from Nginx | Backend container might still be starting — check `docker compose logs backend` |
