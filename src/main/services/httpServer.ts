import http, { Server } from 'http'

let httpServer: Server | null = null

const PORT = 9000

const start = (cb: (url: string) => void, port?: number) => {
  const p = port || PORT
  httpServer = http
    .createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      res.end('OK')
      cb(req.url as string)
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
