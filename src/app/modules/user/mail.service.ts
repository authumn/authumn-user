import { Component } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '../config'

@Component()
export class MailService {
  constructor(
    private config: ConfigService
  ) {}
  sendMail(template, user) {
    const transport = nodemailer.createTransport(this.config.mailer.transport)

    return transport.sendMail(this.config.mailer[template])
  }
}
