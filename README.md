# OverLut Docker Compose Deployment Guide

## Overview
Your OverLut project has been containerized with all 3 components (Backend, React Frontend, Flutter Web) and unified into a single `docker-compose.yml` file for easy deployment.

## Project Structure
```
SWD392/
├── BEOverLut_MonoService/
│   └── OverLut/                    # .NET 10 Backend (ASP.NET Core Web API)
│       ├── WebApi/Dockerfile       # Multi-stage build
│       └── OverLut.sql             # Database initialization script
├── FEOverLut/FEOVERLUT/            # React Frontend (Vite)
│   ├── Dockerfile                  # Multi-stage build (Node → nginx)
│   ├── nginx.conf                  # nginx routing config
│   └── package.json
├── FlutterOverLut/flutteroverlut/  # Flutter Mobile Web
│   ├── Dockerfile                  # Placeholder (ready for Flutter build)
│   ├── nginx.conf                  # nginx routing config
│   └── pubspec.yaml
└── docker-compose.yml              # Unified orchestration
```

## Services Deployed

| Service | Tech | Port | Status |
|---------|------|------|--------|
| **db** | MSSQL 2022 | 1723 | SQL Server + initialization |
| **webapi** | .NET 10 ASP.NET Core | 5000 | REST API backend |
| **frontend** | React 19 + Vite | 3000 | Web interface |
| **mobile-web** | Flutter Web | 3001 | Mobile web interface |

## Quick Start

### 1. Build All Images
```bash
cd D:\Repository\SWD392
docker compose build --pull
```

### 2. Start All Services
```bash
docker compose up -d
```

Containers will start in order:
1. Database (MSSQL) — waits for healthcheck
2. Database initialization
3. Backend API — depends on db-init
4. Frontend — depends on webapi
5. Mobile Web — depends on webapi

### 3. Access the Services
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **Mobile Web**: http://localhost:3001
- **Database**: localhost:1723 (SA user, password: 12345)

### 4. View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f webapi
docker compose logs -f frontend
docker compose logs -f db
```

### 5. Stop All Services
```bash
docker compose down

# With volume cleanup
docker compose down -v
```

## Important Notes

### Database
- SQL Server 2022 starts on port 1723 (not default 1433)
- Credentials: `sa` / `12345`
- Database: `OverLutDb`
- Schema initialized from `OverLut.sql`
- Data persisted in `overlut-db-volume` Docker volume

### Frontend Setup
- React app built with Vite
- Set API URL in environment (currently: `http://localhost:5000`)
- Served by nginx on port 3000
- Proxy configuration can be updated in `FEOverLut/FEOVERLUT/nginx.conf`

### Mobile Web Setup
- **Current**: Placeholder nginx image (for fast local testing)
- **To enable Flutter web build**: 
  1. Run `flutter build web --release` locally in `FlutterOverLut/flutteroverlut/`
  2. Update the Dockerfile to copy the built `build/web/` folder
  3. Rebuild: `docker compose build mobile-web`

### Network
- All services on shared network: `overlut-net`
- Backend can be reached from other containers as `http://webapi:8080`
- Database can be reached as `db:1433` (or `db:1723` for SQL Server)

## Production Deployment

### For Simple Single-Host Production
Docker Compose is suitable for single-host production deployments with the database on the same machine. Customize:

1. **Security**:
   - Change SA password from default `12345`
   - Use Docker secrets instead of plaintext env vars
   - Remove `develop` sections before deployment

2. **Environment**:
   - Update `ASPNETCORE_ENVIRONMENT` from `Production` to actual environment
   - Set proper CORS URLs for frontend
   - Update API URLs in React config

3. **Scaling**:
   - For multi-server setup, switch to Docker Swarm or Kubernetes
   - Use managed database (Azure SQL, AWS RDS) instead of container

### For Kubernetes / Docker Swarm
If you need cloud deployment:
- Transfer to Kubernetes manifests (Deployment + Service)
- Use managed services for database (RDS, Azure SQL, Cloud SQL)
- Implement ingress for routing
- Set up monitoring and logging

## Troubleshooting

### Database not starting
```bash
# Check logs
docker compose logs db

# Check volume
docker volume ls | grep overlut
docker volume inspect swd392_overlut-db-volume
```

### Backend fails to connect to database
- Wait for `db-init` service to complete (check logs)
- Verify connection string: `Server=db,1433;Database=OverLutDb;User Id=sa;Password=12345;`
- Check firewall rules if using external DB

### Frontend can't reach backend
- Verify API URL environment variable in `docker-compose.yml`
- Update `VITE_API_URL` to match backend port/host
- Check nginx config in `FEOverLut/FEOVERLUT/nginx.conf`

### Rebuild after code changes
```bash
# Rebuild specific service
docker compose build webapi --no-cache

# Or rebuild all
docker compose build --no-cache

# Then restart
docker compose up -d
```

## File Changes Made

### Created:
- `docker-compose.yml` — Master orchestration file
- `FEOverLut/FEOVERLUT/Dockerfile` — React multi-stage build
- `FEOverLut/FEOVERLUT/nginx.conf` — Frontend routing
- `FlutterOverLut/flutteroverlut/Dockerfile` — Flutter placeholder
- `FlutterOverLut/flutteroverlut/nginx.conf` — Mobile web routing

### Images Built:
- `overlut-webapi:latest` (104MB)
- `overlut-frontend:latest` (26.8MB)
- `overlut-mobile-web:latest` (26MB)

## Next Steps

1. **Test locally**: Run `docker compose up` and verify all services are accessible
2. **Customize Flutter**: Build Flutter web and update Dockerfile
3. **Configure for production**: Update passwords, URLs, and environment variables
4. **Deploy to cloud**: Switch to managed database and cloud container registry
5. **Set up CI/CD**: Use GitHub Actions to auto-build and push images to Docker Hub

---

For questions, check Docker Compose docs: https://docs.docker.com/compose/
