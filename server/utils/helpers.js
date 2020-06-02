const moment = require('moment')
function formatMassege(userName, message) {
  return {
    userName,

    message,
    time: moment().format('h:mm a')
  }
}

module.exports = formatMassege
