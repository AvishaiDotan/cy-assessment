import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DbService as SharedDbService, DbRepository, IPhishingPayloadDocument, phishingPayloadDbSchema} from '@avishaidotan/shared-lib';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DbService implements OnModuleInit{
    private dbService: SharedDbService;
    public phishingPayloadRepository: DbRepository<IPhishingPayloadDocument>;
    private readonly logger = new Logger(DbService.name);
    
    onModuleInit() {
        this.initDb();
    }

    private async initDb() {
        const isDevelopment = process.env.NODE_ENV === 'development';
        this.logger.log(`Starting database initialization in ${isDevelopment ? 'development' : 'production'} mode`);
        
        try {
            if (isDevelopment) {
                this.dbService = await SharedDbService.init(
                    process.env.DB_USERNAME!,
                    process.env.DB_PASSWORD!,
                    process.env.DB_NAME!,
                    null
                );
            } else {
                this.dbService = await SharedDbService.init('', '', '', process.env.MONGODB_URI || null);
            }
            
            this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
            this.logger.log('Successfully initialized phishing payload repository');
        } catch (error) {
            this.logger.error('Failed to initialize database:', error);
            throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
