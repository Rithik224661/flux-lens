import { LogEntry, LogFilters, LogMetrics } from '@/types/log';

const STORAGE_KEY = 'flux_lens_logs';

// Mock API service that simulates backend with localStorage persistence
class LogApiService {
  private logs: LogEntry[] = [];

  constructor() {
    this.loadFromStorage();
    this.generateMockData();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error);
      this.logs = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs to storage:', error);
    }
  }

  private generateMockData(): void {
    if (this.logs.length === 0) {
      const mockLogs: LogEntry[] = [
        {
          level: 'error',
          message: 'Database connection failed',
          resourceId: 'server-01',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          traceId: 'trace-001',
          spanId: 'span-001',
          commit: 'a1b2c3d',
          metadata: { parentResourceId: 'api-gateway' }
        },
        {
          level: 'warn',
          message: 'High memory usage detected',
          resourceId: 'server-02',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          traceId: 'trace-002',
          spanId: 'span-002',
          commit: 'a1b2c3d',
          metadata: { parentResourceId: 'monitoring' }
        },
        {
          level: 'info',
          message: 'User authentication successful',
          resourceId: 'auth-service',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          traceId: 'trace-003',
          spanId: 'span-003',
          commit: 'e4f5g6h',
          metadata: { parentResourceId: 'api-gateway' }
        },
        {
          level: 'debug',
          message: 'Cache hit for user profile',
          resourceId: 'cache-01',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          traceId: 'trace-004',
          spanId: 'span-004',
          commit: 'e4f5g6h',
          metadata: { parentResourceId: 'user-service' }
        },
        {
          level: 'error',
          message: 'Payment processing failed for transaction 12345',
          resourceId: 'payment-service',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          traceId: 'trace-005',
          spanId: 'span-005',
          commit: 'i7j8k9l',
          metadata: { parentResourceId: 'api-gateway' }
        }
      ];
      this.logs = mockLogs;
      this.saveToStorage();
    }
  }

  // Simulate POST /logs endpoint
  async ingestLog(log: LogEntry): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // Validate log entry
          if (!this.validateLogEntry(log)) {
            resolve({ success: false, message: 'Invalid log entry format' });
            return;
          }

          this.logs.unshift(log); // Add to beginning for reverse chronological order
          this.saveToStorage();
          resolve({ success: true, message: 'Log ingested successfully' });
        } catch (error) {
          resolve({ success: false, message: 'Failed to ingest log' });
        }
      }, 100); // Simulate network delay
    });
  }

  // Simulate GET /logs endpoint with filtering
  async queryLogs(filters: LogFilters = {}): Promise<LogEntry[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredLogs = [...this.logs];

        // Apply filters
        if (filters.level && filters.level.length > 0) {
          filteredLogs = filteredLogs.filter(log => filters.level!.includes(log.level));
        }

        if (filters.message) {
          const searchTerm = filters.message.toLowerCase();
          filteredLogs = filteredLogs.filter(log => 
            log.message.toLowerCase().includes(searchTerm)
          );
        }

        if (filters.resourceId) {
          filteredLogs = filteredLogs.filter(log => 
            log.resourceId.toLowerCase().includes(filters.resourceId!.toLowerCase())
          );
        }

        if (filters.traceId) {
          filteredLogs = filteredLogs.filter(log => 
            log.traceId.toLowerCase().includes(filters.traceId!.toLowerCase())
          );
        }

        if (filters.spanId) {
          filteredLogs = filteredLogs.filter(log => 
            log.spanId.toLowerCase().includes(filters.spanId!.toLowerCase())
          );
        }

        if (filters.commit) {
          filteredLogs = filteredLogs.filter(log => 
            log.commit.toLowerCase().includes(filters.commit!.toLowerCase())
          );
        }

        if (filters.timestamp_start) {
          const startTime = new Date(filters.timestamp_start).getTime();
          filteredLogs = filteredLogs.filter(log => 
            new Date(log.timestamp).getTime() >= startTime
          );
        }

        if (filters.timestamp_end) {
          const endTime = new Date(filters.timestamp_end).getTime();
          filteredLogs = filteredLogs.filter(log => 
            new Date(log.timestamp).getTime() <= endTime
          );
        }

        resolve(filteredLogs);
      }, 50); // Simulate network delay
    });
  }

  // Get metrics for dashboard
  getMetrics(): LogMetrics {
    const byLevel = this.logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.logs.length,
      byLevel: {
        error: byLevel.error || 0,
        warn: byLevel.warn || 0,
        info: byLevel.info || 0,
        debug: byLevel.debug || 0,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  private validateLogEntry(log: any): log is LogEntry {
    const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
    const validLevels = ['error', 'warn', 'info', 'debug'];

    // Check required fields
    for (const field of requiredFields) {
      if (!(field in log)) return false;
    }

    // Validate level
    if (!validLevels.includes(log.level)) return false;

    // Validate metadata structure
    if (!log.metadata || typeof log.metadata !== 'object' || !log.metadata.parentResourceId) {
      return false;
    }

    // Validate timestamp format
    try {
      new Date(log.timestamp).toISOString();
    } catch {
      return false;
    }

    return true;
  }
}

import { backendLogApi } from './backendLogApi';

export const logApi = backendLogApi;