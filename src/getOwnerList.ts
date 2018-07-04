import * as caller from 'grpc-caller'
import { resolve } from 'path'

const PROTO_PATH = resolve(__dirname, './app/user.proto')

const userService = caller('0.0.0.0:50051', PROTO_PATH, 'UserService')

;(async () => {
  const res = await userService.Preload({})

  console.log(res)
})()
