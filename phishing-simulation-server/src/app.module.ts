import { Module } from '@nestjs/common';
import { PhishingModule } from './controllers/phishing/phishing.module';
import { EmailService } from './services/email.service'
import { DbService } from './services/db.service';

@Module({
  imports: [PhishingModule],
  controllers: [],
  providers: [EmailService, DbService],
})
export class AppModule {}
