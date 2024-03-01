require('./transpile')()

const { handler: tracking } = require('./function-tracking/app')

module.exports.tracking = tracking
