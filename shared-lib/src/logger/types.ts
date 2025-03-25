export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}

export interface LogOptions {
    saveToDb?: boolean;
    metadata?: Record<string, any>;
}

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    context: string;
    message: string;
    metadata?: Record<string, any>;
} 