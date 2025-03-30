import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import {
  DbService as SharedDbService,
  DbRepository,
  IUser,
  IUserDocument,
  userDbSchema,
  IPhishingPayloadDocument,
  phishingPayloadDbSchema,
} from '@avishaidotan/shared-lib';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);
  private dbService: SharedDbService;
  public usersRepository: DbRepository<IUserDocument>;
  public phishingPayloadRepository: DbRepository<IPhishingPayloadDocument>;

  onModuleInit() {
    this.initDb();
  }

  private async initDb() {
    this.logger.log('NODE_ENV', process.env.NODE_ENV);
    this.logger.log('EXTERNAL_MONGODB_URI', process.env.EXTERNAL_MONGODB_URI);
    this.logger.log('MONGODB_URI', process.env.MONGODB_URI);
    console.log('MONGODB_URI', process.env.MONGODB_URI);
    console.log('EXTERNAL_MONGODB_URI', process.env.EXTERNAL_MONGODB_URI);
    console.log('NODE_ENV', process.env.NODE_ENV);
    try {
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.EXTERNAL_MONGODB_URI
      ) {
        this.dbService = await SharedDbService.init(
          process.env.EXTERNAL_MONGODB_URI!,
        );
      } else {
        this.dbService = await SharedDbService.init(process.env.MONGODB_URI!);
      }

      try {
        this.usersRepository = this.dbService.createRepository<IUserDocument>(
          'users',
          userDbSchema,
        );
        this.phishingPayloadRepository =
          this.dbService.createRepository<IPhishingPayloadDocument>(
            'phishingPayloads',
            phishingPayloadDbSchema,
          );
        this.logger.log('Successfully created all database repositories');
      } catch (repoError) {
        this.logger.error('Failed to create database repositories:', repoError);
        throw new Error(
          `Failed to initialize database repositories: ${repoError.message}`,
        );
      }
    } catch (error) {
      this.logger.error('Database initialization failed:', error);
      throw new Error(`Database initialization failed: ${error.message}`);
    }
  }
}
