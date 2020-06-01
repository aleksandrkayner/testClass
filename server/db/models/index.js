const User = require('./user')
const Teacher = require('./teacher')
const Assignment = require('./assignment')
const Course = require('./course')
const Announcement = require('./announcement')
const Image = require('./image')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */
User.belongsToMany(Course, {through: UserCourse})
Course.belongsToMany(User, {through: UserCourse})

Course.hasMany(Assignment)
Assignment.belongsTo(Course)

Assignment.belongsToMany(User, {through: UserAssignment})
User.belongsToMany(Assignment, {through: UserAssignment})

Course.hasMany(Announcement)
Announcement.belongsTo(Course)

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Teacher,
  Assignment,
  Image
}
