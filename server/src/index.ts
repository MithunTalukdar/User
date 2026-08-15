import express from 'express'; // trigger restart 2
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { connectDB } from './config/db';
import apiRoutes from './routes';
import { notFound, errorHandler } from './middleware/error';

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
