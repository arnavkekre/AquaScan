# AquaScan — Software Requirements Specification (SRS)
## Additional System Enhancements: Supabase Connectivity, Deployment Readiness & Production Hardening

> **Complete Specification Document:**  
> The comprehensive IEEE Std 830-1998 compliant specification document has been created in:  
> 📄 **[`docs/SRS_ADDITIONAL_REQUIREMENTS.md`](file:///c:/Users/jasmi/Desktop/AquaScan-testbranch/docs/SRS_ADDITIONAL_REQUIREMENTS.md)**

---

### Executive Overview of Additional Requirements

This specification provides the architectural blueprint for transitioning **AquaScan** (SIH26057 — Ministry of Earth Sciences / NIOT) from a local development prototype into an enterprise-grade, edge-resilient, cloud-connected hydrographic intelligence platform.

#### Key Functional & Architectural Modules

1. **Module A: Supabase Cloud Connectivity & Real-Time Sync**
   - **PostgreSQL 15+ & PostGIS Extension**: Spatial storage of survey tracks and anomalies using `GEOGRAPHY(Point, 4326)` with GIST spatial indexing for `<50ms` geodetic lookups.
   - **Complete Database Schema**: DDL specifications for `missions`, `sonar_tiles`, and `hazards` tables.
   - **Row-Level Security (RLS) & RBAC**: Sovereign data protection with separate permissions for `mission_commander`, `hydrographer`, and `guest_auditor`.
   - **Supabase Realtime WebSockets**: Instant push notifications (<250ms) to the Seafloor GIS Map (`/map`) and Hazard Inspector (`/inspector`) when new underwater hazards are classified by the ONNX edge pipeline.
   - **Object Storage Buckets**: Encrypted cloud storage for raw SSS waterfalls (`sonar-raw-swaths`), AI annotated tiles (`sonar-annotated`), and audit dossiers (`mission-reports`).
   - **Automated Alert Edge Function**: Webhook dispatcher triggering immediate port authority notifications when a `P1_CRITICAL` hazard is logged.

2. **Module B: Deployment Readiness & Production Hardening**
   - **Multi-Stage Dockerization**:
     - Frontend: Node 20 Alpine builder $\to$ Nginx 1.25 Alpine runner (<25 MB image footprint).
     - Backend: Python 3.10-slim with CPU ONNX Runtime (<350 MB image footprint).
   - **Production Orchestration**: `docker-compose.yml` with health checks, memory/CPU limits, and restart policies.
   - **Nginx Reverse Proxy & Ingress**: SSL/TLS 1.3 termination, HSTS, strict Content Security Policy (CSP), HTTP/2, Gzip/Brotli compression, and WebSocket upgrade proxying.
   - **12-Factor App Environment Configuration**: Full `.env.production` schema with zero hardcoded credentials.
   - **Health Probes**: Standard `/healthz` (liveness) and `/readyz` (readiness with model warm-up check).
   - **CI/CD Pipeline**: GitHub Actions workflow (`deploy.yml`) for automated linting, unit testing (`pytest`), and Docker build verification.
   - **Structured JSON Logging & APM**: Standardized telemetry logs for auditability.

3. **Module C: Offshore Vessel-First Resilience & PWA**
   - **Local-First Architecture**: Browser-native `IndexedDB` caching (`Dexie.js`) allowing hydrographers to operate in complete air-gapped offshore conditions.
   - **Store-and-Forward Sync**: Automatic FIFO synchronization queue when satellite or 4G connectivity is restored.
   - **Progressive Web App (PWA)**: Desktop installation on vessel bridge laptops with Workbox asset caching.

4. **Module D: Hydrographic Standards & Compliance**
   - **IHO S-44 Order 1A Verification**: Total Horizontal Uncertainty (THU) calculated per anomaly point; automatic warning if $\text{THU} > 5.0\text{ m} + 0.05 \cdot d$.
   - **Sovereign Interoperability**: RFC 7946 GeoJSON and S-100 bathymetric ENC readiness.

---

### Detailed Specification Document
Please refer to the full document for exact SQL schemas, mathematical formulations, NFR budgets, verification criteria, and the 4-phase implementation roadmap:
👉 **[Open `docs/SRS_ADDITIONAL_REQUIREMENTS.md`](file:///c:/Users/jasmi/Desktop/AquaScan-testbranch/docs/SRS_ADDITIONAL_REQUIREMENTS.md)**
