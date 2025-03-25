import { Injectable } from '@nestjs/common';
import { DbService } from '../../services/db/db.service';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import axios from 'axios';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

@Injectable()
export class SimulationsService {
    private phishingServerUrl: string;

    constructor(private readonly dbService: DbService) {
        // Get the phishing server URL from environment variables with a fallback
        this.phishingServerUrl = process.env.PHISHING_SERVER_URL || 'http://phishing-server:7000';
    }

    public async getAll(id: any): Promise<IPhishingPayload[]> {
        const simulations = await this.dbService.phishingPayloadRepository.find({ userId: id });
        const data = simulations.map(simulation => ({...(simulation as any)._doc, user: undefined}));
        return data;
    }

    public async insert(payload: IPhishingPayload) {
        try {
            console.log(`Sending phishing email to ${this.phishingServerUrl}/phishing/send`);
            const response = await axios.post(`${this.phishingServerUrl}/phishing/send`, payload);
            return response.data;
        } catch (error) {
            console.error(`Failed to send phishing email: ${error.message}`);
            throw new Error(`Failed to send phishing email: ${error.message}`);
        }
    }
}
