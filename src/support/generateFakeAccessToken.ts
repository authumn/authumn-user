import * as jwt from 'jsonwebtoken'
import * as uuid from 'uuid'

const expirationTime = 10 * 1000
const issuer = 'test.com'

export async function generateFakeAccessToken (
  userId: string,
  username: string,
  secret: string
): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000)
  const jwtid = uuid.v4()

  const payload = {
    iss: issuer,
      aud: 'test_token',
    username,
    sub: userId,
    exp: issuedAt + expirationTime,
    iat: issuedAt
  }

  return jwt.sign(
    payload,
    secret,
    {
      algorithm: 'HS256',
      jwtid
    }
  )
}
