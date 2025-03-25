import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { EmailService } from '../services/email.service';
import { DbService } from '../services/db.service';
import { TokenGuard } from '../services/auth/token.guard';
import { Logger } from '@nestjs/common';

@Controller('phishing')
export class PhishingController {
  private readonly logger = new Logger(PhishingController.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly dbService: DbService,
  ) {}

  @Post('send')
  async sendPhishingEmail(@Body() payload: IPhishingPayload) {
    try {
      const result = await this.emailService.sendEmail(payload);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send phishing email to ${payload.recipient}: ${error.message}`,
        error.stack,
      );

      // Log specific error cases but don't expose them to the user
      if (error.code === 'ECONNREFUSED') {
        this.logger.error('SMTP connection refused - server unavailable');
      } else if (error.code === 'EAUTH') {
        this.logger.error('SMTP authentication failed - invalid credentials');
      }

      // Always throw a generic error to the user
      throw new InternalServerErrorException(
        'Failed to send phishing email. Please try again later.',
      );
    }
  }

  @Get(':id/token/:token')
  @UseGuards(TokenGuard)
  async validatePhishingEmail(@Req() request: any) {
    const phishingPayload = request.phishingPayload;

    phishingPayload.status = 'valid';

    await this.dbService.phishingPayloadRepository.updateOne(
      { _id: phishingPayload._id },
      { $set: { status: 'valid' } },
    );
    return phishingPayload;
  }
}
