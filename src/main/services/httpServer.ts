import http, { Server } from 'http'

let httpServer: Server | null = null

const PORT = 9000

const start = (port?: number) => {
  const p = port || PORT
  httpServer = http
    .createServer((_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('Hello World!')
    })
    .listen(p, () => {
      console.log(`[HTTP SERVER] running on http://localhost:${p}`)
    })
}

const stop = () => {
  if (httpServer) {
    httpServer.close()
    console.log(`[HTTP SERVER] stopped`)
  }
}

export default {
  start,
  stop
}
