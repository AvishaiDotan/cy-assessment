import { Module } from '@nestjs/common';
import { PhishingController } from './phishing.controller';
import { EmailService } from '../../services/email.service';
import { TokenGuard } from '../../guards/token.guard';
import { DbModule } from '../../services/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [PhishingController],
  providers: [EmailService, TokenGuard],
})
export class PhishingModule {}
