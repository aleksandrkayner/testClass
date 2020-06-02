const router = require('express').Router()
const {Assignment} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const assignments = await Assignment.findAll({})
    res.json(assignments)
  } catch (err) {
    next(err)
  }
})
