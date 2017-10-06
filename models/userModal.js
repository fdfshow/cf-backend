var Mongoose = require('mongoose')
var Schema = Mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

// The data schema for an event that we're tracking in our analytics engine
var userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, trim: true },
  dateCreated: { type: Date, required: true, default: Date.now }
})

// hash the password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

var userDetails = Mongoose.model('user_details', userSchema)

module.exports = {
  userDetails: userDetails
}
