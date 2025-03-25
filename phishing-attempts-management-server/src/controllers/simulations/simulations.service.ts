import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DbService } from '../../services/db/db.service';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

@Injectable()
export class SimulationsService {
  private readonly logger = new Logger(SimulationsService.name);

  constructor(private readonly dbService: DbService) {}

  private getPhishingServerUrl(): string {
    return process.env.NODE_ENV === 'development'
      ? process.env.PHISHING_SERVER_URL_DEV!
      : process.env.PHISHING_SERVER_URL!;
  }

  public async getAll(id: any): Promise<IPhishingPayload[]> {
    try {
      const userId = id.toString();
      const simulations = await this.dbService.phishingPayloadRepository.find({
        userId: userId,
      });

      const data = simulations.map((simulation) => {
        const doc = (simulation as any)._doc;
        return { ...doc, user: undefined };
      });

      return data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch phishing payloads for user ID ${id}: ${error.message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to fetch phishing payloads',
      );
    }
  }

  public async insert(payload: IPhishingPayload) {
    try {
      const phishingServerUrl = this.getPhishingServerUrl();

      const response = await axios.post(
        `${phishingServerUrl}/phishing/send`,
        payload,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error(
          `Failed to process simulation: HTTP ${error.response?.status} - ${error.response?.data?.message || error.message}`,
          error.stack,
        );
      }
      
      throw new InternalServerErrorException(
        'An unexpected error occurred while processing your request. Please try again later.',
      );
    }
  }
}
