import { Module } from '@nestjs/common';
import { PhishingController } from './phishing.controller';
import { EmailService } from '../services/email.service';
import { DbService } from '../services/db.service';
import { TokenGuard } from 'src/services/auth/token.guard';

@Module({
  controllers: [PhishingController],
  providers: [EmailService, DbService, TokenGuard],
})
export class SimulateModule {}
