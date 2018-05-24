import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestling/config'

@Injectable()
export class MailService {
  constructor(
    private config: ConfigService
  ) {}
  sendMail(template: string, _user) {
    const transport = nodemailer.createTransport((this.config as any).mailer.transport)

    return transport.sendMail((this.config as any).mailer[template])
  }
}
