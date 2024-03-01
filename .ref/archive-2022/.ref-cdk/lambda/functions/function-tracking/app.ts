/* eslint-disable no-console */
import type { Project } from '@kaption/core'

import AWS from 'aws-sdk'

import { Client } from 'pg'

import type { CloudFrontRequestHandler } from 'aws-lambda'
import { clientProjectInfoForClient, toCamelCase } from '../utils'

const region = 'us-east-1'
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
const secret = new AWS.SecretsManager({ region })

export const handler: CloudFrontRequestHandler = async (event) => {
  const request = event.Records[0].cf.request
  const response: {
    status: string
    statusDescription: string
    body: string
    headers: Record<string, { key: string, value: string }[]>
  } = {
    status: '200',
    statusDescription: 'OK',
    body: 'empty',
    headers: {},
  }
  const uri = request.uri

  const sc = await secret
    .getSecretValue({ SecretId: 'POSTGRES_PASSWORD' })
    .promise()

  const searchParams = new URLSearchParams(request.querystring)
  let projectId = searchParams.get('id')

  if (!projectId)
    projectId = uri.replace('/', '').replace('.js', '')

  console.log('finding projectId', projectId)

  if (projectId && projectId.length > 4) {
    const client = new Client({
      user: 'darwin',
      host: 'pdlmri1ziie2p8.cyf2xhlxf3zi.us-east-1.rds.amazonaws.com',
      database: 'darwin',
      password: sc.SecretString,
    })

    await client.connect()

    const q = `SELECT
                project_name,
                project_domain,
                project_settings,
                project_events,
                experiments,
                tracking_settings,
                project_status
              FROM kaption_project
              WHERE project_id = $1;`
    const r = await client.query(q, [projectId])

    await client.end()

    let result: Partial<Project> = {}
    if (r.rows.length > 0) {
      const ro = r.rows[0] as Record<string, any>
      const casedResult = toCamelCase(ro) as Partial<Project>
      result = clientProjectInfoForClient(casedResult) ?? {}
      console.log('RESULTS', casedResult, result)
    }

    const trackingScript = {
      Bucket: 'kaption-prod-script',
      Key: 't.js',
    }
    const data = await s3.getObject(trackingScript).promise()

    const scriptCode = data.Body?.toString('utf8')

    const settingsJs = `window.__kaption = {project: ${JSON.stringify(
      result,
    )}};\n`

    response.body = `/* -- [kaption] ${result.projectDomain} ${projectId} -- */ \n ${settingsJs} \n ${scriptCode}`

    const headerCacheControl = 'Cache-Control'
    const cacheControlKey = headerCacheControl.toLowerCase()
    const defaultTimeToLive = 60 * 15 // 15 minutes

    if (response.status === '200' && !response.headers[cacheControlKey]) {
      response.headers[cacheControlKey] = [
        {
          key: headerCacheControl,
          value: `private, max-age=${defaultTimeToLive}`,
        },
      ]
    }

    // Added to avoid warnings
    const headerContentType = 'Content-Type'
    response.headers[headerContentType.toLowerCase()] = [
      {
        key: headerContentType,
        value: 'application/javascript; charset=UTF-8',
      },
    ]

    // CORS headers - Not sure if needed but added same at gtag.js
    const headerCrossOrigin = 'Cross-Origin-Resource-Policy'
    response.headers[headerCrossOrigin.toLowerCase()] = [
      {
        key: headerCrossOrigin,
        value: 'cross-origin',
      },
    ]
    const headerAllowOrigin = 'Access-Control-Allow-Origin'
    response.headers[headerAllowOrigin.toLowerCase()] = [
      {
        key: headerAllowOrigin,
        value: '*',
      },
    ]

    return response
  }

  return request
}
