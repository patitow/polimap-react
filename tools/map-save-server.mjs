import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.MAP_SAVE_PORT ? Number(process.env.MAP_SAVE_PORT) : 4175
const TARGET_PATH = path.join(__dirname, '..', 'public', 'config', 'map_points.json')

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  })
  res.end(JSON.stringify(data))
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    return res.end()
  }

  if (req.method === 'POST' && req.url === '/save-map-points') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      // Proteção básica contra payloads enormes
      if (body.length > 5 * 1024 * 1024) {
        req.destroy()
      }
    })

    req.on('end', () => {
      try {
        const parsed = JSON.parse(body)
        const formatted = JSON.stringify(parsed, null, 2)
        fs.writeFile(TARGET_PATH, formatted + '\n', (err) => {
          if (err) {
            console.error('Erro ao salvar map_points.json:', err)
            return sendJson(res, 500, { ok: false, error: 'write_failed' })
          }
          console.log(
            `[map-save-server] map_points.json salvo (${TARGET_PATH}), tamanho ${
              formatted.length
            } bytes`
          )
          return sendJson(res, 200, { ok: true })
        })
      } catch (e) {
        console.error('Erro ao processar payload de save-map-points:', e)
        return sendJson(res, 400, { ok: false, error: 'invalid_json' })
      }
    })

    return
  }

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
})

server.listen(PORT, () => {
  console.log(`[map-save-server] Escutando em http://localhost:${PORT}/save-map-points`)
  console.log(`[map-save-server] Salvando em: ${TARGET_PATH}`)
})

