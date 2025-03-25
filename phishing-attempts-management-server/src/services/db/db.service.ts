import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService as SharedDbService, DbRepository, IUser, IUserDocument, userDbSchema, IPhishingPayloadDocument, phishingPayloadDbSchema} from '@avishaidotan/shared-lib';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DbService implements OnModuleInit{
    private dbService: SharedDbService;
    public usersRepository: DbRepository<IUserDocument>;
    public phishingPayloadRepository: DbRepository<IPhishingPayloadDocument>;

    onModuleInit() {
        this.initDb();
    }

    private async initDb() {
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        try {
            if (isDevelopment) {
                if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
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
                    throw new Error('Missing required MONGODB_URI for production mode');
                }
                this.dbService = await SharedDbService.init('', '', '', process.env.MONGODB_URI || null);
            }
            
            this.usersRepository = this.dbService.createRepository<IUserDocument>('users', userDbSchema);
            this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
        } catch (error) {
            throw error;
        }
    }
}
