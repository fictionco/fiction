import { describe, expect, it } from 'vitest'
import fs from 'fs-extra'
import { safeDirname } from '@fiction/core'

describe('files built', () => {
  const dir = safeDirname(import.meta.url, '..')
  const distDir = `${dir}/dist`
  it('has dist files', async () => {
    const files = await fs.readdir(distDir)

    const expectedDirs = ['app', 'sites']
    expect(files).toEqual(expect.arrayContaining(expectedDirs))

    const expectedFiles = ['client', 'server']

    for (const dir of expectedDirs) {
      const dirFiles = await fs.readdir(`${distDir}/${dir}`)
      expect(dirFiles).toEqual(expect.arrayContaining(expectedFiles))
    }

    const clientFiles = ['index.html', 'assets']
    const serverFiles = ['mount.js', 'assets']

    const clientDirFiles = await fs.readdir(`${distDir}/app/client`)

    expect(clientDirFiles).toEqual(expect.arrayContaining(clientFiles))

    const serverDirFiles = await fs.readdir(`${distDir}/app/server`)

    expect(serverDirFiles).toEqual(expect.arrayContaining(serverFiles))
  })
})
