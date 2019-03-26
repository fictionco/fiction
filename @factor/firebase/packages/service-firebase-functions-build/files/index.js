const handler = require(`@factor/service-firebase-functions-entry`)({ baseDir: __dirname })

module.exports = handler.endpoints()
