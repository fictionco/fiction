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

    expect(result.fontsUrl).toMatchInlineSnapshot(`"https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Caveat:ital,wght@0,400;0,500;0,600;0,700&display=swap"`)

    expect(result.fontsUrl).toContain('https://fonts.googleapis.com/css2?family=')
    expect(result.fontsUrl).toContain('DM+Mono')
    expect(result.fontsUrl).toContain('Poppins')
    expect(result.fontsUrl).toContain('Plus+Jakarta+Sans')
    expect(result.fontsUrl).toContain('Caveat')

    expect(Object.keys(result.stacks).sort()).toEqual(
      ['body', 'highlight', 'input', 'mono', 'sans', 'serif', 'title'].sort(),
    )
  })

  it('should correctly handle user-provided font config', async () => {
    site.userFonts.value = {
      test: { fontKey: 'Roboto', stack: 'sans' },
    }

    const fontConfig = activeSiteFont(site)
    const result = fontConfig.value

    expect(result.stacks.test).toContain('Roboto')
    expect(result.fontsUrl).toContain('Roboto')
  })

  it('should deduplicate font keys', async () => {
    site.userFonts.value = {
      test1: { fontKey: 'Roboto', stack: 'sans' },
      test2: { fontKey: 'Roboto', stack: 'sans' },
    }

    const fontConfig = activeSiteFont(site)
    expect(fontConfig.value.stacks).toMatchInlineSnapshot(`
      {
        "body": "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "highlight": "'Caveat', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "input": "'DM Mono', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "mono": "'DM Mono', 'Nimbus Mono PS', 'Courier New', monospace",
        "sans": "'Plus+Jakarta+Sans', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "serif": "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif",
        "test1": "'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "test2": "'Roboto', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
        "title": "'Poppins', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
      }
    `)

    expect(fontConfig.value.fontsUrl).toContain('Roboto')
  })

  it('should handle fonts with spaces in their names', async () => {
    site.userFonts.value = {
      test: { fontKey: 'Open Sans', stack: 'sans' },
    }

    const fontConfig = activeSiteFont(site)
    const result = fontConfig.value

    expect(result.stacks.test).toContain('Open Sans')
    expect(result.fontsUrl).toContain('Open+Sans')
  })
})
