import { describe, expect, it } from 'vitest'
import nodeFetch from 'node-fetch'
import { snap } from '@fiction/core/test-utils'

describe('service health checks', () => {
  it(
    'services health endpoint works',
    async () => {
      const services = [
        'https://www.fiction.com',
        'https://studio.fiction.com',
        'https://socket.fiction.com',
      ]
      const outputs: Record<string, unknown>[] = []
      for (const service of services) {
        const url = `${service}/health?test=1`

        const response = await nodeFetch(url)

        expect(response.status).toBe(200)

        const json = (await response.json()) as Record<string, unknown>

        outputs.push(json)

        expect(json.status).toBe('success')
        expect(json.message).toBe('ok')
      }

      expect(snap(outputs)).toMatchInlineSnapshot(`
        [
          {
            "commit": "todo",
            "duration": "[dateTime:]",
            "message": "ok",
            "status": "success",
            "timestamp": "[dateTime:]",
            "version": "6.0.1",
          },
          {
            "commit": "todo",
            "duration": "[dateTime:]",
            "message": "ok",
            "status": "success",
            "timestamp": "[dateTime:]",
            "version": "6.0.1",
          },
          {
            "commit": "todo",
            "duration": "[dateTime:]",
            "message": "ok",
            "status": "success",
            "timestamp": "[dateTime:]",
            "version": "6.0.1",
          },
        ]
      `)
    },
    { timeout: 10_000 },
  )

  it('websites are live', async () => {
    const sites = ['https://studio.fiction.com', 'https://www.fiction.com']

    for (const site of sites) {
      const response = await nodeFetch(`${site}?test=1`)

      expect(response.status).toBe(200)

      const html = await response.text()

      expect(html).toContain('<html')
    }
  })
})
