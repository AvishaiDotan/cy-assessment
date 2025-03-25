import { Injectable } from '@nestjs/common';
import { DbService } from '../../services/db/db.service';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import axios from 'axios';

@Injectable()
export class SimulationsService {
    /**
     *
     */
    constructor(private readonly dbService: DbService) {
    }

    public async getAll(id: any): Promise<IPhishingPayload[]> {
        const simulations = await this.dbService.phishingPayloadRepository.find({ userId: id });
        const data = simulations.map(simulation => ({...(simulation as any)._doc, user: undefined}));
        return data;
    }

    public async insert(payload: IPhishingPayload) {
        try {
            const response = await axios.post('http://localhost:7000/phishing/send', payload);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to send phishing email: ${error.message}`);
        }
    }
}
