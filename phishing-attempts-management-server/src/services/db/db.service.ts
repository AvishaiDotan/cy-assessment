import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService as SharedDbService, DbRepository, IUser, IUserDocument, userDbSchema, IPhishingPayloadDocument, phishingPayloadDbSchema} from '@avishaidotan/shared-lib';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DbService implements OnModuleInit{
    /**
     *
     */
    private dbService: SharedDbService;
    public usersRepository: DbRepository<IUserDocument>;
    public phishingPayloadRepository: DbRepository<IPhishingPayloadDocument>;
    onModuleInit() {
        this.initDb();
    }

    private async initDb() {
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment) {
            this.dbService = await SharedDbService.init(
                'avishaidotan',
                '2P7dKjFyW2JruDMn',
                'test2',
                null
            );
        } else {
            this.dbService = await SharedDbService.init('', '', '', process.env.MONGODB_URI || null);
        }
        
        this.usersRepository = this.dbService.createRepository<IUserDocument>('users', userDbSchema);
        this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
    }
}
