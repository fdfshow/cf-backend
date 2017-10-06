'use strict'

exports.init = function (server) {
  console.log('Loading routes')
  require('./users')(server)
}
