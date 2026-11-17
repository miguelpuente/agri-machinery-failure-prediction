# Deploy SION · `chiqui.sion.net.ar`

Runbook for the static site on `sion-oracle`. **Deployed on 2026-11-17** with explicit
user authorization. The site is live at <https://chiqui.sion.net.ar/>. This document keeps
the reproducible procedure, current state and next steps.

## Current deployment (2026-11-17)

| Field | Value |
|---|---|
| URL | <https://chiqui.sion.net.ar/> |
| Container | `chiqui_web` (healthy) on `sion_frontend` |
| Image | `sion/chiqui-web:ba9f355` |
| Code | `main` @ `ba9f355` (merge commit of PR #16, material library) |
| Tunnel | `apps-sion` config version 46, `chiqui.sion.net.ar` → `http://chiqui_web:80` |
| DNS | proxied `CNAME chiqui` → `9f619bf9-bd07-46bb-882c-51c6288c60df.cfargotunnel.com` |
| Access | public (no Access app) |
| Monitor | **pending**: add `https://chiqui.sion.net.ar/healthz` (HTTP 200, body `ok`) in Uptime Kuma |
| Material | 18 PDFs on `/opt/sion_factory/storage/chiqui/docs`, mounted read-only at `/usr/share/nginx/html/docs` |

Verified after deploy from `main`: `/healthz` 200, SPA deep links, `manifest.webmanifest`
with `application/manifest+json`, self-hosted fonts, PWA service worker, production smoke
(24 labs, progress, import/export, certificate), all 18 material PDFs returning
`application/pdf`, and axe audit (0 violations). PR #15 and PR #16 were merged to `main`;
the live image is the merge commit `ba9f355`. A later docs-only commit does not require a
redeploy.

## Material PDFs (109 MB)

The 18 PDFs are **not in Git**. They live on the host and are mounted read-only into the
container:

```text
/opt/sion_factory/storage/chiqui/docs  →  /usr/share/nginx/html/docs
```

Slugs:

- `ml-clase-01.pdf` … `ml-clase-16.pdf`
- `plan-de-estudios.pdf`
- `preentrega.pdf`

Sync from a checkout that has the original `docs/*.pdf` files (for example, the dev
machine):

```bash
python3 - <<'PY'
from pathlib import Path
import shutil
src = Path('docs')
dst = Path('/tmp/chiqui-docs')
dst.mkdir(exist_ok=True)
mapping = {f'ML CLASE _ {i:02d}.pdf': f'ml-clase-{i:02d}.pdf' for i in range(1, 17)}
mapping['Talento Tech -Machine learning.pdf'] = 'plan-de-estudios.pdf'
mapping['Preentrega(BORRADOR).pdf'] = 'preentrega.pdf'
for source, target in mapping.items():
    shutil.copyfile(src / source, dst / target)
PY
rsync -az /tmp/chiqui-docs/ sion-oracle:/opt/sion_factory/storage/chiqui/docs/
```

The compose file mounts the directory read-only; nginx serves `/docs/` with a 7-day cache
and the inherited security headers. A fresh server needs this sync before the material
links work. The Markdown transcriptions stay in GitHub and are linked from the site.

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
