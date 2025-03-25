import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, UseGuards, Req } from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { EmailService } from '../services/email.service';
import { DbService } from '../services/db.service';
import { TokenGuard } from '../services/auth/token.guard';


@Controller('phishing')
export class PhishingController {
    constructor(private readonly emailService: EmailService, private readonly dbService: DbService) {}

    @Post('send')
    async sendPhishingEmail(@Body() payload: IPhishingPayload) {
        try {
            const result = await this.emailService.sendEmail(payload);
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
        
        phishingPayload.status = "valid";

        await this.dbService.phishingPayloadRepository.updateOne(
            { _id: phishingPayload._id },
            { $set: { status: "valid" } }
        );
        return phishingPayload;
    }
}
