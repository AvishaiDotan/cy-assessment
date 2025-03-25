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
    private phishingServerUrl: string;

    constructor(private readonly dbService: DbService) {
        // Get the phishing server URL from environment variables with a fallback
        this.phishingServerUrl = process.env.PHISHING_SERVER_URL || 'http://phishing-server:7000';
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
            const response = await axios.post(`${this.phishingServerUrl}/phishing/send`, payload);
            return response.data;
        } catch (error) {
            this.logger.error(`Failed to process simulation: ${error.message}`);
            this.logger.error(`Stack trace: ${error.stack}`);
            throw new Error(`Failed to process simulation: ${error.message}`);
        }
    }
}
