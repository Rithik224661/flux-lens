import { LogEntry } from '@/types/log';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Bug,
  Clock,
  Server,
  GitBranch,
  Search
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface LogTableProps {
  logs: LogEntry[];
  loading: boolean;
  totalCount: number;
  filteredCount: number;
}

export function LogTable({ logs, loading, totalCount, filteredCount }: LogTableProps) {
  const levelConfigs = {
    error: {
      icon: AlertCircle,
      color: 'text-log-error',
      bgColor: 'bg-log-error-bg',
      borderColor: 'border-l-log-error',
    },
    warn: {
      icon: AlertTriangle,
      color: 'text-log-warn',
      bgColor: 'bg-log-warn-bg',
      borderColor: 'border-l-log-warn',
    },
    info: {
      icon: Info,
      color: 'text-log-info',
      bgColor: 'bg-log-info-bg',
      borderColor: 'border-l-log-info',
    },
    debug: {
      icon: Bug,
      color: 'text-log-debug',
      bgColor: 'bg-log-debug-bg',
      borderColor: 'border-l-log-debug',
    },
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Log Entries</h3>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-muted/30 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Log Entries
        </h3>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Showing {filteredCount} of {totalCount}
          </Badge>
          {filteredCount !== totalCount && (
            <Badge variant="secondary" className="text-primary">
              Filtered
            </Badge>
          )}
        </div>
      </div>

      {/* Logs List */}
      <ScrollArea className="h-[600px] w-full">
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <div className="text-center">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No logs found matching your filters</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => {
              const config = levelConfigs[log.level];
              const Icon = config.icon;
              
              return (
                <div 
                  key={`${log.timestamp}-${index}`}
                  className={cn(
                    "p-4 rounded-lg border-l-4 transition-all hover:bg-accent/30",
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Icon className={cn("h-4 w-4 flex-shrink-0", config.color)} />
                        <Badge 
                          variant="outline" 
                          className={cn(config.color, "border-current")}
                        >
                          {log.level.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </span>
                          <span className="text-xs opacity-70">
                            {format(new Date(log.timestamp), 'HH:mm:ss')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="pl-7">
                      <p className="text-foreground font-medium leading-relaxed">
                        {log.message}
                      </p>
                    </div>

                    {/* Metadata Row */}
                    <div className="pl-7 flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Server className="h-3 w-3" />
                        <span className="font-mono">{log.resourceId}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        <span className="font-mono">{log.commit}</span>
                      </div>

                      <Badge variant="outline" className="font-mono text-xs">
                        trace: {log.traceId}
                      </Badge>

                      <Badge variant="outline" className="font-mono text-xs">
                        span: {log.spanId}
                      </Badge>

                      {log.metadata.parentResourceId && (
                        <Badge variant="secondary" className="font-mono text-xs">
                          parent: {log.metadata.parentResourceId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}