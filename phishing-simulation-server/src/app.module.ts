import { Module } from '@nestjs/common';
import { SimulateModule } from './simulate/simulate.module';
import { EmailService } from './services/email.service'
import { DbService } from './services/db.service';

@Module({
  imports: [SimulateModule],
  controllers: [],
  providers: [EmailService, DbService],
})
export class AppModule {}
