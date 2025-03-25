import { Controller, Post, Body, HttpException, HttpStatus, Get, Param } from '@nestjs/common';
import { IPhishingPayload } from 'shared-lib';
import { EmailService } from '../services/email/email.service';
import { DbService } from '../services/db/db.service';
@Controller('phishing')
export class PhishingController {
    constructor(private readonly emailService: EmailService, private readonly dbService: DbService) {}

    @Post('send')
    async sendPhishingEmail(@Body() payload: IPhishingPayload) {
        try {
            payload.link = "temp"
            const insertedPayload = await this.dbService.phishingPayloadRepository.create(payload);
            
            const extractedResult = (insertedPayload as any)._doc;
            extractedResult.link = `http://localhost:7000/validate/${extractedResult._id}`;
            const result = await this.emailService.sendEmail(extractedResult);
            return result;
        } catch (error) {
            throw new HttpException(
                error.message || 'Failed to send phishing email',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Get('validate/:id')
    async validatePhishingEmail(@Param('id') id: string) {
        const payload = await this.dbService.phishingPayloadRepository.findById(id);
        const extractedResult = ((payload as any)._doc) as IPhishingPayload
        extractedResult.status = "GOOD"
        await this.dbService.phishingPayloadRepository.updateOne(extractedResult)
        return payload;
    }
}
