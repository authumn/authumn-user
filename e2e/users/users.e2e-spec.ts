import * as express from 'express'
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { UserModule } from '../../src/app/modules/user'
import { UserService } from '../../src/app/modules/user/user.service'
import { INestApplication } from '@nestjs/common'
import { HttpExceptionFilter } from '../../src/app/shared/filters/HttpExceptionFilter'
import { MongoDbAdapter } from '../../src/app/modules/user/adapter/mongo.adapter'

describe('UserService', () => {
  let server
  let app: INestApplication

  const userService = { findAll: () => ['srd'] }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule]
    })
//      .overrideComponent(UserService)
//      .useValue(userService)
      .compile()

    server = express()
    app = module.createNestApplication(server)
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.init()
    app
      .select(UserModule)
      .get(MongoDbAdapter)
      .flush()
  })

  describe('Register', () => {
    it(`/POST register`, () => {
      return request(server)
        .post('/user/register')
        .send({
          email: 'test@test.com',
          password: '123456'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.email).toBe('test@test.com')
        })
    })

    it(`/POST register cannot register twice`, () => {
      return request(server)
        .post('/user/register')
        .send({
          email: 'test@test.com',
          password: '123456'
        })
        .expect(400)
    })
  })

  describe('Login', () => {
    it(`/POST can login with correct credentials`, () => {
      return request(server)
        .post('/user/login')
        .send({
          email: 'test@test.com',
          password: '123456'
        })
        .expect(202)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.email).toBe('test@test.com')
        })
    })

    it(`/POST cannot login with incorrect credentials`, () => {
      return request(server)
        .post('/user/login')
        .send({
          email: 'test@test.com',
          password: '123456wrong'
        })
        .expect(400)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
