export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogEntry {
  level: LogLevel;
  message: string;
  resourceId: string;
  timestamp: string; // ISO 8601 string
  traceId: string;
  spanId: string;
  commit: string;
  metadata: {
    parentResourceId: string;
  };
}

export interface LogFilters {
  level?: LogLevel[];
  message?: string;
  resourceId?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  traceId?: string;
  spanId?: string;
  commit?: string;
}

export interface LogMetrics {
  total: number;
  byLevel: Record<LogLevel, number>;
  lastUpdated: string;
}