import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
  Put,
  Param,
} from '@nestjs/common';
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
      const result = await this.simulationsService.getAll(req.user._id);
      return result;
    } catch (error) {
      this.logger.error(
        `GET /simulations - Error retrieving simulations: ${error.message}`,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve simulations');
    }
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async insertSimulation(@Request() req, @Body() payload: IPhishingPayload) {
    try {
      if (!payload.recipient || !payload.emailContent) {
        throw new BadRequestException(
          'Email recipient and content are required',
        );
      }

      payload.userId = req.user._id.toString();
      const result = await this.simulationsService.insert(payload);
      return result._doc;
    } catch (error) {
      this.logger.error(
        `POST /simulations - Error creating simulation: ${error.message}`,
      );
      throw new InternalServerErrorException(
        'An unexpected error occurred while processing your request. Please try again later.',
      );
    }
  }

  @Put(':userId/token/:tokenId')
  async visitPhishingLink(
    @Param('userId') userId: string,
    @Param('tokenId') tokenId: string,
  ) {
    try {
      if (!userId || !tokenId) {
        this.logger.warn(
          `Invalid request parameters - userId: ${userId}, tokenId: ${tokenId}`,
        );
        throw new BadRequestException('Missing required parameters');
      }

      const result = await this.simulationsService.visitPhishingLink(
        userId,
        tokenId,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to process phishing link visit: ${error.message}`,
        error.stack,
      );

      throw new InternalServerErrorException(
        'An unexpected error occurred while processing your request. Please try again later.',
      );
    }
  }
}
