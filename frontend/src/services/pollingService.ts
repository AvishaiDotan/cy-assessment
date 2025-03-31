import { simulationsService } from './simulationsService';
import { IPhishingPayload } from '@avishaidotan/shared-lib';

class PollingService {
  private interval: NodeJS.Timeout | null = null;
  private subscribers: ((data: IPhishingPayload[], isPolling: boolean) => void)[] = [];
  private readonly POLL_INTERVAL = 5000; 

  private async poll() {
    try {
      this.notifySubscribers([], true); 
      const data = await simulationsService.getAllSimulations();
      this.notifySubscribers(data, false); 
    } catch (error) {
      this.notifySubscribers([], false); 
    }
  }

  public subscribe(callback: (data: IPhishingPayload[], isPolling: boolean) => void) {
    this.subscribers.push(callback);
    if (this.subscribers.length === 1) {
      this.start();
    }
    return () => this.unsubscribe(callback);
  }

  private unsubscribe(callback: (data: IPhishingPayload[], isPolling: boolean) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
    if (this.subscribers.length === 0) {
      this.stop();
    }
  }

  private start() {
    this.poll(); // Initial poll
    this.interval = setInterval(() => this.poll(), this.POLL_INTERVAL);
  }

  private stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private notifySubscribers(data: IPhishingPayload[], isPolling: boolean) {
    this.subscribers.forEach(callback => callback(data, isPolling));
  }
}

export const pollingService = new PollingService(); 