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
        console.log('Initializing DB Service...');
        this.initDb();
    }

    private async initDb() {
        console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
        this.dbService = await SharedDbService.init('', '', '', process.env.MONGODB_URI || null);
        console.log('MongoDB connection established');
        
        console.log('Creating repositories...');
        this.usersRepository = this.dbService.createRepository<IUserDocument>('users', userDbSchema);
        this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
        console.log('Repositories created successfully');
    }
}
