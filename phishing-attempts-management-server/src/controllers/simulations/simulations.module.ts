import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';
import { DbService } from '../../services/db.service';

@Module({
    controllers: [SimulationsController],
    providers: [SimulationsService, DbService]
})
export class SimulationsModule {}
