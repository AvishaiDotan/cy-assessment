import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { DbService } from '../db.service';
import { IPhishingPayload } from '@avishaidotan/shared-lib';

@Injectable()
export class TokenGuard implements CanActivate {
    private readonly logger = new Logger(TokenGuard.name);

    constructor(private readonly dbService: DbService) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { token, id } = request.params;
        
        if (!token || !id) {
            this.logger.warn('Missing token or id');
            throw new UnauthorizedException('Invalid authentication parameters');
        }

        try {
            const isValidForUser = await this.dbService.phishingPayloadRepository.findOne({
                _id: id,
                userId: token
            });

            if (!isValidForUser) {
                this.logger.warn(`Invalid token attempt for id: ${id}`);
                throw new UnauthorizedException('Invalid token');
            }

            const extractedResult = ((isValidForUser as any)._doc) as IPhishingPayload;
            
            if (extractedResult.status === "valid") {
                throw new BadRequestException("Link has already been validated");
            }
            
            request.phishingPayload = extractedResult;
            return true;
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof UnauthorizedException) {
                throw error;
            }
            this.logger.error(`Token validation error: ${error.message}`);
            return false;
        }
    }
} 