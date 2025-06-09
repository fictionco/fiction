#!/usr/bin/env tsx

import { readFile } from 'node:fs/promises'
import * as path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as dotenv from 'dotenv'
import { execa } from 'execa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configuration
const APPS = [
  'fiction-website',
  'fiction-gateway',
  'fiction-gateway-proxy',
  'fiction-beacon',
] as const

const ENV_DIR = path.resolve(__dirname, '../@fiction/core')

type EnvVars = Record<string, string>

async function loadEnvVars(): Promise<EnvVars> {
  const envPath = path.join(ENV_DIR, '.env')
  const envProdPath = path.join(ENV_DIR, '.env.prod')

  // Load base env
  const baseEnv = dotenv.parse(await readFile(envPath, 'utf8'))

  // Try to load prod env (optional)
  let prodEnv: EnvVars = {}
  try {
    prodEnv = dotenv.parse(await readFile(envProdPath, 'utf8'))
  }
  catch {
    console.log('No .env.prod file found, using .env only')
  }

  // Merge with prod overriding base
  return { ...baseEnv, ...prodEnv }
}

function formatEnvForFly(envVars: EnvVars): string {
  return Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')
}

async function updateAppSecrets(appName: string, envContent: string): Promise<void> {
  console.log(`\n📡 Updating secrets for ${appName}...`)

  try {
    // Use execa with streaming output
    const subprocess = execa('flyctl', ['secrets', 'import', '--app', appName], {
      input: envContent,
      stdio: ['pipe', 'inherit', 'inherit'], // Stream stdout/stderr to terminal
    })

    await subprocess
    console.log(`✅ Successfully updated ${appName}`)
  }
  catch (error: any) {
    console.error(`❌ Failed to update ${appName}:`, error.message)
    throw error
  }
}

function verifyProdVars(envVars: EnvVars): void {
  const prodIndicators = [
    { key: 'POSTGRES_URL', prod: 'neon.tech', dev: 'localhost' },
    { key: 'REDIS_URL', prod: 'redis-cloud.com', dev: 'localhost' },
    { key: 'CLICKHOUSE_URL', prod: 'fiction-clickhouse.fly.dev', dev: 'localhost' },
  ]

  console.log('\n🔍 Verifying production variables...')

  for (const { key, prod, dev } of prodIndicators) {
    const value = envVars[key]
    if (!value) {
      console.warn(`⚠️  ${key} not found`)
      continue
    }

    if (value.includes(prod)) {
      console.log(`✅ ${key}: Production`)
    }
    else if (value.includes(dev)) {
      console.error(`❌ ${key}: Development (${dev}) - This will update production apps with dev credentials!`)
      throw new Error(`Refusing to update with development ${key}`)
    }
    else {
      console.log(`❓ ${key}: Unknown environment`)
    }
  }
}

async function main() {
  try {
    console.log('🔄 Loading environment variables...')
    const envVars = await loadEnvVars()

    verifyProdVars(envVars)

    const envContent = formatEnvForFly(envVars)
    console.log(`\n📋 Found ${Object.keys(envVars).length} environment variables`)

    // Update all apps sequentially to avoid rate limits
    for (const app of APPS) {
      await updateAppSecrets(app, envContent)
    }

    console.log('\n🎉 All apps updated successfully!')
  }
  catch (error: any) {
    console.error('\n💥 Error:', error.message)
    process.exit(1)
  }
}

main()
