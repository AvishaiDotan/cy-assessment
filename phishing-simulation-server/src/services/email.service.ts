import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { DbService } from '../services/db.service';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly dbService: DbService) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST!,
            port: parseInt(process.env.SMTP_PORT!),
            secure: false,
            auth: {
                user: process.env.SMTP_USER!,
                pass: process.env.SMTP_PASS!,
            },
        });
    }

    private createEmailTemplate(content: string, link: string): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Important Message</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                    }
                    .header {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        border-bottom: 1px solid #dee2e6;
                    }
                    .content {
                        padding: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #007bff;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 4px;
                        margin: 20px 0;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 12px;
                        color: #6c757d;
                        border-top: 1px solid #dee2e6;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>Important Message</h2>
                    </div>
                    <div class="content">
                        ${content}
                        <div style="text-align: center;">
                            <a href="${link}" class="button">Please visit this link</a>
                        </div>
                    </div>
                    <div class="footer">
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    private async prepareAndUpdatePayload(payload: IPhishingPayload) {
        try {
            payload.link = "temp";
            const insertedPayload = await this.dbService.phishingPayloadRepository.create(payload);
            
            const extractedResult = (insertedPayload as any)._doc;
            
            const baseUrl = process.env.NODE_ENV! === 'development' ? process.env.PHISHING_SERVER_URL_DEV! : process.env.PHISHING_SERVER_URL!;
            extractedResult.link = `${baseUrl}${extractedResult._id}/token/${extractedResult.userId}`;
            
            await this.dbService.phishingPayloadRepository.updateOne(
                { _id: insertedPayload._id },
                { $set: { link: extractedResult.link } }
            );
            return extractedResult;
        } catch (error) {
            this.logger.error(`Failed to prepare and update payload: ${error.message}`, error.stack);
            throw new InternalServerErrorException(
                'Failed to process phishing payload. Please try again later.',
            );
        }
    }

    public async sendEmail(payload: IPhishingPayload) {
        try {
            // Validate payload
            if (!payload.recipient || !payload.emailContent) {
                throw new HttpException(
                    'Email recipient and content are required',
                    HttpStatus.BAD_REQUEST
                );
            }
            
            if (!this.isValidEmail(payload.recipient)) {
                throw new HttpException(
                    'Invalid email address format',
                    HttpStatus.BAD_REQUEST
                );
            }
            
            const preparedPayload = await this.prepareAndUpdatePayload(payload);
            
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@example.com',
                to: preparedPayload.recipient,
                subject: 'Important: Action Required',
                html: this.createEmailTemplate(preparedPayload.emailContent, preparedPayload.link),
            };

            const info = await this.transporter.sendMail(mailOptions);
            return preparedPayload;
        } catch (error) {
            throw error;
        }
    }
    
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    }
}
