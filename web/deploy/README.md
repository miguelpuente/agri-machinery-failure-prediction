# Deploy SION · `chiqui.sion.net.ar`

Runbook for the static site on `sion-oracle`. **Deployed on 2026-11-17** with explicit
user authorization. The site is live at <https://chiqui.sion.net.ar/>. This document keeps
the reproducible procedure, current state and next steps.

## Current deployment (2026-11-17)

| Field | Value |
|---|---|
| URL | <https://chiqui.sion.net.ar/> |
| Container | `chiqui_web` (healthy) on `sion_frontend` |
| Image | `sion/chiqui-web:6c17437` |
| Code | `main` @ `6c17437` (merge commit of PR #15) |
| Tunnel | `apps-sion` config version 46, `chiqui.sion.net.ar` → `http://chiqui_web:80` |
| DNS | proxied `CNAME chiqui` → `9f619bf9-bd07-46bb-882c-51c6288c60df.cfargotunnel.com` |
| Access | public (no Access app) |
| Monitor | **pending**: add `https://chiqui.sion.net.ar/healthz` (HTTP 200, body `ok`) in Uptime Kuma |

Verified after deploy from `main`: `/healthz` 200, SPA deep links, `manifest.webmanifest`
with `application/manifest+json`, self-hosted fonts, PWA service worker, production smoke
(24 labs, progress, import/export, certificate) and axe audit (0 violations). PR #15 was
merged to `main`; the live image is the merge commit `6c17437`. A later docs-only commit
does not require a redeploy.

## Architecture

```text
Internet
  └─ Cloudflare (TLS, CDN)
       └─ Tunnel apps-sion
            └─ chiqui.sion.net.ar → http://chiqui_web:80
                 └─ nginx (static dist/)
```

- Container: `chiqui_web`, image built from `web/deploy/Dockerfile`.
- Network: existing `sion_frontend` (external; never create a new network).
- No PostgreSQL, Redis, qcluster, migrations, collectstatic, or backups: the site is a
  reproducible static build.
- Cloudflare Tunnel `apps-sion` (`9f619bf9-bd07-46bb-882c-51c6288c60df`) is the ingress.
  The dashboard is the operational source of truth.
- No Access policy for the public site. Add MFA only if the owner changes the decision.

## Prerequisites

- Explicit authorization for this deploy.
- `ssh sion-oracle` working (Cloudflare Access).
- Docker + compose on `sion-oracle` (already present).
- Cloudflare dashboard access to the `apps-sion` tunnel and DNS for `sion.net.ar`.
- Uptime Kuma admin access for the monitor.
- The repository is public; no secrets are needed in the image or compose file.

## Build

On `sion-oracle`, from a clean checkout of this repository:

```bash
cd /opt/sion_factory/projects
git clone https://github.com/miguelpuente/agri-machinery-failure-prediction.git chiqui-ml
cd chiqui-ml
git switch main
TAG="$(git rev-parse --short HEAD)"
docker build -f web/deploy/Dockerfile -t "sion/chiqui-web:${TAG}" web
```

For a local build on `webserversionai1` (also arm64), the same command works. If the
build runs elsewhere, use `docker buildx --platform linux/arm64` or push the image to the
registry before pulling it on `sion-oracle`.

## Deploy

```bash
cd /opt/sion_factory/projects/chiqui-ml
CHIQUI_IMAGE="sion/chiqui-web:${TAG}" \
  docker compose -f web/deploy/compose.prod.yaml up -d

docker ps --filter name=chiqui_web
docker inspect --format '{{.State.Health.Status}}' chiqui_web
docker exec chiqui_web wget -qO- http://127.0.0.1/healthz
```

Do **not** run `docker compose down`, `docker stop`, or `docker run` manually. Do not
create networks. The compose project uses the existing `sion_frontend` network.

## Cloudflare ingress + DNS

In the `apps-sion` tunnel configuration, add a public hostname:

| Field | Value |
|---|---|
| Hostname | `chiqui.sion.net.ar` |
| Service | `http://chiqui_web:80` |
| Access | none (public) |

Create the proxied DNS record `CNAME chiqui -> 9f619bf9-bd07-46bb-882c-51c6288c60df.cfargotunnel.com`
(or let the dashboard create it). Revalidate the tunnel configuration before changing it:
`chiqui.sion.net.ar` does not exist in DNS or ingress at the time of this runbook.

## Monitoring

Add an Uptime Kuma HTTP(s) monitor:

- URL: `https://chiqui.sion.net.ar/healthz`
- Interval: 60 s
- Expected: HTTP 200, body `ok`
- Notifications: the existing SION channel.

## Verification

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://chiqui.sion.net.ar/
curl -sS https://chiqui.sion.net.ar/healthz
curl -sSI https://chiqui.sion.net.ar/ | sed -n '1,20p'
curl -sSI https://chiqui.sion.net.ar/assets/ | sed -n '1,20p'
```

Expected:

- `/` and `/?dia=21` return 200 (SPA fallback).
- `/healthz` returns `ok`.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` and `Content-Security-Policy` are present.
- Hashed assets under `/assets/` return long-lived cache headers; `index.html` is
  no-cache.
- No console errors in the browser; the 24 labs render.

## Rollback

Keep the previous image tag. Rollback is a compose recreate with the previous tag:

```bash
CHIQUI_IMAGE="sion/chiqui-web:<previous-tag>" \
  docker compose -f web/deploy/compose.prod.yaml up -d --force-recreate
```

Do not remove the tunnel hostname or DNS record unless the owner explicitly retires the
site. If the site must be retired, remove the tunnel hostname and DNS record first, then
stop the container.

## Optional fallback

The root `netlify.toml` remains as an optional static fallback. It is **not** the SION
deployment path and does not apply headers on `sion-oracle`; nginx owns the SION headers.
