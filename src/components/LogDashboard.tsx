import { useState, useEffect, useCallback } from 'react';
import { LogEntry, LogFilters, LogMetrics } from '@/types/log';
import { logApi } from '@/services/logApi';
import { LogFiltersPanel } from './LogFiltersPanel';
import { LogTable } from './LogTable';
import { LogMetricsCards } from './LogMetricsCards';
import { LogIngestionForm } from './LogIngestionForm';
import { LogAnalytics } from './LogAnalytics';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Database, Search, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LogDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<LogMetrics | null>(null);
  const [filters, setFilters] = useState<LogFilters>({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('monitor');
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadLogs();
    updateMetrics();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await logApi.queryLogs();
      setLogs(allLogs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(async () => {
    try {
      const filtered = await logApi.queryLogs(filters);
      setFilteredLogs(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredLogs(logs);
    }
  }, [filters, logs]);

  const updateMetrics = () => {
    // Calculate metrics from logs
    const byLevel = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    setMetrics({
      total: logs.length,
      byLevel: {
        error: byLevel.error || 0,
        warn: byLevel.warn || 0,
        info: byLevel.info || 0,
        debug: byLevel.debug || 0,
      },
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleFiltersChange = (newFilters: LogFilters) => {
    setFilters(newFilters);
  };

  const handleLogIngested = () => {
    loadLogs();
    updateMetrics();
    toast({
      title: 'Success',
      description: 'Log entry ingested successfully',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Monitor className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Flux Lens
              </h1>
              <p className="text-sm text-muted-foreground">Log Ingestion & Query System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-600">
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Monitor & Query
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ingest" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Log Ingestion
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            {/* Metrics Cards */}
            {metrics && <LogMetricsCards metrics={metrics} />}

            {/* Main Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Panel */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24">
                  <LogFiltersPanel 
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                </Card>
              </div>

              {/* Logs Table */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <LogTable 
                    logs={filteredLogs}
                    loading={loading}
                    totalCount={logs.length}
                    filteredCount={filteredLogs.length}
                  />
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {metrics && <LogAnalytics logs={logs} metrics={metrics} />}
          </TabsContent>

          <TabsContent value="ingest" className="space-y-6">
            <Card className="p-6 max-w-2xl mx-auto">
              <LogIngestionForm onLogIngested={handleLogIngested} />
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}