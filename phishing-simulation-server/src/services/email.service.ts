import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IPhishingPayload } from '@avishaidotan/shared-lib';
import { DbService } from './db/db.service';
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
                    :root {
                        --white: #FFFFFFff;
                        --ghost-white: #F1F2FBff;
                        --international-klein-blue: #4029A4ff;
                        --white-2: #FFFFFFff;
                        --white-3: #FEFEFEff;
                        --periwinkle: #BAB5E2ff;
                        --black: #000000ff;
                        --white-4: #FFFFFFff;
                        --tropical-indigo: #9A74F3ff;
                        --white-5: #FFFFFFff;
                    }
                    
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: var(--black);
                        margin: 0;
                        padding: 0;
                        background-color: var(--ghost-white);
                    }
                    .container {
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 0;
                        background-color: var(--white);
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, var(--international-klein-blue), var(--tropical-indigo));
                        padding: 30px 20px;
                        text-align: center;
                        color: var(--white);
                    }
                    .header h2 {
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }
                    .content {
                        padding: 30px;
                        background-color: var(--white-3);
                    }
                    .button {
                        display: inline-block;
                        padding: 16px 32px;
                        background: linear-gradient(135deg, var(--international-klein-blue), var(--tropical-indigo));
                        color: var(--white);
                        text-decoration: none;
                        border-radius: 8px;
                        margin: 25px 0;
                        font-weight: 600;
                        font-size: 16px;
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                        box-shadow: 0 4px 6px rgba(64, 41, 164, 0.2);
                    }
                    .button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 12px rgba(64, 41, 164, 0.3);
                    }
                    .button-container {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .footer {
                        text-align: center;
                        padding: 25px;
                        font-size: 13px;
                        color: var(--periwinkle);
                        background-color: var(--ghost-white);
                        border-top: 1px solid rgba(186, 181, 226, 0.3);
                    }
                    .content p {
                        margin-bottom: 20px;
                        color: var(--black);
                        font-size: 16px;
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
                        <div class="button-container">
                            <a href="${link}" class="button">Click Here to Continue</a>
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
            
            const baseUrl = process.env.NODE_ENV! === 'development' && process.env.FRONTEND_URL ? process.env.FRONTEND_URL! : process.env.IP!;
            extractedResult.link = `${baseUrl}/visited/${extractedResult._id}/token/${extractedResult.userId}`;
            
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
