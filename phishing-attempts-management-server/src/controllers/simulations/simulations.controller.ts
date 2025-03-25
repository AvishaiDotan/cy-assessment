import { Body, Controller, Get, Post, Request, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { SimulationsService } from './simulations.service';
import { AuthGuard } from '@nestjs/passport';
import { Logger } from '@nestjs/common';

@Controller('simulations')
export class SimulationsController {
    private readonly logger = new Logger(SimulationsController.name);

    constructor(private readonly simulationsService: SimulationsService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async getAllSimulations(@Request() req) {
        try {
            if (!req.user || !req.user._id) {
                throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
            }
            
            const result = await this.simulationsService.getAll(req.user._id);
            return result;
        } catch (error) {
            this.logger.error(`GET /simulations - Error retrieving simulations: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                'Failed to retrieve simulations',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async insertSimulation(@Request() req, @Body() payload: IPhishingPayload) {
        try {
            if (!req.user || !req.user._id) {
                throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
            }
            
            // Validate payload
            if (!payload.recipient || !payload.emailContent) {
                throw new HttpException(
                    'Email recipient and content are required', 
                    HttpStatus.BAD_REQUEST
                );
            }
            
            payload.userId = req.user._id.toString();
            const result = await this.simulationsService.insert(payload);
            return { success: true, data: result };
        } catch (error) {
            this.logger.error(`POST /simulations - Error creating simulation: ${error.message}`);
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                error.message || 'Failed to create simulation',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}