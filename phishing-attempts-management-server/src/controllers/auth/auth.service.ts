import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from 'shared-lib';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: IUser[] = []; // In a real app, this would be a database

  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.users.find(user => user.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(signupPayload: { email: string; password: string, name: string }) {
    const existingUser = this.users.find(user => user.email === signupPayload.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupPayload.password, 10);
    const user = {
      id: this.users.length + 1,
      email: signupPayload.email,
      password: hashedPassword,
      name: signupPayload.name, // Use part before @ as name
    };

    this.users.push(user);
    const { password, ...result } = user;
    return result;
  }

  generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
} 