import { describe, expect, it } from 'vitest'
import { snap } from '@fiction/core/test-utils'

describe('service health checks', () => {
  const services = [
    { url: 'https://www.fiction.com' },
    { url: 'https://docs.fiction.com/', checkForText: 'fiction', noApi: true },
    { url: 'https://theme-minimal.fiction.com' },
    { url: 'https://andrewpowers.fiction.com' },
    { url: 'https://www.andrewpowers.com' },
  ]

  it('services health endpoint works and logs response time', async () => {
    const outputs: Record<string, unknown>[] = []
    for (const service of services) {
      if (service.noApi)
        continue

      const url = `${service.url}/api/health?test=1`
      const startTime = Date.now()

      const response = await fetch(url, { headers: { 'User-Agent': 'Fiction-Test' }, method: 'GET' })
      const endTime = Date.now()

      const responseTime = endTime - startTime

      expect(responseTime, `response time ${service.url}`).toBeLessThan(5000)

      console.warn(`Response time for ${service.url}: ${responseTime}ms`)

      expect(response.status, `response status ${service.url}`).toBe(200)

      const json = (await response.json()) as Record<string, unknown>
      outputs.push(json)

      expect(json.status, `health status ${service.url}`).toBe('success')
      expect(json.message, `health ${service.url}`).toBe('ok')
    }

    expect(snap(outputs)).toMatchInlineSnapshot(`
      [
        {
          "commit": "notFound",
          "duration": "[dateTime:]",
          "message": "ok",
          "status": "success",
          "timestamp": "[dateTime:]",
          "version": "6.0.11",
        },
        {
          "commit": "notFound",
          "duration": "[dateTime:]",
          "message": "ok",
          "status": "success",
          "timestamp": "[dateTime:]",
          "version": "6.0.11",
        },
        {
          "commit": "notFound",
          "duration": "[dateTime:]",
          "message": "ok",
          "status": "success",
          "timestamp": "[dateTime:]",
          "version": "6.0.11",
        },
        {
          "commit": "notFound",
          "duration": "[dateTime:]",
          "message": "ok",
          "status": "success",
          "timestamp": "[dateTime:]",
          "version": "6.0.11",
        },
      ]
    `)
  }, 10000)

  it('websites are live and check content', async () => {
    for (const service of services) {
      const response = await fetch(`${service.url}?test=1`)

      expect(response.status, `status ${service.url}`).toBe(200)

      const html = await response.text()
      expect(html, `html: ${service.url}`).toContain(service.checkForText || '<main')
      // Example: Log instead of asserting specific content
      console.warn(`Content check for ${service.url}:`, html.includes('footer') ? 'Contains footer' : 'Missing footer')
    }
  })
})
