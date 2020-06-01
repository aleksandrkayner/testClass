module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
  io.on('connection', socket => {
    socket.on('chat message', msg => {
      console.log('message: ' + msg)
      io.emit('chat message', msg)
    })
  })
  setInterval(() => io.emit('time', new Date().toTimeString()), 1000)
}
