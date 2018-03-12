import * as jwt from 'jsonwebtoken'
import * as uuid from 'uuid'
import { environment } from '../environments/environment'

const expiration_time = 10 * 1000
const issuer = 'test.com'

export async function generateFakeAccessToken (userId, email, secret = environment.jwt.secret): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000)
  const jwtid = uuid.v4()

  return jwt.sign(
    {
      iss: issuer,
      sub: email,
      aud: 'test_token',
      email,
      sub: userId,
      exp: issuedAt + expiration_time,
      iat: issuedAt
    },
    secret,
    {
      algorithm: 'HS256',
      jwtid
    }
  )
}
