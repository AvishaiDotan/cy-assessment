import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { DbService } from '../services/db.service';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class EmailService {
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
        console.log('[EmailService] Starting payload preparation for recipient:', payload.recipient);
        payload.link = "temp";
        console.log('[EmailService] Creating initial payload in database');
        const insertedPayload = await this.dbService.phishingPayloadRepository.create(payload);
        
        const extractedResult = (insertedPayload as any)._doc;
        console.log('[EmailService] Payload created with ID:', extractedResult._id);
        
        extractedResult.link = `http://localhost:7000/phishing/${extractedResult._id}/token/${extractedResult.userId}`;
        console.log('[EmailService] Generated phishing link:', extractedResult.link);
        
        console.log('[EmailService] Updating payload with final link');
        await this.dbService.phishingPayloadRepository.updateOne(
            { _id: insertedPayload._id },
            { $set: { link: extractedResult.link } }
        );
        console.log('[EmailService] Payload preparation completed successfully');
        return extractedResult;
    }

    public async sendEmail(payload: IPhishingPayload) {
        try {
            console.log('[EmailService] Starting email sending process for recipient:', payload.recipient);
            const preparedPayload = await this.prepareAndUpdatePayload(payload);
            
            console.log('[EmailService] Preparing email with content length:', preparedPayload.emailContent.length);
            const mailOptions = {
                from: process.env.SMTP_FROM || 'noreply@example.com',
                to: preparedPayload.recipient,
                subject: 'Important: Action Required',
                html: this.createEmailTemplate(preparedPayload.emailContent, preparedPayload.link),
            };

            console.log('[EmailService] Attempting to send email via SMTP');
            const info = await this.transporter.sendMail(mailOptions);
            console.log('[EmailService] Email sent successfully:', {
                messageId: info.messageId,
                recipient: preparedPayload.recipient,
                response: info.response
            });
            return info;
        } catch (error) {
            console.error('[EmailService] Failed to send email:', {
                error: error.message,
                stack: error.stack,
                recipient: payload.recipient
            });
            throw new HttpException(
                error.message || 'Failed to send phishing email',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
