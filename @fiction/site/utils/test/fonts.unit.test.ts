/**
 * @vitest-environment happy-dom
 */

import { googleFontsUtility } from '@fiction/core/utils/fonts'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createSiteTestUtils } from '../../test/testUtils'
import { activeSiteFont } from '../fonts'

describe('activeSiteFont', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()

  beforeEach(async () => {
    // Clear any previously loaded fonts
    googleFontsUtility.reset()
    // Clear any previously added link elements
    document.head.innerHTML = ''
  })

  afterEach(() => {
    // Clean up after each test
    googleFontsUtility.reset()
    document.head.innerHTML = ''
  })

  it('should correctly handle default font config', async () => {
    const fontConfig = activeSiteFont(site)
    const result = fontConfig.value

    expect(result.fontsUrl).toMatchInlineSnapshot(`"https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Lora:wght@300;400;500;600;700;800;900&family=Caveat:wght@300;400;500;600;700;800;900&display=swap"`)

    expect(result.fontsUrl).toContain('https://fonts.googleapis.com/css2?family=')
    expect(result.fontsUrl).toContain('DM+Mono')
    expect(result.fontsUrl).toContain('Caveat')

    expect(Object.keys(result.stacks).sort()).toEqual(
      ['body', 'highlight', 'input', 'mono', 'sans', 'serif', 'title', 'entry'].sort(),
    )
  })

  it('should correctly handle user-provided font config', async () => {
    site.userFonts.value = {
      test: { family: 'Space+Mono', stack: 'sans' },
    }

    const fontConfig = activeSiteFont(site)
    const result = fontConfig.value

    expect(result.stacks.test).toContain('Space+Mono')
    expect(result.fontsUrl).toContain('Space+Mono')
  })

  it('should deduplicate font keys', async () => {
    site.userFonts.value = {
      test1: { family: 'Space+Mono', stack: 'sans' },
      test2: { family: 'Space+Mono', stack: 'sans' },
    }

    const fontConfig = activeSiteFont(site)
    expect(fontConfig.value.stacks).toMatchInlineSnapshot(`
      {
        "body": "'Lora', Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "entry": "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "highlight": "'Caveat', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "input": "'DM Mono', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "mono": "'DM Mono', 'Nimbus Mono PS', 'Courier New', monospace",
        "sans": "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "serif": "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "test1": "'Space+Mono', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "test2": "'Space+Mono', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "title": "'Poppins', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
      }
    `)

    expect(fontConfig.value.fontsUrl).toContain('Space+Mono')
  })

  it('should handle fonts with spaces in their names', async () => {
    site.userFonts.value = {
      test: { family: 'Space Mono', stack: 'sans' },
    }

    const fontConfig = activeSiteFont(site)
    const result = fontConfig.value

    expect(result.stacks.test).toContain('Space Mono')
    expect(result.fontsUrl).toContain('Space+Mono')
  })
})
