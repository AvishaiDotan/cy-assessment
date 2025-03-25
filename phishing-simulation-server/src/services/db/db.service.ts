import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService as SharedDbService, DbRepository, IUser, IUserDocument, userDbSchema, IPhishingPayloadDocument, phishingPayloadDbSchema} from 'shared-lib';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DbService implements OnModuleInit{
    /**
     *
     */
    private dbService: SharedDbService;
    public phishingPayloadRepository: DbRepository<IPhishingPayloadDocument>;
    onModuleInit() {
        this.initDb();
    }

    private async initDb() {
        this.dbService = await SharedDbService.init(process.env.DB_USER!, process.env.DB_USER_PASSWORD!, process.env.DB_NAME!, null);
        this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
    }
}
