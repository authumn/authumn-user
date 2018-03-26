import { Component } from '@nestjs/common'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import * as bcrypt from 'bcrypt'
import { MailService } from './mail.service'
import { ConfigService } from '@nestling/config'

@Component()
export class PasswordService {
  constructor(
    private config: ConfigService,
    private adapter: MongoDbAdapter,
    private mailService: MailService
  ) {}

  /**
   * Compare User password
   *
   * @param {string} password1
   * @param {string} password2
   * @returns {Promise<boolean>}
   */
  async compare(password1: string, password2: string): Promise<boolean> {
    return bcrypt.compare(password1, password2)
  }

  /**
   * Hash password
   *
   * @param {string} password
   * @returns {Promise<string>}
   */
  async hash(password: string) {
    return bcrypt.hash(password, this.config.saltRounds)
  }

  async resetPassword(passwordResetToken) {

  }

  async sendResetPasswordEmail(user) {
    this.mailService.sendMail('reset_password', user)
  }

  async sendForgotPasswordEmail(user) {

  }

  async createResetToken() {

  }

  async resetToken() {

  }

  async resetPassword() {

  }

  async forgotPassword() {

  }
}
