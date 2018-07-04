import * as caller from 'grpc-caller'
import { resolve } from 'path'

const PROTO_PATH = resolve(__dirname, './app/user.proto')

const userService = caller('0.0.0.0:50051', PROTO_PATH, 'UserService')

;(async () => {
  let { users } = await userService.Preload({})

  console.log(users)

  const res = await userService.GetUsername({ id: users[0].id })

  console.log(res)
})()
