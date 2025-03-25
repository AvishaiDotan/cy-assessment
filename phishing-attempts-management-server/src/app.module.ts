import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './controllers/auth/auth.module';
import { DbService } from './services/db/db.service';
import { SimulationsController } from './controllers/simulations/simulations.controller';
import { SimulationsService } from './controllers/simulations/simulations.service';
import { SimulationsModule } from './controllers/simulations/simulations.module';

@Module({
  imports: [AuthModule, SimulationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
