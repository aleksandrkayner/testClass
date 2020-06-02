const users = []
function userJoin(id, userName, room) {
  const user = {id, userName, room}
  users.push(user)
  return user
}
function getCurrentUser(id) {
  return users.find(user => user.id === id)
}
function usersForRoom(room) {
  return users.filter(user => {
    return user.room === room
  })
}
module.exports = {
  userJoin,
  getCurrentUser,
  usersForRoom
}
