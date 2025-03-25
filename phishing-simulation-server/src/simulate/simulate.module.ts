import { Module } from '@nestjs/common';
import { PhishingController } from './phishing.controller';
import { EmailService } from 'src/services/email/email.service';
import { DbService } from '../services/db/db.service';

@Module({
  controllers: [PhishingController],
  providers: [EmailService, DbService],
})
export class SimulateModule {}
