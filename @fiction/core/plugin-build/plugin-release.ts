/* server-only-file */
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import type { ExecaError, ExecaSyncReturnValue } from 'execa'
import enquirer from 'enquirer'
import type { ReleaseType } from 'semver'
import semver from 'semver'
import type { FictionEnv } from '../plugin-env'
import { log } from '../plugin-log'
import { getRequire } from '../utils'
import type { PackageJson } from '../types'
import { FictionPlugin } from '../plugin'
import { getPackages, isGitDirty } from './utils'

const { prompt } = enquirer

interface FictionReleaseSettings {
  fictionEnv: FictionEnv
}

export class FictionRelease extends FictionPlugin<FictionReleaseSettings> {
  versionIncrements: ReleaseType[] = ['patch', 'minor', 'major', 'prerelease']
  fictionEnv: FictionEnv
  constructor(settings: FictionReleaseSettings) {
    super('release', settings)
    this.fictionEnv = settings.fictionEnv
  }

  currentVersion = (): string => {
    const pkg = getRequire()(
      path.resolve(process.cwd(), './package.json'),
    ) as PackageJson
    return pkg.version
  }

  versionChoices = (): string[] => {
    const choices = this.versionIncrements.map((i) => {
      const v = semver.inc(this.currentVersion(), i, 'beta') ?? ''
      return `${i} (${v})`
    })
    return [...choices, 'custom']
  }

  run = async (
    bin: string,
    args: string[],
    opts = {},
  ): Promise<ExecaSyncReturnValue> => {
    const { execa } = await import('execa')
    return execa(bin, args, { stdio: 'inherit', cwd: process.cwd(), ...opts })
  }

  commit = async (
    ...commandArgs: [string, string[], Record<string, string>?]
  ): Promise<void | ExecaSyncReturnValue> => {
    const [bin, args, opts] = commandArgs
    try {
      const result = await this.run(bin, args, opts)
      return result
    }
    catch (error) {
      this.log.error('Command failed:', { error })
      throw error // Propagate the error upwards
    }
  }

  updateDeps = (
    name: string,
    type: string,
    deps: Record<string, string>,
    version: string,
  ): Record<string, string> => {
    const packages = getPackages()
    Object.keys(deps).forEach((dep) => {
      if (packages.map(_ => _.name).includes(dep)) {
        this.log.info(`${name} > ${type} > ${dep}@${version}`)
        deps[dep] = version
      }
    })
    return deps
  }

  updatePackage = (cwd?: string, version?: string): void => {
    if (!cwd)
      throw new Error('package cwd is required')
    if (!version)
      throw new Error('version is required')

    const pkgPath = path.resolve(cwd, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath).toString()) as PackageJson
    pkg.version = version

    // const depType = ['dependencies', 'devDependencies']

    // depType.forEach((t) => {
    //   const existing = pkg[t] as Record<string, string> | undefined
    //   if (existing)
    //     pkg[t] = this.updateDeps(pkg.name, t, existing, version)
    // })

    fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
  }

  updateVersions = async (version: string): Promise<void> => {
    this.log.info(`updating cross dependencies to v${version}`)
    const workspaceRoot = path.resolve(process.cwd())
    this.updatePackage(workspaceRoot, version)
    getPackages().forEach((p) => {
      if (!p.cwd)
        log.error('updateVersions', `no package cwd`, { data: p })

      this.updatePackage(p.cwd, version)
    })
  }

  publishPackage = async (pkg: PackageJson, version: string): Promise<void> => {
    if (pkg.private)
      return
    if (!pkg.cwd)
      throw new Error('package cwd is required')

    const access = pkg.publishConfig?.access ?? 'restricted'

    this.log.info(`publishing ${pkg.name}...${process.cwd()}`)
    try {
      await this.commit('pnpm', ['publish', '-r', '--filter', pkg.name, '--access', access, '--publish-branch', 'dev'], {
        stdio: 'pipe',
      })

      this.log.info(`successfully published ${pkg.name}@${version}`)
    }
    catch (error: unknown) {
      const e = error as ExecaError
      if (/previously published/.test(e.stderr))
        this.log.info(`skipping already published: ${pkg.name}`)
      else
        throw e
    }
  }

  runTypeCheck = async (): Promise<void> => {
    this.log.info(`Type checking [.ts/.vue] files...`)
    await this.run('npm', ['run', 'types:ci'])
  }

  runUnitTests = async (): Promise<void> => {
    this.log.info(`Unit Tests...`)
    await this.run('npm', ['exec', '--', 'vitest', 'run'])
  }

  ensureCleanGit = async (
    options: {
      withChanges?: boolean
    } = {},
  ): Promise<void> => {
    const dirty = await isGitDirty()
    if (dirty && options.withChanges) {
      await this.commit('git', ['add', '-A'])
      await this.commit('git', ['commit', '-m', `chore: pre-release [skip]`])
      await this.commit('git', ['push', '--no-verify'])
    }
    else if (dirty) {
      throw new Error('commit changes before publishing')
    }
  }

  deployRoutine = async (options?: {
    skipTests?: boolean
    withChanges?: boolean
  }): Promise<void> => {
    const { skipTests, withChanges } = options || {}

    await this.ensureCleanGit({ withChanges })

    await this.runTypeCheck()

    if (!skipTests)
      await this.runUnitTests()

    const targetVersion = this.currentVersion()

    await this.updateVersions(targetVersion)
    await this.commit('git', ['add', '-A'])
    await this.commit('git', ['commit', '-m', `deploy: v${targetVersion}`])
    await this.commit('git', ['push'])
    await this.commit('git', ['checkout', 'deploy'])
    await this.commit('git', ['merge', 'dev'])
    await this.commit('git', ['push'])
    await this.commit('git', ['checkout', 'dev'])
  }

  releaseRoutine = async (options?: {
    patch?: boolean
    skipTests?: boolean
    withChanges?: boolean
    tag?: string | true
    versionOnly?: boolean
  }): Promise<void> => {
    const { patch, skipTests, versionOnly } = options || {}

    this.log.info(`publish new version [live]`)
    this.log.info(`current version: ${this.currentVersion()}`)

    if (!versionOnly)
      await this.ensureCleanGit(options)

    let targetVersion: string | undefined

    if (patch)
      targetVersion = semver.inc(this.currentVersion(), 'patch') as string

    if (!targetVersion) {
      // no explicit version, offer suggestions
      const { release } = await prompt<{ release: string }>({
        type: 'select',
        name: 'release',
        message: 'Select release type',
        choices: this.versionChoices(),
      })

      if (release === 'custom') {
        const { version } = await prompt<{ version: string }>({
          type: 'input',
          name: 'version',
          message: 'Input custom version',
          initial: this.currentVersion(),
        })
        targetVersion = version
      }
      else {
        const v = release.match(/\((.*)\)/)
        targetVersion = v ? v[1] : undefined
      }
    }

    if (!targetVersion)
      throw new Error('no target version')
    else if (!semver.valid(targetVersion))
      throw new Error(`invalid target version: ${targetVersion}`)

    if (!patch) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        message: `Releasing v${targetVersion}. Confirm?`,
      })

      if (!yes)
        return
    }

    if (!versionOnly)
      await this.runTypeCheck()

    if (!skipTests)
      await this.runUnitTests()

    /**
     * UPDATE PACKAGE.JSON VERSION NUMBERS
     */
    await this.updateVersions(targetVersion)

    if (versionOnly) {
      this.log.info('versions updated.')
      return
    }

    this.log.info('building packages...')
    await this.commit('npm', ['exec', '--', 'fiction', 'run', 'bundle'])

    this.log.info('generate changelog...')
    await this.commit('npm', ['run', 'changelog'])

    // this.log.info(`update lockfile... ${process.cwd()}`)
    // await this.commit('pnpm', ['i'])

    /**
     * COMMIT CHANGES LOCALLY
     */
    const { stdout } = await this.run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      this.log.info('committing git changes...')
      await this.commit('git', ['add', '-A'])
      await this.commit('git', ['commit', '-m', `release: v${targetVersion} [skip]`])
    }
    else {
      this.log.info('no changes to commit')
    }

    this.log.info('pushing changes to origin...')

    /**
     * TAG AND PUSH TO REPO
     */
    this.log.info(`\nChecking git remote configuration...`)
    await this.commit('git', ['remote', '-v'])

    this.log.info(`\nTagging git release`)
    await this.commit('git', ['tag', `v${targetVersion}`])

    this.log.info(`\nPushing to Remote`)
    await this.commit('git', [
      'push',
      '--no-verify',
      'origin',
      `refs/tags/v${targetVersion}`,
    ])
    await this.commit('git', ['push', '--no-verify'])
    /**
     * PUBLISH TO NPM
     */
    this.log.info('publishing packages...')
    const publicPackages = getPackages({ publicOnly: true })

    for (const pkg of publicPackages)
      await this.publishPackage(pkg, targetVersion)

    await this.commit('gh', ['auth', 'status'])

    // if (tag) {
    //   const txt = tag === true ? targetVersion : `${targetVersion} - ${tag}`
    //   this.log.info(`creating tagged release "${txt}"`)

    //   await this.commit('gh', ['release', 'create', txt, '--generate-notes'])
    // }
    // else {
    //   this.log.info('skipping tagged release')
    // }
  }
}
