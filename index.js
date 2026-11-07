import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
const port = Number(process.env.PORT || 4000);

const demoMetrics = {
  views: 128400, reach: 82400, likes: 18420, comments: 932,
  shares: 1280, saves: 2470, followers: 12850, follows: 286, profileVisits: 6420
};
app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'Pex Insights Editor API', version: '1.0.0' }));
app.get('/api/demo/insights', (_req, res) => res.json({ mode: 'demo', clearlyLabelledSample: true, metrics: demoMetrics }));
app.post('/api/demo/insights', (req, res) => {
  const allowed = Object.keys(demoMetrics);
  const metrics = Object.fromEntries(allowed.map(k => [k, Math.max(0, Number(req.body?.[k] ?? demoMetrics[k]) || 0)]));
  res.json({ mode: 'demo', clearlyLabelledSample: true, metrics });
});

// OAuth routes are intentionally guarded until Meta app credentials, redirect URLs,
// secure token persistence, and required permissions are configured.
app.get('/api/instagram/status', (_req, res) => res.json({ connected: false, provider: 'Meta Instagram API', configured: Boolean(process.env.META_APP_ID && process.env.META_APP_SECRET && process.env.META_REDIRECT_URI) }));
app.get('/api/instagram/connect', (_req, res) => {
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET || !process.env.META_REDIRECT_URI) {
    return res.status(503).json({ error: 'Meta OAuth is not configured. Add META_APP_ID, META_APP_SECRET and META_REDIRECT_URI on the server.' });
  }
  return res.status(501).json({ error: 'OAuth authorization handler must be completed with a CSRF-safe state store and Meta app configuration before launch.' });
});
app.get('/api/instagram/callback', (_req, res) => res.status(501).json({ error: 'OAuth callback is not enabled yet. Implement code exchange, state validation, token encryption and account selection before launch.' }));
app.get('/api/instagram/insights', (_req, res) => res.status(401).json({ error: 'No authorized Instagram professional account is connected.' }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });
app.listen(port, () => console.log(`Pex API listening on http://localhost:${port}`));
