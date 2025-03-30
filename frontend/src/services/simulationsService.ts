import { httpClient } from './httpClient';
import { IPhishingPayload } from '@avishaidotan/shared-lib';


class SimulationsService {
  async getAllSimulations(): Promise<IPhishingPayload[]> {
    return await httpClient.get<IPhishingPayload[]>('/simulations');
  }

  async createSimulation(payload: Partial<IPhishingPayload>): Promise<IPhishingPayload> {
    return await httpClient.post<IPhishingPayload>('/simulations', payload);
  }

  async visitPhishingLink(userId: string, tokenId: string): Promise<boolean> {   
    return await httpClient.put<boolean>(`/simulations/${userId}/token/${tokenId}`, {});
  }
}

export const simulationsService = new SimulationsService(); 