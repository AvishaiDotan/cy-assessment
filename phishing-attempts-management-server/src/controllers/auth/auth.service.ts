import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from '@avishaidotan/shared-lib';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../../services/db/db.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly dbService: DbService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.dbService.usersRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, (user as any)._doc.password))) {
      const { password, ...result } = (user as any)._doc;
      return result;
    }
    return null;
  }

  async signup(signupPayload: {
    email: string;
    password: string;
    name: string;
  }): Promise<Omit<IUser, 'password'>> {
    try {
      const existingUser = await this.dbService.usersRepository.findOne({
        email: signupPayload.email,
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(signupPayload.password, 10);
      const newUser = {
        email: signupPayload.email,
        password: hashedPassword,
        name: signupPayload.name,
      };

      const createdUser = await this.dbService.usersRepository.insertOne(newUser);
      const { password, ...result } = (createdUser as any)._doc;
      return result;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('Email already exists');
      } else {
        throw error;
      }
    }
  }

  async getUser(userId: string): Promise<IUser | null> {
    try {
      return await this.dbService.usersRepository.findOne({ _id: userId });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  generateToken(user: any) {
    const payload = { email: user.email, sub: user._id.toString() };
    return this.jwtService.sign(payload);
  }
}
