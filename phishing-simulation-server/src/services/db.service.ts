import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService as SharedDbService, DbRepository, IPhishingPayloadDocument, phishingPayloadDbSchema} from '@avishaidotan/shared-lib';
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
        this.dbService = await SharedDbService.init('', '', '', process.env.MONGODB_URI || null);
        this.phishingPayloadRepository = this.dbService.createRepository<IPhishingPayloadDocument>('phishingPayloads', phishingPayloadDbSchema);
    }
}
