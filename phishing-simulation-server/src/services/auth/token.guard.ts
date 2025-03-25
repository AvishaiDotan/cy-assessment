import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { DbService } from '../db.service';
import { IPhishingPayload } from 'shared-lib';
import { Types } from 'mongoose';

@Injectable()
export class TokenGuard implements CanActivate {

    constructor(private readonly dbService: DbService) {
        
    }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const {token, id} = request.params;
    
    if (!token) {
      return false;
    }

    try {

      const isValidForUser = await this.dbService.phishingPayloadRepository.findOne({
        _id: id,
        userId: token
      });

      if (!isValidForUser) {
        return false;
      }

      const extractedResult = ((isValidForUser as any)._doc) as IPhishingPayload;
      if (extractedResult.status === "valid") {
        throw new BadRequestException("Validation already done");
      }
      request.phishingPayload = extractedResult
      return true;
    } catch (error) {
      return false;
    }
  }
} 