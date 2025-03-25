import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private users = []; // In a real app, this would be a database

  async validateUser(email: string, password: string): Promise<any> {
    const user = this.users.find(user => user.email === email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(createUserDto: CreateUserDto) {
    const existingUser = this.users.find(user => user.email === createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = {
      id: this.users.length + 1,
      email: createUserDto.email,
      password: hashedPassword,
      role: 'user'
    };

    this.users.push(user);
    const { password, ...result } = user;
    return result;
  }
} 