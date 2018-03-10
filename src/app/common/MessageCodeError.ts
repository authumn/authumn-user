import { HttpStatus } from '@nestjs/common';

export interface IErrorMessages {
  type: string;
  httpStatus: HttpStatus;
  errorMessage: string;
  userMessage: string;
}

export class MessageCodeError extends Error {
  public messageCode: string;
  public httpStatus: number;
  public errorMessage: string;
  static errorCodes

  constructor (messageCode: string) {
    super();

    const errorMessageConfig = MessageCodeError.getMessageFromMessageCode(messageCode);
    if (!errorMessageConfig) throw new Error('Unable to find message code error.');

    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.httpStatus = errorMessageConfig.httpStatus;
    this.messageCode = messageCode;
    this.errorMessage = errorMessageConfig.errorMessage;
    this.message = errorMessageConfig.userMessage;
  }

  static getMessageFromMessageCode (messageCode: string): IErrorMessages {
    let errorMessage: IErrorMessages | undefined;
    Object.keys(MessageCodeError.errorCodes).some(key => {
      if (key === messageCode) {
        errorMessage = MessageCodeError.errorCodes[key];
        return true;
      }
      return false;
    });

    if (!errorMessage) throw new Error('Unable to find the given message code error.');
    return errorMessage;
  }


  static addErrorCodes(codes) {
    MessageCodeError.errorCodes = codes
  }
}
