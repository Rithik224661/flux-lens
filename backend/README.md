# Flux Lens Backend

This is the Node.js/Express backend for the Flux Lens Log Ingestion and Querying System.

## Features
- **POST /logs**: Ingest a log entry (strict schema validation, JSON file storage).
- **GET /logs**: Query logs with combinable filters (level, message, resourceId, timestamp range, traceId, spanId, commit).
- Logs stored in a single `logs.json` file (no database).
- Robust error handling and file safety.

## Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm run dev
   # or
   npm start
   ```

The backend will run on [http://localhost:4000](http://localhost:4000).

## API

### POST /logs
- Ingest a new log entry.
- Request body must match:
  ```json
  {
    "level": "error | warn | info | debug",
    "message": "string",
    "resourceId": "string",
    "timestamp": "ISO 8601 string",
    "traceId": "string",
    "spanId": "string",
    "commit": "string",
    "metadata": { "parentResourceId": "string" }
  }
  ```
- Returns `201 Created` on success, `400` for invalid data.

### GET /logs
- Query logs with filters:
  - `level`, `message`, `resourceId`, `timestamp_start`, `timestamp_end`, `traceId`, `spanId`, `commit`
- Returns logs sorted reverse-chronologically.

## Design Notes
- All filtering is performed in-memory using JavaScript array methods.
- File read/write is safe and robust for local development.

---
See the main project README for integration and frontend details.
