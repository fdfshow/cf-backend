var Boom = require('boom')
var Joi = require('joi')
var userModal = require('../models/userModal').userDetails

module.exports = exports = function (server) {
  console.log('Loading user routes')
  exports.index(server)
  exports.create(server)
  exports.show(server)
  exports.remove(server)
}

/**
 * GET /users
 * Gets all the users from MongoDb and returns them.
 *
 * @param server - The Hapi Server
 */
exports.index = function (server) {
    // GET /users
  server.route({
    method: 'GET',
    path: '/users',
    handler: function (request, reply) {
      userModal.find({}, function (err, users) {
        if (!err) {
          reply(users)
        } else {
          reply(Boom.badImplementation(err)) // 500 error
        }
      })
    }
  })
}

/**
 * POST /new
 * Creates a new user in the datastore.
 *
 * @param server - The Hapi Serve
 */
exports.create = function (server) {
    // POST /users
  var user

  server.route({
    method: 'POST',
    path: '/users',
    handler: function (request, reply) {
      user = new userModal()
      user.name = request.payload.name
      user.email = request.payload.email
      user.password = user.generateHash(request.payload.password)

      user.save(function (err) {
        if (!err) {
          reply(user).created('/users/' + user._id)    // HTTP 201
        } else {
          reply(Boom.forbidden(getErrorMessageFrom(err))) // HTTP 403
        }
      })
    }
  })
}

/**
 * GET /users/{id}
 * Gets the user based upon the {id} parameter.
 *
 * @param server
 */
exports.show = function (server) {
  server.route({
    method: 'GET',
    path: '/users/{id}',
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().min(5).required()
        }
      }
    },
    handler: function (request, reply) {
      userModal.findById(request.params.id, function (err, user) {
        if (!err && user) {
          reply(user)
        } else if (err) {
                    // Log it, but don't show the user, don't want to expose ourselves (think security)
          console.log(err)
          reply(Boom.notFound())
        } else {
          reply(Boom.notFound())
        }
      })
    }
  })
}

/**
 * DELETE /users/{id}
 * Deletes an user, based on the user id in the path.
 *
 * @param server - The Hapi Server
 */
exports.remove = function (server) {
  server.route({
    method: 'DELETE',
    path: '/users/{id}',
    config: {
      validate: {
        params: {
          id: Joi.string().alphanum().min(5).required()
        }
      }
    },
    handler: function (request, reply) {
      userModal.findById(request.params.id, function (err, user) {
        if (!err && user) {
          user.remove()
          reply({ message: 'user deleted successfully'})
        } else if (!err) {
                    // Couldn't find the object.
          reply(Boom.notFound())
        } else {
          console.log(err)
          reply(Boom.badRequest('Could not delete user'))
        }
      })
    }
  })
}

/**
 * Formats an error message that is returned from Mongoose.
 *
 * @param err The error object
 * @returns {string} The error message string.
 */
function getErrorMessageFrom (err) {
  var errorMessage = ''

  if (err.errors) {
    for (var prop in err.errors) {
      if (err.errors.hasOwnProperty(prop)) {
        errorMessage += err.errors[prop].message + ' '
      }
    }
  } else {
    errorMessage = err.message
  }

  return errorMessage
}
