# Deployment

## Option 1: Vercel (easiest, single region)

1. Push to GitHub
2. Import the repo into Vercel
3. Add the env vars from `.env.example`
4. Provision Postgres (Neon / Supabase) and Redis (Upstash)
5. Add the connection strings
6. Vercel auto-builds and deploys on every push

## Option 2: AWS (production-grade)

### One-time setup

```bash
# Provision infrastructure
cd infra/terraform
terraform init && terraform apply

# Create ECR repo
aws ecr create-repository --repository-name buildforge/app

# Create K8s cluster
eksctl create cluster --name buildforge --region us-east-1 --nodegroup-name standard --node-type m5.large --nodes-min 2 --nodes-max 10
```

### Deploy

```bash
# Build and push
docker build -t ghcr.io/buildforge/app:latest .
docker push ghcr.io/buildforge/app:latest

# Apply manifests
kubectl apply -f k8s/

# Verify
kubectl get pods -n buildforge
```

The CI workflow in `.github/workflows/ci.yml` does this automatically on every push to `main`.

## Option 3: Docker Compose (self-hosted VPS)

```bash
docker-compose up -d
```

Provision Postgres + Redis as separate managed services (or via the compose file) and point the app at them.

## Health checks

- `GET /api/health` — returns `{ status: "ok" }`
- Kubernetes probes use this endpoint
- ALB target group health checks the same path

## Backups

- **Database:** Automated daily snapshots, 35-day retention, PITR enabled
- **Files:** S3 cross-region replication, versioned
- **Secrets:** AWS Secrets Manager with 90-day rotation
- **RTO:** 1 hour · **RPO:** 15 minutes

## Monitoring

- **Metrics:** Prometheus + Grafana (CloudWatch)
- **Logs:** Pino → Loki / CloudWatch
- **Traces:** OpenTelemetry → X-Ray
- **Errors:** Sentry with release tracking
- **Alerts:** PagerDuty for SEV1, Slack for SEV2/3
