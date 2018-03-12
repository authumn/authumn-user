import { Component, Inject } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Component()
export class MailService {
  constructor(
    @Inject('ConfigToken') private config
  ) {}
  sendMail(template, user) {
    const transport = nodemailer.createTransport(this.config.mailer.transport)

    return transport.sendMail(this.config.mailer[template])
  }
}
