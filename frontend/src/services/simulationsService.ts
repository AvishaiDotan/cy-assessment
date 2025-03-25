import { httpClient } from './httpClient';
import { IPhishingPayload } from '@avishaidotan/shared-lib';


class SimulationsService {
  async getAllSimulations(): Promise<IPhishingPayload[]> {
    return await httpClient.get<IPhishingPayload[]>('/simulations');
  }

  async createSimulation(payload: Partial<IPhishingPayload>): Promise<IPhishingPayload> {
    return await httpClient.post<IPhishingPayload>('/simulations', payload);
  }
}

export const simulationsService = new SimulationsService(); 