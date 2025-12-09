import http, { Server } from 'http'

let httpServer: Server | null = null

const PORT = 9000

let serverPort

const start = (cb: (url: string) => void, port?: number) => {
  serverPort = port || PORT
  httpServer = http
    .createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('OK')
      cb(req.url as string)
    })
    .listen(serverPort, () => {
      console.log(`[HTTP SERVER] running on http://localhost:${serverPort}`)
    })
}

const stop = () => {
  if (httpServer) {
    httpServer.close()
    console.log(`[HTTP SERVER] stopped`)
  }
}

const getURL = () => `http://localhost:${serverPort}`

export default {
  start,
  stop,
  getURL
}
