import { Component } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { environment } from '../../../environments/environment'
import { ErrorMessage } from '../../common/ErrorMessage'

@Component()
export class MailService {
  sendMail(template, user) {
    const transport = nodemailer.createTransport(environment.mailer.transport)

    return transport.sendMail(environment.mailer[template])
  }
}
