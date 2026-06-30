# AI Video Avatar Playwright + Adobe Checklist

Purpose: qualify and deliver a small, account-safe automation slice for video/avatar production workflows without storing credentials, private media or provider session data.

## Intake

- Confirm the exact Adobe product/surface, plan, browser path and whether UI automation is allowed by the provider terms.
- Capture the current manual workflow as numbered steps: source video, audio extraction, narration generation, avatar upload, avatar video retrieval, recomposition and final upload.
- Define the first paid slice as one dummy-media or client-approved non-sensitive sample path.
- Confirm file formats, maximum file sizes, expected durations, naming rules, local folders and success criteria.
- Identify all human checkpoints: login, CAPTCHA, payment/plan prompts, account warnings, provider errors and final approval.

## Secret And Media Boundary

- Do not receive or store Adobe credentials, cookies, OAuth tokens, browser profiles, client videos, raw audio, private scripts or production project files.
- Client credentials must be entered by the client or stored in a client-controlled secure path after contract.
- Use dummy media for proposal/demo evidence unless the client provides a non-sensitive sample through the platform after contract.
- Do not screenshot account pages, payment settings, private media libraries or token-bearing URLs.

## Safe First Architecture

- Local queue folder with `input`, `working`, `done` and `failed` states.
- Playwright adapter for only the allowed browser steps.
- FFmpeg or approved local media utility for deterministic extraction/recomposition when needed.
- Structured run log with file names, timestamps, step status, provider error text redacted and retry count.
- Manual checkpoint before any irreversible upload, publish, payment or plan action.

## Validation

- Run one happy-path dummy video.
- Test missing file, unsupported format, failed upload, slow provider response and interrupted browser session.
- Verify output duration, audio/video sync, file naming and recoverability.
- Produce a redacted handoff with setup, run command, known failure cases and manual recovery steps.

## Proposal Guardrails

- Sell a diagnostic/proof slice first, not a full production bot.
- State that provider ToS and account-safety checks come before implementation.
- Refuse CAPTCHA bypass, rate-limit evasion, credential scraping, private-media exfiltration or unattended paid-account changes.
