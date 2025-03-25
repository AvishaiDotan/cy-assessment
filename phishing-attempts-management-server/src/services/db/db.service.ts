import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DbService as SharedDbService, DbRepository, IUser, IUserDocument, userDbSchema, IPhishingPayloadDocument, phishingPayloadDbSchema} from '@avishaidotan/shared-lib';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DbService implements OnModuleInit{
    private readonly logger = new Logger(DbService.name);
    private dbService: SharedDbService;
    public usersRepository: DbRepository<IUserDocument>;
    public phishingPayloadRepository: DbRepository<IPhishingPayloadDocument>;

    onModuleInit() {
        this.initDb();
    }

    private async initDb() {
        const isDevelopment = process.env.NODE_ENV === 'development';
        this.logger.log(`Initializing database in ${isDevelopment ? 'development' : 'production'} mode`);
        
        try {
            if (isDevelopment) {
                this.logger.debug('Checking development database configuration...');
                if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
                    this.logger.error('Missing required database configuration:', {
                        hasUsername: !!process.env.DB_USERNAME,
                        hasPassword: !!process.env.DB_PASSWORD,
                        hasDbName: !!process.env.DB_NAME
                    });
                    throw new Error('Missing required database configuration for development mode');
                }
                this.dbService = await SharedDbService.init(
                    process.env.DB_USERNAME!,
                    process.env.DB_PASSWORD!,
                    process.env.DB_NAME!,
                    null
                );
            } else {
                if (!process.env.MONGODB_URI) {
                    this.logger.error('Missing MONGODB_URI in production mode');
                    throw new Error('Missing required MONGODB_URI for production mode');
                }
                this.dbService = await SharedDbService.init('', '', '', process.env.MONGODB_URI || null);
            }
            
            try {
                this.usersRepository = this.dbService.createRepository<IUserDocument>('users', userDbSchema);
                this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
                this.logger.log('Successfully created all database repositories');
            } catch (repoError) {
                this.logger.error('Failed to create database repositories:', repoError);
                throw new Error(`Failed to initialize database repositories: ${repoError.message}`);
            }
        } catch (error) {
            this.logger.error('Database initialization failed:', error);
            throw new Error(`Database initialization failed: ${error.message}`);
        }
    }
}
