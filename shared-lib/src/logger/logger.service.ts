import chalk from 'chalk';
import { LogLevel, LogOptions, LogEntry } from './types';
import { DbService, DbRepository } from '../services/db.service';
import { ILogDocument, logDbSchema } from '../schemas/log.schema';

export class LoggerService {
    private context: string;
    private currentLogLevel: LogLevel;
    private logRepository?: DbRepository<ILogDocument>;

    private constructor(
        context: string, 
        initialLogLevel: LogLevel = LogLevel.INFO,
    ) {
        this.context = context;
        this.currentLogLevel = initialLogLevel;
    }

    static async create(
        context: string,
        options?: {
            logLevel?: LogLevel;
            dbConfig?: { user: string; password: string; dbName: string; }
        }
    ): Promise<LoggerService> {
        const logger = new LoggerService(context, options?.logLevel);
        
        if (options?.dbConfig) {
            await logger.initializeDb(options.dbConfig);
        }

        return logger;
    }

    private async initializeDb(dbConfig: { user: string; password: string; dbName: string; }) {
        try {
            const dbService = await DbService.init(dbConfig.user, dbConfig.password, dbConfig.dbName);
            this.logRepository = dbService.createRepository<ILogDocument>('Log', logDbSchema);
        } catch (error) {
            console.error('Failed to initialize database connection:', error);
            throw error;
        }
    }

    setLogLevel(level: LogLevel): void {
        this.currentLogLevel = level;
    }

    private async saveLogToDb(logEntry: LogEntry): Promise<void> {
        if (!this.logRepository) {
            console.warn('Database not initialized. Skipping database logging.');
            return;
        }

        try {
            await this.logRepository.create({
                level: LogLevel[logEntry.level].toLowerCase(),
                message: logEntry.message,
                service: logEntry.context,
                metadata: logEntry.metadata,
                createdAt: logEntry.timestamp
            });
        } catch (error) {
            console.error('Failed to save log to database:', error);
            // Don't throw the error to prevent disrupting the application flow
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.currentLogLevel;
    }

    private formatMessage(level: LogLevel, message: string, logContext?: string): string {
        const timestamp = new Date().toISOString();
        const levelStr = LogLevel[level].padEnd(5);
        const contextStr = logContext 
            ? `${this.context}:${logContext}`.padEnd(25)
            : this.context.padEnd(25);
        return `[${timestamp}] [${contextStr}] [${levelStr}] ${message}`;
    }

    private async log(level: LogLevel, message: string, options: LogOptions = {}, logContext?: string): Promise<void> {
        if (!this.shouldLog(level)) {
            return;
        }

        const logEntry: LogEntry = {
            timestamp: new Date(),
            level,
            context: logContext ? `${this.context}:${logContext}` : this.context,
            message,
            metadata: options.metadata
        };

        let coloredMessage = this.formatMessage(level, message, logContext);

        switch (level) {
            case LogLevel.DEBUG:
                console.log(chalk.gray(coloredMessage));
                break;
            case LogLevel.INFO:
                console.log(chalk.blue(coloredMessage));
                break;
            case LogLevel.WARN:
                console.log(chalk.yellow(coloredMessage));
                break;
            case LogLevel.ERROR:
                console.log(chalk.red(coloredMessage));
                break;
            case LogLevel.FATAL:
                console.log(chalk.bgRed.white(coloredMessage));
                break;
        }

        if (options.saveToDb) {
            await this.saveLogToDb(logEntry);
        }
    }

    debug(message: string, options?: LogOptions, logContext?: string): Promise<void> {
        return this.log(LogLevel.DEBUG, message, options, logContext);
    }

    info(message: string, options?: LogOptions, logContext?: string): Promise<void> {
        return this.log(LogLevel.INFO, message, options, logContext);
    }

    warn(message: string, options?: LogOptions, logContext?: string): Promise<void> {
        return this.log(LogLevel.WARN, message, options, logContext);
    }

    error(message: string, options?: LogOptions, logContext?: string): Promise<void> {
        return this.log(LogLevel.ERROR, message, options, logContext);
    }

    fatal(message: string, options?: LogOptions, logContext?: string): Promise<void> {
        return this.log(LogLevel.FATAL, message, options, logContext);
    }
} 