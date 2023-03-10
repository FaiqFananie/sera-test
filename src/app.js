require('dotenv').config()
const createServer = require('./Infrastructures/http/createServer')
const container = require('../src/Infrastructures/container')

const server = createServer(container)

server.listen(process.env.PORT, () => {
  console.log(`SERA-test is listening on port ${process.env.PORT}`)
})
