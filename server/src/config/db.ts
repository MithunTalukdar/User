import mongoose from 'mongoose';
import { config } from './index';

export const db = {
  connected: false,
};

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState >= 1) {
    db.connected = true;
    return;
  }

  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 4000 });
    db.connected = true;
    console.log('[db] connected to MongoDB');
  } catch (e) {
    db.connected = false;
    console.warn(
      '[db] MongoDB not reachable — running with in-memory persistence:',
      (e as Error).message,
    );
  }
}
