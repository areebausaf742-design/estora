import type { IncomingMessage, ServerResponse } from 'node:http'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import priceAssistant from './api/price-assistant.js'

function priceAssistantPreviewApi(): Plugin {
  return {
    name: 'price-assistant-preview-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      process.env.AI_API_KEY ||= env.AI_API_KEY

      server.middlewares.use('/api/price-assistant', async (request, response, next) => {
        if (request.method !== 'POST') {
          next()
          return
        }

        const chunks: Buffer[] = []
        for await (const chunk of request as IncomingMessage) chunks.push(Buffer.from(chunk))

        const body = Buffer.concat(chunks).toString('utf8')
        const apiResponse = response as ServerResponse & {
          status: (code: number) => typeof apiResponse
          json: (value: unknown) => void
        }
        apiResponse.status = (code) => {
          response.statusCode = code
          return apiResponse
        }
        apiResponse.json = (value) => {
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(value))
        }

        await priceAssistant({
          method: request.method,
          headers: request.headers,
          body,
        }, apiResponse)
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), priceAssistantPreviewApi()],
})
