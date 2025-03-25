import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPhishingPayload } from 'shared-lib';
import { DbService } from '../db/db.service';

@Injectable()
export class EmailService {
    /**
     *
     */
    constructor(private readonly dbService: DbService) {
        
    }
    public async sendEmail(payload: IPhishingPayload) {
        try {
            console.log(payload);
            
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to send phishing email',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
