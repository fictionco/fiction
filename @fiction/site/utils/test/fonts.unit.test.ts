import { describe, expect, it } from 'vitest'
import { createSiteTestUtils } from '../../test/testUtils'
import { activeSiteFont } from '../fonts'

describe('getThemeFontConfig', async () => {
  const testUtils = await createSiteTestUtils()
  const site = await testUtils.createSite()
  it('should correctly handle default font config', async () => {
    const result = activeSiteFont(site)

    expect(result.value.fontsUrl).toContain('https://fonts.googleapis.com/css2?family=')
    expect(Object.keys(result.value.stacks).sort()).toEqual(
      ['body', 'highlight', 'input', 'mono', 'sans', 'serif', 'title'].sort(),
    )
  })

  it('should correctly handle user-provided font config', async () => {
    site.userFonts.value = {
      test: { fontKey: 'Comic Sans MS', stack: 'sans' },
    }

    const result = activeSiteFont(site)

    expect(result.value.stacks.test).toContain('Comic Sans MS')
  })
})
