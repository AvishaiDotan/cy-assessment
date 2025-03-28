import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

const cookieExtractor = (req: Request): string | null => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['token'];
    }
    return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: JwtPayload): Promise<any> {
        try {
            const user = await this.authService.getUser(payload.sub!);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const { password, ...result } = (user as any)._doc;
            return result;
        } catch (error) {
            this.logger.error(`Failed to validate token: ${error.message}`, error.stack);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Failed to validate token');
        }
    }


} 