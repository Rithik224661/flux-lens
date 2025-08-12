// API service to connect frontend to backend Node.js/Express API
import { LogEntry, LogFilters } from '@/types/log';

const BACKEND_URL = 'http://localhost:4000';

export const backendLogApi = {
  async ingestLog(log: LogEntry): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${BACKEND_URL}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) {
        const data = await response.json();
        return { success: false, message: data.error || 'Failed to ingest log' };
      }
      return { success: true, message: 'Log ingested successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to ingest log' };
    }
  },

  async queryLogs(filters: LogFilters = {}): Promise<LogEntry[]> {
    const params = new URLSearchParams();
    if (filters.level && filters.level.length > 0) {
      filters.level.forEach(lvl => params.append('level', lvl));
    }
    if (filters.message) params.append('message', filters.message);
    if (filters.resourceId) params.append('resourceId', filters.resourceId);
    if (filters.timestamp_start) params.append('timestamp_start', filters.timestamp_start);
    if (filters.timestamp_end) params.append('timestamp_end', filters.timestamp_end);
    if (filters.traceId) params.append('traceId', filters.traceId);
    if (filters.spanId) params.append('spanId', filters.spanId);
    if (filters.commit) params.append('commit', filters.commit);
    const url = `${BACKEND_URL}/logs?${params.toString()}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return await response.json();
    } catch (error) {
      return [];
    }
  }
};
