import * as express from 'express'
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { UserModule } from '../../src/app/modules/user'
import { UserService } from '../../src/app/modules/user/user.service'
import { INestApplication } from '@nestjs/common'
import { MongoDbAdapter } from '../../src/app/modules/user/adapter/mongo.adapter'
import { generateFakeAccessToken } from '../../src/support/generateFakeAccessToken'
import { ApplicationModule } from '../../src/app/app.module'

describe('UserService', () => {
  let server
  let app: INestApplication
  let fakeAccessToken
  let authorizationHeader
  let testUser
  let mongo
  let redis

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule]
    }).compile()

    server = express()

    app = module.createNestApplication(server)

    await app.init()
    await app
      .select(UserModule)
      .get(MongoDbAdapter)
      .flush()

    const userService = await app
      .select(UserModule)
      .get(UserService)

    mongo = await app.get('MongoDbToken')
    redis = await app.get('RedisToken')

    testUser = await userService.createUser('fake@test.com', '123password', {
      username: 'faker'
    })

    fakeAccessToken = await generateFakeAccessToken(
      testUser.id,
      testUser.username,
      process.env.JWT_SECRET as string
    )

    authorizationHeader = `Bearer ${fakeAccessToken}`
  })

  afterAll(async (done) => {
    await mongo.close()
    redis.quit(done)
  })

  describe('Register', () => {
    it(`/POST register`, () => {
      return request(server)
        .post('/user/register')
        .send({
          username: 'testuser',
          email: 'test@test.com',
          password: '123456'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.email).toBe('test@test.com')
        })
    })

    it(`/POST register cannot register twice with same email`, () => {
      return request(server)
        .post('/user/register')
        .send({
          username: 'testuser2',
          email: 'test@test.com',
          password: '123456'
        })
        .expect(400)
    })
  })

  it(`/POST register cannot register twice with same username`, () => {
    return request(server)
      .post('/user/register')
      .send({
        username: 'testuser',
        email: 'test2@test.com',
        password: '123456'
      })
      .expect(400)
  })

  describe('Login', () => {
    it(`/POST can login with email`, () => {
      return request(server)
        .post('/user/login')
        .send({
          login: 'test@test.com',
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

    it(`/POST can login with username`, () => {
      return request(server)
        .post('/user/login')
        .send({
          login: 'testuser',
          password: '123456'
        })
        .expect(202)
        .expect('Content-Type', /json/)
        .then(response => {
          expect(response.body.email).toBe('test@test.com')
        })
    })
  })

  describe('User Admin', () => {
    it(`/GET cannot list users without being authenticated`, () => {
      return request(server)
        .get('/user/list')
        .expect(401)
    })
    it(`/GET cannot get user without being authenticated`, () => {
      return request(server)
        .get('/user/1')
        .expect(401)
    })

    it(`/GET can list users if authenticated`, () => {
      return request(server)
        .get('/user/list')
        .set('Authorization', authorizationHeader)
        .expect(200)
    })

    it(`/GET can get user if authenticated`, () => {
      return request(server)
        .get(`/user/${testUser._id}`)
        .set('Authorization', authorizationHeader)
        .expect(200)
    })

    it(`/GET can update password`, () => {
      return request(server)
        .put('/user/password')
        .send({
          password: '123456new'
        })
        .set('Authorization', authorizationHeader)
        .expect(200)
    })

    /*
    it(`/GET cannot update user id`, () => {
      return request(server)
        .put('/user')
        .send({
          _id: 'different-id'
        })
        .set('Authorization', authorizationHeader)
        .expect(200)
    })

    it(`/GET cannot directly update user's password`, () => {
      return request(server)
        .put('/user')
        .send({
          password: 'brand-new'
        })
        .set('Authorization', authorizationHeader)
        .expect(200)
    })

    it(`/GET cannot directly update user's email`, () => {
      return request(server)
        .put('/user')
        .send({
          email: 'another_email@test.com'
        })
        .set('Authorization', authorizationHeader)
        .expect(200)
    })
    */
  })

  afterAll(async () => {
    await app.close()
  })
})
