import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Res,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signupPayload: { email: string; password: string; name: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const user = await this.authService.signup(signupPayload);
      const token = this.authService.generateToken(user);

      response.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          {
            success: false,
            message: 'Email already exists',
            error: 'DUPLICATE_EMAIL',
          },
          HttpStatus.CONFLICT,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to register user',
          error: error.message || 'INTERNAL_SERVER_ERROR',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    try {
      const token = this.authService.generateToken(req.user);
      response.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });
      return req.user;
    } catch (error) {
      this.logger.error(
        `Login failed for user ${req.user?.email || 'unknown'}: ${error.message}`,
        error.stack,
        'AuthController',
      );
      throw new InternalServerErrorException('Failed to login user');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }
}
