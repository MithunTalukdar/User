import express from 'express'; // trigger restart 2
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.clientOrigin === '*' ? true : config.clientOrigin.split(','),
    credentials: true,
  }),
);
app.use(express.json({ limit: '2mb' }));
if (config.nodeEnv !== 'test') app.use(morgan('dev'));

app.get('/google08d5bc3643a89d67.html', (_req, res) => {
  res.type('text/html').send('google-site-verification: google08d5bc3643a89d67.html');
});

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://myjobmekar.vercel.app/</loc><lastmod>2026-09-24</lastmod><priority>1.0</priority></url>
  <url><loc>https://myjobmekar.vercel.app/resume-builder</loc><lastmod>2026-09-24</lastmod><priority>0.9</priority></url>
  <url><loc>https://myjobmekar.vercel.app/ai-career-studio</loc><lastmod>2026-09-24</lastmod><priority>0.8</priority></url>
  <url><loc>https://myjobmekar.vercel.app/career-assistant</loc><lastmod>2026-09-24</lastmod><priority>0.8</priority></url>
  <url><loc>https://myjobmekar.vercel.app/resume-templates</loc><lastmod>2026-09-24</lastmod><priority>0.8</priority></url>
  <url><loc>https://myjobmekar.vercel.app/cover-letter-builder</loc><lastmod>2026-09-24</lastmod><priority>0.8</priority></url>
  <url><loc>https://myjobmekar.vercel.app/faq</loc><lastmod>2026-09-24</lastmod><priority>0.7</priority></url>
  <url><loc>https://myjobmekar.vercel.app/about</loc><lastmod>2026-09-24</lastmod><priority>0.6</priority></url>
  <url><loc>https://myjobmekar.vercel.app/privacy</loc><lastmod>2026-09-24</lastmod><priority>0.5</priority></url>
  <url><loc>https://myjobmekar.vercel.app/terms</loc><lastmod>2026-09-24</lastmod><priority>0.5</priority></url>
</urlset>`);
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /account
Disallow: /reset-password

Sitemap: https://myjobmekar.vercel.app/sitemap.xml`);
});

app.get('/health', (_req, res) => {
  res.json({ ok: true, ai: config.mockAI ? 'mock' : 'openai', service: 'ai-resume-builder' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  // Only start the listener if not running in a serverless environment like Vercel
  if (!process.env.VERCEL) {
    app.listen(config.port, () => {
      console.log(`[api] listening on http://localhost:${config.port}`);
    });
  }
}

start();

export default app;
