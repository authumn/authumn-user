import { HttpException } from '@nestjs/core';
import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import * as ajv from 'ajv'
import { MessageCodeError } from '../../common/MessageCodeError'
import { ServerResponse } from 'http'

const { ValidationError } = ajv

@Catch(
  ValidationError,
  MessageCodeError,
  HttpException,
  Error
)
export class HttpExceptionFilter implements ExceptionFilter {
  public catch (
    exception: HttpException,
    response: ServerResponse
  ) {
    console.error(exception);

    if (exception instanceof MessageCodeError) {
      response.setHeader('x-message-code-error', exception.messageCode);
      response.setHeader('x-message', exception.message);
      response.setHeader('x-httpStatus-error', exception.httpStatus);

      return response.status(exception.httpStatus).send();
    } else if (exception instanceof ValidationError) {
      response.setHeader('x-message-code-error', exception.errors[0].keyword);
      response.setHeader('x-message', exception.errors[0].message);
      response.setHeader('x-httpStatus-error', HttpStatus.BAD_REQUEST);

      return response.status(HttpStatus.BAD_REQUEST).send();
    } else {
      console.log('NOT VALIDATION ERROR?')
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
