import { LogMetrics } from '@/types/log';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Bug, 
  Activity,
  TrendingUp 
} from 'lucide-react';

interface LogMetricsCardsProps {
  metrics: LogMetrics;
}

export function LogMetricsCards({ metrics }: LogMetricsCardsProps) {
  const levelConfigs = {
    error: {
      icon: AlertCircle,
      color: 'text-log-error',
      bgColor: 'bg-log-error-bg',
      borderColor: 'border-log-error/20',
    },
    warn: {
      icon: AlertTriangle,
      color: 'text-log-warn',
      bgColor: 'bg-log-warn-bg',
      borderColor: 'border-log-warn/20',
    },
    info: {
      icon: Info,
      color: 'text-log-info',
      bgColor: 'bg-log-info-bg',
      borderColor: 'border-log-info/20',
    },
    debug: {
      icon: Bug,
      color: 'text-log-debug',
      bgColor: 'bg-log-debug-bg',
      borderColor: 'border-log-debug/20',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {/* Total Logs */}
      <Card className="p-4 border-primary/20 bg-gradient-to-br from-card to-accent/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Logs</p>
            <p className="text-xl font-bold">{metrics.total}</p>
          </div>
        </div>
      </Card>

      {/* Error Rate */}
      <Card className="p-4 border-log-error/20 bg-gradient-to-br from-card to-log-error-bg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-log-error/10 text-log-error">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Error Rate</p>
            <p className="text-xl font-bold text-log-error">
              {metrics.total > 0 ? Math.round((metrics.byLevel.error / metrics.total) * 100) : 0}%
            </p>
          </div>
        </div>
      </Card>

      {/* Level Breakdown */}
      {Object.entries(levelConfigs).map(([level, config]) => {
        const Icon = config.icon;
        const count = metrics.byLevel[level as keyof typeof metrics.byLevel];
        
        return (
          <Card 
            key={level} 
            className={`p-4 border transition-all hover:scale-105 ${config.borderColor} ${config.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${config.color}`} />
                <Badge variant="outline" className={`${config.color} border-current`}>
                  {level.toUpperCase()}
                </Badge>
              </div>
              <p className={`text-lg font-bold ${config.color}`}>{count}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}