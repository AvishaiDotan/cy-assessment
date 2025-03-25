import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { IPhishingPayload } from 'shared-lib';
import { SimulationsService } from './simulations.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('simulations')
export class SimulationsController {
    constructor(private readonly simulationsService: SimulationsService) {
        
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllSimulations(@Request() req) {
        return this.simulationsService.getAll(req.user._id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async insertSimulation(@Request() req, @Body() payload: IPhishingPayload) {
        payload.userId = req.user._id.toString();
        return this.simulationsService.insert(payload);
    }

}