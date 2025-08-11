import { useState } from 'react';
import { LogEntry, LogLevel } from '@/types/log';
import { logApi } from '@/services/logApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Database } from 'lucide-react';

interface LogIngestionFormProps {
  onLogIngested: () => void;
}

export function LogIngestionForm({ onLogIngested }: LogIngestionFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    level: '' as LogLevel | '',
    message: '',
    resourceId: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.level || !formData.message || !formData.resourceId || 
        !formData.traceId || !formData.spanId || !formData.commit || 
        !formData.parentResourceId) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const logEntry: LogEntry = {
        level: formData.level as LogLevel,
        message: formData.message,
        resourceId: formData.resourceId,
        timestamp: new Date().toISOString(),
        traceId: formData.traceId,
        spanId: formData.spanId,
        commit: formData.commit,
        metadata: {
          parentResourceId: formData.parentResourceId,
        },
      };

      const result = await logApi.ingestLog(logEntry);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Log entry ingested successfully',
        });
        
        // Reset form
        setFormData({
          level: '',
          message: '',
          resourceId: '',
          traceId: '',
          spanId: '',
          commit: '',
          parentResourceId: '',
        });
        
        onLogIngested();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to ingest log',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const sampleTraceId = `trace-${Math.random().toString(36).substr(2, 9)}`;
    const sampleSpanId = `span-${Math.random().toString(36).substr(2, 9)}`;
    const sampleCommit = Math.random().toString(36).substr(2, 7);
    
    setFormData({
      level: 'info',
      message: 'Sample log message for testing purposes',
      resourceId: 'web-server-01',
      traceId: sampleTraceId,
      spanId: sampleSpanId,
      commit: sampleCommit,
      parentResourceId: 'api-gateway',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Database className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">Log Ingestion</h2>
        </div>
        <p className="text-muted-foreground">
          Simulate the POST /logs endpoint by ingesting new log entries
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Log Level */}
        <div className="space-y-2">
          <Label htmlFor="level">Log Level *</Label>
          <Select 
            value={formData.level} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, level: value as LogLevel }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select log level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="error">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-log-error"></div>
                  Error
                </div>
              </SelectItem>
              <SelectItem value="warn">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-log-warn"></div>
                  Warning
                </div>
              </SelectItem>
              <SelectItem value="info">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-log-info"></div>
                  Info
                </div>
              </SelectItem>
              <SelectItem value="debug">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-log-debug"></div>
                  Debug
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            placeholder="Enter log message..."
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Resource ID */}
        <div className="space-y-2">
          <Label htmlFor="resourceId">Resource ID *</Label>
          <Input
            id="resourceId"
            placeholder="e.g., server-01, api-gateway"
            value={formData.resourceId}
            onChange={(e) => setFormData(prev => ({ ...prev, resourceId: e.target.value }))}
          />
        </div>

        {/* Trace and Span IDs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="traceId">Trace ID *</Label>
            <Input
              id="traceId"
              placeholder="trace-12345"
              value={formData.traceId}
              onChange={(e) => setFormData(prev => ({ ...prev, traceId: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="spanId">Span ID *</Label>
            <Input
              id="spanId"
              placeholder="span-67890"
              value={formData.spanId}
              onChange={(e) => setFormData(prev => ({ ...prev, spanId: e.target.value }))}
            />
          </div>
        </div>

        {/* Commit and Parent Resource */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="commit">Commit Hash *</Label>
            <Input
              id="commit"
              placeholder="a1b2c3d"
              value={formData.commit}
              onChange={(e) => setFormData(prev => ({ ...prev, commit: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parentResourceId">Parent Resource ID *</Label>
            <Input
              id="parentResourceId"
              placeholder="parent-service"
              value={formData.parentResourceId}
              onChange={(e) => setFormData(prev => ({ ...prev, parentResourceId: e.target.value }))}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={generateSampleData}
            className="flex-1"
          >
            Generate Sample Data
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ingesting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ingest Log
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Schema Reference */}
      <Card className="p-4 bg-muted/30">
        <h4 className="font-semibold mb-2 text-sm">API Schema Reference</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <p><code>POST /logs</code> - All fields are required</p>
          <p><code>timestamp</code> - Auto-generated (ISO 8601)</p>
          <p><code>metadata.parentResourceId</code> - Required metadata field</p>
        </div>
      </Card>
    </div>
  );
}