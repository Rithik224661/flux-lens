import express from 'express';
import fs from 'fs/promises';
import Joi from 'joi';
import path from 'path';

const router = express.Router();
const LOG_FILE = path.resolve('logs.json');

const logSchema = Joi.object({
  level: Joi.string().valid('error', 'warn', 'info', 'debug').required(),
  message: Joi.string().required(),
  resourceId: Joi.string().required(),
  timestamp: Joi.string().isoDate().required(),
  traceId: Joi.string().required(),
  spanId: Joi.string().required(),
  commit: Joi.string().required(),
  metadata: Joi.object({
    parentResourceId: Joi.string().required()
  }).required()
});

// Helper: Read logs from file
async function readLogs() {
  try {
    const data = await fs.readFile(LOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

// Helper: Write logs to file
async function writeLogs(logs) {
  await fs.writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
}

// POST /logs - Ingest new log entry
router.post('/', async (req, res) => {
  const { error, value } = logSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const logs = await readLogs();
    logs.unshift(value); // Add to beginning for reverse-chronological
    await writeLogs(logs);
    res.status(201).json({ message: 'Log ingested successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to ingest log' });
  }
});

// GET /logs - Query logs with filters
router.get('/', async (req, res) => {
  try {
    let logs = await readLogs();
    const { level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit } = req.query;

    // Filtering
    if (level) {
      const levels = Array.isArray(level) ? level : [level];
      logs = logs.filter(log => levels.includes(log.level));
    }
    if (message) {
      const search = message.toLowerCase();
      logs = logs.filter(log => log.message.toLowerCase().includes(search));
    }
    if (resourceId) {
      logs = logs.filter(log => log.resourceId.toLowerCase().includes(resourceId.toLowerCase()));
    }
    if (traceId) {
      logs = logs.filter(log => log.traceId.toLowerCase().includes(traceId.toLowerCase()));
    }
    if (spanId) {
      logs = logs.filter(log => log.spanId.toLowerCase().includes(spanId.toLowerCase()));
    }
    if (commit) {
      logs = logs.filter(log => log.commit.toLowerCase().includes(commit.toLowerCase()));
    }
    if (timestamp_start) {
      const start = new Date(timestamp_start).getTime();
      logs = logs.filter(log => new Date(log.timestamp).getTime() >= start);
    }
    if (timestamp_end) {
      const end = new Date(timestamp_end).getTime();
      logs = logs.filter(log => new Date(log.timestamp).getTime() <= end);
    }

    // Sort reverse-chronologically
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to query logs' });
  }
});

export default router;
