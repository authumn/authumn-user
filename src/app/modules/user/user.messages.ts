import { HttpStatus } from '@nestjs/common'
import { IResponseMessages } from '@nestling/messages'

export type SendEmailSuccessPayload = any

export const userMessages: IResponseMessages = {
  type: 'user',
  messages: [
    {
      code: 'sendEmailSuccess',
      statusCode: HttpStatus.OK,
      message: 'Email was send successfully.'
    }
  ]
}
