import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Choose API URL based on environment
let apiUrl = import.meta.env.API;
if (import.meta.env.MODE === 'development') {
  apiUrl = 'http://localhost:3000';
}

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: apiUrl,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },

    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const httpClient = new HttpClient(); 