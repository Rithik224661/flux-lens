import { useState, useEffect } from 'react';
import { LogFilters, LogLevel } from '@/types/log';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar as CalendarIcon, 
  X, 
  Filter,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LogFiltersPanelProps {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
}

export function LogFiltersPanel({ filters, onFiltersChange }: LogFiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<LogFilters>(filters);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  const logLevels: { value: LogLevel; label: string; icon: any; color: string }[] = [
    { value: 'error', label: 'Error', icon: AlertCircle, color: 'text-log-error' },
    { value: 'warn', label: 'Warning', icon: AlertTriangle, color: 'text-log-warn' },
    { value: 'info', label: 'Info', icon: Info, color: 'text-log-info' },
    { value: 'debug', label: 'Debug', icon: Bug, color: 'text-log-debug' },
  ];

  // Debounced search effect
  useEffect(() => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const timeout = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);

    setSearchDebounce(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [localFilters]);

  const handleInputChange = (field: keyof LogFilters, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLevelToggle = (level: LogLevel, checked: boolean) => {
    const currentLevels = localFilters.level || [];
    const newLevels = checked 
      ? [...currentLevels, level]
      : currentLevels.filter(l => l !== level);
    
    handleInputChange('level', newLevels.length > 0 ? newLevels : undefined);
  };

  const clearFilters = () => {
    setLocalFilters({});
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof LogFilters];
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Message Search */}
      <div className="space-y-2">
        <Label htmlFor="message-search">Message Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="message-search"
            placeholder="Search in log messages..."
            value={localFilters.message || ''}
            onChange={(e) => handleInputChange('message', e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Log Level Filter */}
      <div className="space-y-3">
        <Label>Log Levels</Label>
        <div className="space-y-2">
          {logLevels.map(({ value, label, icon: Icon, color }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`level-${value}`}
                checked={localFilters.level?.includes(value) || false}
                onCheckedChange={(checked) => handleLevelToggle(value, checked as boolean)}
              />
              <Label htmlFor={`level-${value}`} className="flex items-center gap-2 cursor-pointer">
                <Icon className={`h-4 w-4 ${color}`} />
                <span>{label}</span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Resource ID */}
      <div className="space-y-2">
        <Label htmlFor="resource-id">Resource ID</Label>
        <Input
          id="resource-id"
          placeholder="Filter by resource ID..."
          value={localFilters.resourceId || ''}
          onChange={(e) => handleInputChange('resourceId', e.target.value)}
        />
      </div>

      {/* Trace ID */}
      <div className="space-y-2">
        <Label htmlFor="trace-id">Trace ID</Label>
        <Input
          id="trace-id"
          placeholder="Filter by trace ID..."
          value={localFilters.traceId || ''}
          onChange={(e) => handleInputChange('traceId', e.target.value)}
        />
      </div>

      {/* Span ID */}
      <div className="space-y-2">
        <Label htmlFor="span-id">Span ID</Label>
        <Input
          id="span-id"
          placeholder="Filter by span ID..."
          value={localFilters.spanId || ''}
          onChange={(e) => handleInputChange('spanId', e.target.value)}
        />
      </div>

      {/* Commit */}
      <div className="space-y-2">
        <Label htmlFor="commit">Commit</Label>
        <Input
          id="commit"
          placeholder="Filter by commit hash..."
          value={localFilters.commit || ''}
          onChange={(e) => handleInputChange('commit', e.target.value)}
        />
      </div>

      {/* Timestamp Range */}
      <div className="space-y-3">
        <Label>Timestamp Range</Label>
        <div className="grid grid-cols-1 gap-2">
          {/* Start Date */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !localFilters.timestamp_start && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.timestamp_start ? (
                    format(new Date(localFilters.timestamp_start), 'PPP')
                  ) : (
                    'Start date'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.timestamp_start ? new Date(localFilters.timestamp_start) : undefined}
                  onSelect={(date) => handleInputChange('timestamp_start', date?.toISOString())}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !localFilters.timestamp_end && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {localFilters.timestamp_end ? (
                    format(new Date(localFilters.timestamp_end), 'PPP')
                  ) : (
                    'End date'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={localFilters.timestamp_end ? new Date(localFilters.timestamp_end) : undefined}
                  onSelect={(date) => handleInputChange('timestamp_end', date?.toISOString())}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-border">
          <Label className="text-xs text-muted-foreground mb-2 block">Active Filters</Label>
          <div className="flex flex-wrap gap-1">
            {localFilters.level?.map(level => (
              <Badge key={level} variant="secondary" className="text-xs">
                {level}
              </Badge>
            ))}
            {localFilters.message && (
              <Badge variant="secondary" className="text-xs">
                Message: "{localFilters.message}"
              </Badge>
            )}
            {localFilters.resourceId && (
              <Badge variant="secondary" className="text-xs">
                Resource: {localFilters.resourceId}
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}