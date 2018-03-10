import { HttpStatus } from '@nestjs/common'
import { IErrorMessages } from './common/MessageCodeError'

export const errorCodes: { [messageCode: string]: IErrorMessages } = {
  'user:emailAlreadyExist': {
    type: 'BadRequest',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Email already exist.'
  },
  'user:notFound': {
    type: 'notFound',
    httpStatus: HttpStatus.NOT_FOUND,
    errorMessage: 'Unable to found the user with the provided information.'
  },
  'action:missingData': {
    type: 'BadRequest',
    httpStatus: HttpStatus.BAD_REQUEST,
    errorMessage: 'Missing parameter data on the action.'
  }
}
