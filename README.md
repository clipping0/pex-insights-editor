# Pex Insights Editor

A mobile-first creator analytics workspace based on the uploaded reference video. The current build includes a responsive web UI, an editable **demo-only** insights preview, a real-analytics connection entry point, a demo API, and a Capacitor Android wrapper configuration.

## What's working now
- Responsive dashboard and navigation for desktop and Android-sized screens.
- Demo mode with editable views, reach, likes, comments, shares, saves, followers, follows and profile visits.
- Preview screen that updates from the demo editor.
- JSON report export.
- API health check and demo insights endpoints.
- Live analytics connection/status UI with safe, explicit not-configured states.
- Pricing and content-library prototype screens.

## Run locally
Requires Node.js 20+.

```bash
cp .env.example apps/api/.env
npm install
npm run dev
```

Open http://localhost:5173. API runs at http://localhost:4000.

## Build web

```bash
npm run build
```

## Android wrapper

Install Android Studio and an Android SDK, then from the repository root:

```bash
npm install
npm --workspace apps/web run build
npm install @capacitor/cli @capacitor/android
npx cap add android
npx cap sync android
npx cap open android
```

Build a signed release APK/AAB from Android Studio after setting the production API URL and app signing configuration. For a production mobile build, configure HTTPS API access; do not ship secrets in the app bundle.

## Real Instagram analytics — required before launch
Real analytics are not simulated or scraped. They must be implemented through Meta's official Instagram Platform OAuth/API flow.

1. Create a Meta developer app and configure the Instagram API login product and exact HTTPS OAuth redirect URI.
2. Use an eligible Instagram **Business or Creator** account and request only the required insights permissions.
3. Complete Meta App Review / Advanced Access as required for accounts outside your own test roles.
4. Implement CSRF-safe OAuth `state`, authorization-code exchange on the server, token encryption at rest, refresh/expiry handling, account selection, disconnect and data deletion.
5. Fetch account/media insights server-side using the current supported Meta API version and metric names; never expose access tokens or app secrets to the browser or Android app.
6. Add privacy policy, data deletion instructions, consent screens, rate limiting, audit logs and production monitoring.

The `/api/instagram/*` routes intentionally return clear not-configured responses until the above security and Meta approval steps are completed. Do not collect Instagram passwords. The demo editor is only a visual mockup and must remain labelled as demo data.

## Architecture

- `apps/web`: React + Vite responsive application, reusable UI and charts.
- `apps/api`: Express API boundary for demo data and future Meta OAuth/insights integration.
- `capacitor.config.json`: Capacitor Android application identity and web output directory.

## Important production work still needed
- User authentication and database (for example PostgreSQL + Prisma).
- Secure Meta OAuth implementation and encrypted token vault.
- Meta App Review and privacy/compliance pages.
- Payment provider integration (the plans screen is a prototype; no payments are taken).
- Tests, deployment configuration, monitoring and signed Android release.
