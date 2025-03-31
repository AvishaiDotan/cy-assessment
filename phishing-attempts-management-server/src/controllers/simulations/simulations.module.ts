import { Module } from '@nestjs/common';
import { SimulationsController } from './simulations.controller';
import { SimulationsService } from './simulations.service';
import { DbModule } from '../../services/db/db.module';

@Module({
    imports: [DbModule],
    controllers: [SimulationsController],
    providers: [SimulationsService]
})
export class SimulationsModule {}
