import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(email, password);
      if (!user) {
        this.logger.warn(`Failed login attempt for email: ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      this.logger.error(`Authentication error for email ${email}: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('An error occurred during authentication');
    }
  }
} 