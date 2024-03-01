import type { StackProps } from 'aws-cdk-lib'
import type * as ec2 from 'aws-cdk-lib/aws-ec2'

/**
 * AWS env type
 */
interface AwsEnv {
  account: string
  region: 'us-west-2' | 'us-east-1'
}

export type StageId = 'prod' | 'prod-v2'

export function awsAccount(): string {
  return '433775104113'
}
/**
 * Get the standard AWs environment (env) which consists of accountId and region
 */
export function awsEnv(): AwsEnv {
  return {
    account: '433775104113',
    region: 'us-east-1',
  }
}
/**
 * The additional properties that can/should be passed to stacks
 */
export type CustomStackProps = StackProps & {
  stage: StageId
  version?: number
  vpc?: ec2.Vpc
  env?: AwsEnv
}

/**
 * Returns information needed to request and add secrets to resources
 */
export function serviceSecretConfig(): {
  name: string
  arn: string
  hash: string
}[] {
  const { region, account } = awsEnv()
  const config = [
    {
      name: 'AWS_ACCESS_KEY_SECRET',
      hash: 'qaZZyk',
    },
    {
      name: 'POSTGRES_PASSWORD',
      hash: '627qS4',
    },
    {
      name: 'CLICKHOUSE_PASSWORD',
      hash: 'xjjs5P',
    },
    {
      name: 'CLICKHOUSE_2_PASSWORD',
      hash: 'nl5IY2',
    },
    {
      name: 'STRIPE_SECRET_KEY',
      hash: 'n8j6Ko',
    },
    {
      name: 'STRIPE_SECRET_KEY_TEST',
      hash: 'Fed5fF',
    },
    {
      name: 'TOKEN_SECRET',
      hash: 'pbYHNi',
    },
  ]

  return config.map((c) => {
    return {
      ...c,
      arn: `arn:aws:secretsmanager:${region}:${account}:secret:${c.name}-${c.hash}`,
    }
  })
}
/**
 * Gets the configuration for needed node services running in ECS
 */
export function nodeServiceConfig(): {
  name: string
  port: number
  subDomain?: string
  essential?: boolean
  desiredCount?: number
  cpu?: number
  memoryLimitMiB?: number
}[] {
  return [
    { name: 'ingest', port: 3100, subDomain: 'data' },
    { name: 'manager', port: 3200, cpu: 1024, memoryLimitMiB: 2048 },
    { name: 'query', port: 3300, subDomain: 'api' },
    { name: 'replay', port: 3400 },
    { name: 'tracking', port: 3500, subDomain: 'tracking' },
  ]
}
/**
 * Use the URL API
 * https://nodejs.org/api/url.html
 */
export function createUrl({
  protocol = 'http',
  hostname = 'localhost',
  port = '',
  pathname = '',
  username = '',
  password = '',
  options = {},
}): string {
  const parts = [`${protocol}://`]

  if (username || password) {
    if (username)
      parts.push(`${username}:`)
    if (password)
      parts.push(`${password}`)
    parts.push(`@`)
  }

  parts.push(hostname)
  if (port)
    parts.push(`:${port}`)
  if (pathname)
    parts.push(pathname)

  if (Object.keys(options).length > 0)
    parts.push(`?${new URLSearchParams(options).toString()}`)

  return parts.join('')
}

export interface StageDomain {
  certificateArn: string
  domainName: string
  hostedZoneId: string
}
/**
 * Get the domain information to associate with a deployment stage
 */
export function getStageDomain(): StageDomain {
  const { region, account } = awsEnv()

  const out: Partial<StageDomain> = {
    domainName: 'kaption.net',
    hostedZoneId: 'Z06779591DK2ACBQN6R5C',
  }

  const cid = '8a0915e5-6e04-4ffd-9185-676a008dcb83'
  // out = {
  //   domainName: "darwin.to",
  //   hostedZoneId: "Z07874581L8QNDDZ8P6XD",
  // }
  // cid = "551216b4-80de-44f8-affb-d4b6a0850248"

  out.certificateArn = `arn:aws:acm:${region}:${account}:certificate/${cid}`

  return out as StageDomain
}

/**
 * Capitalize first letter
 */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
/**
 * Utility to create IDs that match the standard AWS PascaleCase style
 * All args will be capitalized and appended
 */
export function baseId(...args: string[]): string {
  return args.map(_ => capitalize(_)).join('')
}
/**
 * Emulate the stage based prefix that CDK adds
 */
export function stageId(stage: string, ...args: string[]): string {
  return `${stage}-${baseId(...args)}`
}
