import { LogEntry, LogMetrics } from '@/types/log';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Activity, AlertTriangle, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, subHours, eachHourOfInterval } from 'date-fns';

interface LogAnalyticsProps {
  logs: LogEntry[];
  metrics: LogMetrics;
}

export function LogAnalytics({ logs, metrics }: LogAnalyticsProps) {
  // Prepare data for log level distribution chart
  const levelDistribution = [
    { name: 'Error', value: metrics.byLevel.error, color: 'hsl(var(--log-error))' },
    { name: 'Warning', value: metrics.byLevel.warn, color: 'hsl(var(--log-warn))' },
    { name: 'Info', value: metrics.byLevel.info, color: 'hsl(var(--log-info))' },
    { name: 'Debug', value: metrics.byLevel.debug, color: 'hsl(var(--log-debug))' },
  ].filter(item => item.value > 0);

  // Prepare hourly log activity data
  const now = new Date();
  const hoursBack = 24;
  const timeSlots = eachHourOfInterval({
    start: subHours(now, hoursBack),
    end: now
  });

  const hourlyActivity = timeSlots.map(hour => {
    const hourStart = hour.getTime();
    const hourEnd = hour.getTime() + (60 * 60 * 1000);
    
    const logsInHour = logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime >= hourStart && logTime < hourEnd;
    });

    return {
      time: format(hour, 'HH:mm'),
      total: logsInHour.length,
      error: logsInHour.filter(l => l.level === 'error').length,
      warn: logsInHour.filter(l => l.level === 'warn').length,
      info: logsInHour.filter(l => l.level === 'info').length,
      debug: logsInHour.filter(l => l.level === 'debug').length,
    };
  });

  // Resource distribution
  const resourceStats = logs.reduce((acc, log) => {
    acc[log.resourceId] = (acc[log.resourceId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topResources = Object.entries(resourceStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([resource, count]) => ({ resource, count }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Log Analytics</h2>
          <p className="text-muted-foreground">Visual insights and trends from your log data</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">{metrics.total}</p>
              <p className="text-sm text-muted-foreground">Total Logs</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-log-error" />
            <div>
              <p className="text-2xl font-bold text-log-error">{metrics.byLevel.error}</p>
              <p className="text-sm text-muted-foreground">Critical Issues</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-log-warn" />
            <div>
              <p className="text-2xl font-bold text-log-warn">{metrics.byLevel.warn}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">
                {((metrics.byLevel.error / metrics.total) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">Error Rate</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Level Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Log Level Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {levelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">24-Hour Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Log Levels Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Log Levels Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="error" stackId="a" fill="hsl(var(--log-error))" />
                <Bar dataKey="warn" stackId="a" fill="hsl(var(--log-warn))" />
                <Bar dataKey="info" stackId="a" fill="hsl(var(--log-info))" />
                <Bar dataKey="debug" stackId="a" fill="hsl(var(--log-debug))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Resources */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Resources by Log Count</h3>
          <div className="space-y-3">
            {topResources.map(({ resource, count }, index) => (
              <div key={resource} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <span className="font-mono text-sm">{resource}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{count}</span>
                  <div 
                    className="h-2 bg-primary rounded-full"
                    style={{ 
                      width: `${(count / Math.max(...topResources.map(r => r.count))) * 100}px` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}