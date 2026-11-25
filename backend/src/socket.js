import jwt from 'jsonwebtoken'
import { getUserInfoById } from './services/users.js'

export function handleSocket(io) {
  io.use((socket, next) => {
    if (!socket.handshake.auth?.token) {
      return next(new Error('Authentication failed: no token provided'))
    }
    jwt.verify(
      socket.handshake.auth.token,
      process.env.JWT_SECRET,
      async (err, decodedToken) => {
        if (err) {
          return next(new Error('Authentication failed: invalid token'))
        }
        socket.auth = decodedToken
        socket.user = await getUserInfoById(socket.auth.sub)
        return next()
      },
    )
  })

  io.on('connection', (socket) => {
    console.log('user connected:', socket.id)

    socket.on('recipe.added', (recipe) => {
      console.log(`${socket.id}, 'TESTING'`)
      socket.broadcast.emit('enable.popup', {
        username: socket.user.username,
        id: recipe.id,
        title: recipe.title,
      })
      console.log(`${socket.id}, 'POP UP CODE SENT'`)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected:', socket.id)
    })

    socket.on('chat.message', (message) => {
      console.log(`${socket.id}: ${message}`)
      io.to(room).emit('chat.message', {
        username: socket.user.username,
        message,
      })
    })

    socket.on('user.info', async (socketId, callback) => {
      const sockets = await io.in(socketId).fetchSockets()
      if (sockets.length === 0) return callback(null)
      const socket = sockets[0]
      const userInfo = {
        socketId,
        rooms: Array.from(socket.rooms),
        user: socket.user,
      }
      return callback(userInfo)
    })
  })
}
