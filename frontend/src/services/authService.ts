import { httpClient } from "./httpClient";


class AuthService {
  async getCurrentUser(): Promise<any | null> {
    try {
      return await httpClient.get<any>("/auth/me");
    } catch (error) {
      return null;
    }
  }

  async login(credentials: { email: string, password: string }): Promise<any> {
    return await httpClient.post<any>("/auth/login", credentials);
  }

  async signup(credentials: {email: string, password: string, name: string}): Promise<any> {
    return await httpClient.post<any>("/auth/signup", credentials);
  }

  async logout(): Promise<void> {
    await httpClient.post("/auth/logout");
  }
}

export const authService = new AuthService();
