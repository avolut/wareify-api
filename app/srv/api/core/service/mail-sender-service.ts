import nodemailer from 'nodemailer';
import { global } from '../../../global';

export class MailSenderRequest {
    constructor(
        readonly senderName: string,
        readonly senderEmail: string,
        readonly receiverName: string,
        readonly receiverEmail: string,
        readonly subject: string,
        readonly bodyHtml: string,
    ) {}
}

export class MailSenderResponse {
    constructor(
        readonly statusCode: number,
        readonly message: string,
    ) {}
}

export interface IMailSenderService {
    sendMail(request: MailSenderRequest): Promise<MailSenderResponse>;
}

export class MailSenderService implements IMailSenderService {
    async sendMail(request: MailSenderRequest): Promise<MailSenderResponse> {
        const transporter = nodemailer.createTransport({
            host: global.MAIL_HOST,
            port: Number(global.MAIL_PORT),
            auth: {
                user: global.MAIL_USERNAME,
                pass: global.MAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: `${request.senderName} <${request.senderEmail}>`,
            to: `${request.receiverName} <${request.receiverEmail}>`,
            subject: request.subject,
            html: request.bodyHtml,
        };

        try {
            await transporter.sendMail(mailOptions);
            return new MailSenderResponse(200, 'Email sent successfully');
        } catch (error) {
            return new MailSenderResponse(500, error.message);
        }
    }
}

export class MailSenderServiceFactory {
    static create(): IMailSenderService {
        return new MailSenderService();
    }
}