import { HttpStatus } from '@nestjs/common'

export interface IErrorMessage {
  name: string
  httpStatus: HttpStatus
  message: string
}

export interface IErrorMessages {
  type: string
  errors: IErrorMessage[]
}

export class ErrorMessage extends Error {
  public messageCode: string
  public httpStatus: number
  static errorCodes = {}

  constructor (messageCode: string) {
    super()

    const errorMessage = ErrorMessage.errorCodes[messageCode]

    if (!errorMessage) {
      throw Error('Could not find errorMessage')
    }

    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    this.httpStatus = errorMessage.httpStatus
    this.messageCode = messageCode
    this.message = errorMessage.message
  }

  static addErrorMessages(errorMessages: IErrorMessages) {
    errorMessages.errors.reduce((codes, error) => {
      codes[`${errorMessages.type}:${error.name}`] = error

      return codes
    }, ErrorMessage.errorCodes)
  }
}
