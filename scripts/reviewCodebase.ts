#!/usr/bin/env tsx

import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'

// Types
type PackageData = { name: string, deps: string[], devDeps: string[], issues: string[] }
type DuplicateMap = Record<string, string[]>

// Configuration
const SECURITY_KEYWORDS = ['bitcoin', 'crypto-currency', 'malware', 'virus', 'hack', 'exploit', 'evil']
const WORKSPACE_DIR = '@fiction'

// Core functions
async function readPackageJson(path: string) {
  try {
    const content = await readFile(join(path, 'package.json'), 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}

function isSecurityRisk(name: string) {
  return SECURITY_KEYWORDS.some(keyword => name.toLowerCase().includes(keyword))
}

async function findPackagePaths(rootPath: string) {
  const workspacePath = join(rootPath, WORKSPACE_DIR)
  const entries = await readdir(workspacePath, { withFileTypes: true })

  const paths = entries
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => join(workspacePath, entry.name))

  const validPaths = []
  for (const path of paths) {
    const pkg = await readPackageJson(path)
    if (pkg)
      validPaths.push(path)
  }

  return validPaths
}

async function analyzePackage(path: string): Promise<PackageData> {
  const pkg = await readPackageJson(path)
  const deps = Object.keys(pkg?.dependencies || {})
  const devDeps = Object.keys(pkg?.devDependencies || {})
  const issues: string[] = []

  // Check security risks
  const allDeps = deps.concat(devDeps)
  allDeps.forEach((dep) => {
    if (isSecurityRisk(dep))
      issues.push(`Security risk: ${dep}`)
  })

  // Check duplicates
  const duplicates = deps.filter(dep => devDeps.includes(dep))
  if (duplicates.length)
    issues.push(`Duplicate deps: ${duplicates.join(', ')}`)

  return { name: pkg?.name || 'unknown', deps, devDeps, issues }
}

function findDuplicateVersions(packages: PackageData[]): DuplicateMap {
  const allDeps = new Map<string, Set<string>>()

  packages.forEach((pkg) => {
    const packageDeps = pkg.deps.concat(pkg.devDeps)
    packageDeps.forEach((dep) => {
      if (!allDeps.has(dep))
        allDeps.set(dep, new Set())
      allDeps.get(dep)!.add(pkg.name)
    })
  })

  return Object.fromEntries(
    Array.from(allDeps.entries())
      .filter(([, packages]) => packages.size > 1)
      .map(([dep, packages]) => [dep, Array.from(packages)]),
  )
}

function formatResults(packages: PackageData[], duplicates: DuplicateMap) {
  console.log(`📦 Found ${packages.length} workspace packages\n`)

  packages.forEach((pkg) => {
    console.log(`${pkg.name}: ${pkg.deps.length} deps, ${pkg.devDeps.length} devDeps`)
    pkg.issues.forEach(issue => console.log(`  ⚠️  ${issue}`))
  })

  if (Object.keys(duplicates).length) {
    console.log('\n🔄 Dependencies used in multiple packages:')
    Object.entries(duplicates).forEach(([dep, pkgs]) => {
      console.log(`  ${dep}: ${pkgs.join(', ')}`)
    })
  }
}

// Main execution
async function main() {
  const packagePaths = await findPackagePaths(process.cwd())
  const packages = await Promise.all(packagePaths.map(analyzePackage))
  const duplicates = findDuplicateVersions(packages)

  formatResults(packages, duplicates)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await main()
}
