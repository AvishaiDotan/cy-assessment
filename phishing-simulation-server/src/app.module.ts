import { Module } from '@nestjs/common';
import { PhishingModule } from './controllers/phishing/phishing.module';
import { EmailService } from './services/email.service'
import { DbModule } from './services/db/db.module';

@Module({
  imports: [PhishingModule, DbModule],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
