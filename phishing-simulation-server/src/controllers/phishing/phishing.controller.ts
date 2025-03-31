import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  InternalServerErrorException,
  Put,
} from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { EmailService } from '../../services/email.service';
import { DbService } from '../../services/db.service';
import { TokenGuard } from '../../guards/token.guard';
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

      if (error.code === 'ECONNREFUSED') {
        this.logger.error('SMTP connection refused - server unavailable');
      } else if (error.code === 'EAUTH') {
        this.logger.error('SMTP authentication failed - invalid credentials');
      }

      throw new InternalServerErrorException(
        'Failed to send phishing email. Please try again later.',
      );
    }
  }

  @Put(':id/token/:token')
  @UseGuards(TokenGuard)
  async validatePhishingEmail(@Req() request: any) {
    try {
      const phishingPayload = request.phishingPayload as IPhishingPayload;

      phishingPayload.status = 'visited';

      const updateResult = await this.dbService.phishingPayloadRepository.updateOne(
        { _id: phishingPayload._id },
        { $set: { status: 'valid' } },
      );

      return phishingPayload;
    } catch (error) {
      this.logger.error(
        `Failed to validate phishing email: ${error.message}`,
        error.stack,
      );
      
      throw new InternalServerErrorException(
        'Failed to validate phishing email. Please try again later.',
      );
    }
  }
}
