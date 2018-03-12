import {
  HttpException,
  ExceptionFilter,
  HttpStatus,
  NotFoundException,
  Catch,
  LoggerService
} from '@nestjs/common'
import * as ajv from 'ajv'
import { ErrorMessage } from '../../common/ErrorMessage'
import { ServerResponse } from 'http'
import { JsonWebTokenError } from 'jsonwebtoken'
import { environment } from '../../../environments/environment'

const { ValidationError } = ajv

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private loggerService: LoggerService
  ) {}
  public catch (
    exception: HttpException,
    response: ServerResponse
  ) {
    console.error(exception)

    let error;

    if (exception instanceof HttpException) {
      error = {
        code: exception.message.error,
        message: exception.message.message,
        statusCode: exception.message.statusCode
      }
    } else if (exception instanceof ErrorMessage) {
      error = {
        code: exception.messageCode,
        message: exception.message,
        statusCode: exception.httpStatus
      }
    } else if (exception instanceof ValidationError) {
      error = {
        code: exception.errors[0].keyword,
        message: exception.errors[0].message,
        statusCode: HttpStatus.BAD_REQUEST
      }
    } else if (exception instanceof JsonWebTokenError) {
      error = {
        code: exception.name,
        message: exception.message,
        statusCode: HttpStatus.BAD_REQUEST
      }
    } else {
      error = {
        code: 'bad_request',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }

    response.setHeader(`x-${environment.clientId}-error-code`, error.code)
    response.setHeader(`x-${environment.clientId}-error-message`, error.message)
    response.setHeader(`x-${environment.clientId}-error-statusCode`, error.statusCode)
    response
      .status(error.statusCode)
      .send(error.body)
  }
}
