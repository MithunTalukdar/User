import express from 'express';

const app = express();
let realApp: any = null;
let initError: any = null;

import('./app.js')
  .then((module) => {
    realApp = module.default;
  })
  .catch((err) => {
    initError = err;
    console.error('Failed to load app:', err);
  });

app.all('*', (req, res, next) => {
  if (initError) {
    res.status(500).json({
      error: 'Initialization Error',
      message: initError.message,
      stack: initError.stack,
    });
  } else if (realApp) {
    realApp(req, res, next);
  } else {
    res.status(503).json({ error: 'Starting up, please retry in a second' });
  }
});

export default app;
