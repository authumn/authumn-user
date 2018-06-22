import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestling/config'
import * as mustache from 'mustache'
import { User } from './models'
import * as Mail from 'nodemailer/lib/mailer'

export interface MailerObject {
  subject: string
  template: string
}

@Injectable()
export class MailService {
  private transport: Mail
  constructor(
    private config: ConfigService
  ) {
    this.transport = nodemailer.createTransport((this.config as any).mailer.transport)
  }
  async sendMail<TVars = any>(templateName: string, vars: TVars) {
    const { subject, template } = (this.config as any).mailer[templateName]

    const text = mustache.render(template, vars)

    return this.transport.sendMail({
      subject,
      text
    })
  }

  private getTemplate(template: string): MailerObject {
    if ((this.config as any).mailer[template]) {
      return (this.config as any).mailer[template]
    }

    throw Error(`Could not find template ${template}`)
  }
}
