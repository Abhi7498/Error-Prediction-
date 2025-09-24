
export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export interface LogEntry {
    id: number;
    timestamp: Date;
    level: LogLevel;
    service: string;
    message: string;
}

export interface AIFixSuggestion {
  description: string;
  actionLabel: string;
  command?: string;
}

export interface AIAnalysis {
  errorType: string;
  rootCause: string;
  impact: string;
  suggestion: AIFixSuggestion;
}

export interface SystemStats {
  totalLogs: number;
  errors: number;
  fixesApplied: number;
}
