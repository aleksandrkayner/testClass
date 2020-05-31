const Sequelize = require('sequelize')
const db = require('../db')
const {STRING} = Sequelize

const Image = db.define('image', {
  url: {
    type: STRING,
    allowNull: false
  }
})

module.exports = Image
