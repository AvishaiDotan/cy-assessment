import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { SimulationsService } from './simulations.service';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Controller('simulations')
export class SimulationsController {
    private readonly logger = new Logger(SimulationsController.name);

    constructor(private readonly simulationsService: SimulationsService) {
        
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllSimulations(@Request() req) {
        try {
            const result = await this.simulationsService.getAll(req.user._id);
            return result;
        } catch (error) {
            this.logger.error('GET /simulations - Error retrieving simulations:', error);
            throw error;
        }
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async insertSimulation(@Request() req, @Body() payload: IPhishingPayload) {
        this.logger.log('POST /simulations - Request received');
        this.logger.debug('User from request:', req.user);
        this.logger.debug('Simulation data:', payload);
        
        try {
            payload.userId = req.user._id.toString();
            const result = await this.simulationsService.insert(payload);
            this.logger.log('POST /simulations - Successfully created simulation');
            this.logger.debug('Created simulation:', result);
            return result;
        } catch (error) {
            this.logger.error('POST /simulations - Error creating simulation:', error);
            throw error;
        }
    }

}