import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, UseGuards, Req } from '@nestjs/common';
import { IPhishingPayload } from 'shared-lib';
import { EmailService } from '../services/email.service';
import { DbService } from '../services/db.service';
import { TokenGuard } from '../services/auth/token.guard';
import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

interface RequestWithPhishingPayload extends Request {
    phishingPayload: IPhishingPayload;
}

@Controller('phishing')
export class PhishingController {
    constructor(private readonly emailService: EmailService, private readonly dbService: DbService) {}

    @Post('send')
    async sendPhishingEmail(@Body() payload: IPhishingPayload) {
        try {
            payload.link = "temp"
            const insertedPayload = await this.dbService.phishingPayloadRepository.create(payload);
            
            const extractedResult = (insertedPayload as any)._doc;
            extractedResult.link = `http://localhost:7000/phishing/${extractedResult._id}`;
            const result = await this.emailService.sendEmail(extractedResult);
            return result;
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to send phishing email',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get(':id/token/:token')
    @UseGuards(TokenGuard)
    async validatePhishingEmail(@Req() request: any) {
        const phishingPayload = request.phishingPayload;
        
        // Update payload status
        phishingPayload.status = "valid";

        await this.dbService.phishingPayloadRepository.updateOne(
            { _id: phishingPayload._id },
            { $set: { status: "valid" } }
        );
        return phishingPayload;
    }
}
