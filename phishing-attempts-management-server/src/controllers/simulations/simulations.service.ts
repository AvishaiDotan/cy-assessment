import { Injectable, Logger } from '@nestjs/common';
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
            if (!id) {
                this.logger.error('User ID is undefined or null');
                throw new Error('User ID is required');
            }

            // Convert id to string if it's not already
            const userId = id.toString();
            
            const query = { userId: userId };
            
            const simulations = await this.dbService.phishingPayloadRepository.find(query);
            
            const data = simulations.map(simulation => {
                const doc = (simulation as any)._doc;
                return { ...doc, user: undefined };
            });
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    public async insert(payload: IPhishingPayload) {
        try {
            const phishingServerUrl = this.getPhishingServerUrl();
            this.logger.debug(`Using phishing server URL: ${phishingServerUrl}`);
            const response = await axios.post(`${phishingServerUrl}/phishing/send`, payload);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to process simulation: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw new Error(`Failed to process simulation: ${error.message}`);
        }
    }
}
