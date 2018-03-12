import { HttpStatus } from '@nestjs/common'
import { IErrorMessages } from '../ErrorMessage'

export const authErrors: IErrorMessages = {
  type: 'auth',
  errors: [
    {
      name: 'unauthorized',
      httpStatus: HttpStatus.UNAUTHORIZED,
      message: 'Not authorized.'
    }
  ]
}
