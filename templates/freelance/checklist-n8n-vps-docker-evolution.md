# n8n VPS / Docker / Evolution Repair Checklist

Purpose: deliver narrow, safe, 1-day diagnostic/fix sprints for n8n, Evolution API and VPS Docker networking issues. Public-safe template only; never store client secrets, cookies, tokens, private keys, customer data or provider dumps here.

## Best-Fit Scope

- Move an existing local Docker automation to a VPS.
- Fix n8n container connectivity to Evolution API on the same VPS.
- Validate Docker Compose, bridge network, env vars, ports, volumes and restart behavior.
- Confirm webhook/API reachability with fake or client-approved test payloads.

## Fastest Safe First Phase

1. Snapshot current state: containers, compose files, volumes, exposed ports and DNS/Cloudflare notes.
2. Confirm backup path before touching data: PostgreSQL dump, n8n export, Evolution data volume or provider backup.
3. Reproduce the failure from inside the n8n container with `curl` or `wget`.
4. Fix the lowest-risk layer first: shared Docker network, internal hostname, service name, port mapping or env var.
5. Validate one POST from n8n to Evolution API with non-sensitive test data.
6. Deliver a short runbook: what changed, how to restart, how to test and how to roll back.

## Intake Questions

- Is n8n running in Docker, Docker Compose, Easypanel or another panel?
- Is Evolution API on the same VPS, another VPS or a managed provider?
- Which symptom occurs: timeout, DNS failure, 401/403, 404, webhook not firing, message loop or container restart?
- Is Cloudflare proxy involved?
- Is PostgreSQL internal to Docker or external?
- Is there an existing backup and rollback window?

## Technical Checklist

- Confirm `docker ps`, compose project name and service names.
- Confirm both services share a Docker network when same-host communication is required.
- Prefer internal service DNS such as `http://evolution-api:8080` over public IP loopback when both services run on the same Docker host.
- Check port exposure only where public access is actually needed.
- Check persistent volumes for n8n, Evolution API and PostgreSQL before container recreation.
- Check env var names and provider URLs without printing values.
- Validate from inside the n8n container, then from host, then from external browser only if needed.
- Add a rollback note before restarting services.

## Guardrails

- Do not ask for or store passwords, API keys, cookies, session tokens, SSH keys or database dumps in chat/repo/email.
- Do not copy production data locally.
- Do not bypass Cloudflare, CAPTCHA, provider limits or platform rules.
- Do not promise Meta/WhatsApp approval or unsupported provider behavior.
- Do not perform destructive container/volume commands without explicit client approval and verified backup.

## Proposal Angle

I would treat this as a focused infrastructure fix, not a full rebuild.

First phase: map the current Docker/n8n/Evolution setup, confirm backup and persistence, reproduce the timeout from inside the n8n container, fix the network/hostname/port/env issue, validate one safe test request and leave a restart/test runbook. If the issue is deeper than networking, I document the exact blocker before changing architecture.
