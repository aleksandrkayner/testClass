const formatMessage = require('../utils/helpers')
const {userJoin, getCurrentUser, usersForRoom} = require('../utils/user')

module.exports = io => {
  const name = 'alex'
  io.on('connection', socket => {
    socket.on('joinRoom', ({userName, room}) => {
      const user = userJoin(socket.id, userName, room)
      console.log(user)
      socket.join(user.room)

      socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(userName, 'welcome'))
    })
    //socket.emit('message', formatMessage(userName, 'welcome'))
    socket.on('chat-message', msg => {
      const user = getCurrentUser(socket.id)
      console.log(user)

      io
        .to(user.room)
        .emit('chat-message', formatMessage(msg.userName, msg.message))
    })
    socket.on('getUsers', msg => {
      const user = getCurrentUser(socket.id)
      let roomUsers = usersForRoom(msg.room)
      io.to(user.room).emit('getUsers', roomUsers)
      console.log('room users', roomUsers)
    })
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      io.emit('message', formatMessage(name, 'user disconected'))
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
  // io.on('connection', socket => {
  //   socket.on('chat message', msg => {
  //     console.log('message: ' + msg)
  //     io.emit('chat message', msg)
  //   })
  // })
  //setInterval(() => io.emit('time', new Date().toTimeString()), 1000)
}
