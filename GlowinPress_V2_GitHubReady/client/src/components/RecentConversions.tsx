import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Clock } from 'lucide-react';

interface Conversion {
  name: string;
  format: string;
  timestamp: string;
}

export function RecentConversions() {
  const [conversions, setConversions] = React.useState<Conversion[]>([]);

  React.useEffect(() => {
    const recent = JSON.parse(localStorage.getItem('recentConversions') || '[]');
    setConversions(recent);
  }, []);

  if (conversions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="relative inline-block mb-4">
          <FileText className="mx-auto h-16 w-16 text-white/30 dark:text-gray-600" />
          <Clock className="absolute -bottom-1 -right-1 h-6 w-6 text-white/50 dark:text-gray-500" />
        </div>
        <p className="text-white/60 dark:text-gray-400 text-lg">No recent conversions</p>
        <p className="text-white/40 dark:text-gray-500 text-sm mt-2">Upload some files to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-glass">
      {conversions.map((conversion, index) => (
        <div key={index} className="glass rounded-xl p-4 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{conversion.name}</p>
              <div className="flex items-center space-x-3 mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/20 text-primary-foreground">
                  {conversion.format.toUpperCase()}
                </span>
                <span className="text-xs text-white/50 dark:text-gray-500">
                  {new Date(conversion.timestamp).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="ml-4 text-white/70 hover:text-white hover:bg-white/10 group-hover:bg-white/20 transition-all"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}