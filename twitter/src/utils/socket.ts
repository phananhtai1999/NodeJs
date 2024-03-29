import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'
import { verifyAccessToken } from './commons'
import { TokenJwtPayload } from '~/models/requests/user.requests'
import { UserVerifyStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import { UsersMessages } from '~/constants/messages'
import HttpStatus from '~/constants/httpStatus'
import Conversation from '~/models/schemas/conversation.schema'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      // console.log(decoded_authorization)
      // const { verify } = decoded_authorization as TokenJwtPayload
      // if (verify !== UserVerifyStatus.Verified) {
      //   throw new ErrorWithStatus({
      //     message: UsersMessages.USER_NOT_FOUND,
      //     status: HttpStatus.FORBIDDEN
      //   })
      // }

      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'UnauthorizedError',
        data: error
      })
    }
  })
  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected`)
    const { user_id } = socket.handshake.auth.decoded_authorization as TokenJwtPayload
    users[user_id] = {
      socket_id: socket.id
    }

    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessToken(access_token)
        next()
      } catch (err) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })
    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload
      const receiver_socket_id = users[receiver_id]?.socket_id
      const conversation = new Conversation({
        sender_id: new ObjectId(sender_id),
        receiver_id: new ObjectId(receiver_id),
        content: content
      })

      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      const data_conversation = {
        payload: conversation
      }

      socket.emit('send_message_success', data_conversation)

      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive_message', {
          payload: conversation
        })
      }
    })
    socket.on('disconnect', () => {
      delete users['user_id']
      console.log(`user ${socket.id} disconnected`)
    })
  })
}

export default initSocket
