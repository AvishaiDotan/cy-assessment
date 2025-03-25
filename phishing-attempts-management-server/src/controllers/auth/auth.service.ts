import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from '@avishaidotan/shared-lib';
import { JwtService } from '@nestjs/jwt';
import { DbService } from '../../services/db.service';
import { UserWithoutPassword } from './types';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

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
  }): Promise<UserWithoutPassword> {
    try {
      const existingUser = await this.dbService.usersRepository.findOne({
        email: signupPayload.email,
      });
      if (existingUser) {
        this.logger.warn(`Signup attempt failed: Email ${signupPayload.email} already exists`);
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(signupPayload.password, 10);
      const newUser = {
        email: signupPayload.email,
        password: hashedPassword,
        name: signupPayload.name,
      };

      const createdUser = await this.dbService.usersRepository.insertOne(newUser);
      const { password, ...userWithoutPassword } = (createdUser as any)._doc;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to create user account: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to create user account');
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
