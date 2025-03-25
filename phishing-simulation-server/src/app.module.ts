import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimulateModule } from './simulate/simulate.module';
import { EmailService } from './services/email/email.service';
import { DbService } from './services/db/db.service';
import { PhishingController } from './simulate/phishing.controller';

@Module({
  imports: [SimulateModule],
  controllers: [AppController],
  providers: [AppService, EmailService, DbService],
})
export class AppModule {}
