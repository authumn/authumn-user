import { Component } from '@nestjs/common'
import { MongoDbAdapter } from './adapter/mongo.adapter'
import * as bcrypt from 'bcrypt'
import { environment } from '../../../environments/environment'
import { MailService } from './mail.service'

const saltRounds = environment.saltRounds

@Component()
export class PasswordService {
  constructor(
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
    return bcrypt.hash(password, saltRounds)
  }

  async resetPassword(passwordResetToken) {

  }

  async sendResetPasswordEmail(user) {

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
