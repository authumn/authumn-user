import * as express from 'express'
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { UserModule } from '../../src/app/modules/user'
import { UserService } from '../../src/app/modules/user/user.service'
import { INestApplication } from '@nestjs/common'

describe('UserService', () => {
  let server
  let app: INestApplication

  const userService = { findAll: () => ['srd'] }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule],
    })
      .overrideComponent(UserService)
      .useValue(userService)
      .compile()

    server = express()
    app = module.createNestApplication(server)
    await app.init()
  })

  it(`/GET user`, () => {
    return request(server)
      .get('/user')
      .expect(200)
      .expect({
        data: userService.findAll(),
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
