'use strict'

const Hapi = require('hapi')
var routes 	    = require('./routes')
var Mongoose = require('mongoose')
var authValidate = require('./helpers/auth.js').validate

const server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 8000
})

// MongoDB Connection
Mongoose.connect('mongodb://localhost/fdfs', { useMongoClient: true })

var rootHandler = function (request, reply) {
  reply({ message: 'Hello from Felkerlytics!'})
}

// Set root route
server.route({
  method: 'GET',
  path: '/',
  handler: rootHandler
})

routes.init(server)

//
// server.register(require('hapi-auth-jwt2'), function (err) {
//   if (err) {
//     console.log(err)
//   }
//
//   server.auth.strategy('jwt', 'jwt',
//     { key: 'NeverShareYourSecret',
//       validateFunc: authValidate,
//       verifyOptions: { algorithms: [ 'HS256' ] }
//     })
//
//   server.auth.default('jwt')
//
//   server.route([
//     {
//       method: 'GET', path: '/', config: { auth: false },
//       handler: function (request, reply) {
//         reply({text: 'Token not required'})
//       }
//     },
//     {
//       method: 'GET', path: '/restricted', config: { auth: 'jwt' },
//       handler: function (request, reply) {
//         reply({text: 'You used a Token!'})
//           .header('Authorization', request.headers.authorization)
//       }
//     }
//   ])
// })

server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Server running at:', server.info.uri)
})
