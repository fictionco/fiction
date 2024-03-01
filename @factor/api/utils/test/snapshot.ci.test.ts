import { describe, expect, it } from 'vitest'

import { snapshotHtml } from '../snapshot'

// Adjust the import path according to your file structure

describe('formatHtml function', () => {
  it('should hide specific tags', async () => {
    const html = `<div><span>Visible Content</span><script>Hidden Content</script></div>`
    const options = { hideTags: ['script'] }
    const result = await snapshotHtml(html, options)
    expect(result).not.toContain('Hidden Content')
    expect(result).toContain('[HIDDEN_SCRIPT]')
    expect(result).toContain('<span>Visible Content</span>')
  })

  it('should mask IDs correctly', async () => {
    const html = `<div id="user123">Content</div>`
    const options = { maskIds: true }
    const result = await snapshotHtml(html, options)
    expect(result).toContain('id="user***"')
  })

  it('should hide tags and mask IDs together', async () => {
    const html = `<div><span id="item123">Visible Content</span><script>Hidden Content</script></div>`
    const options = { hideTags: ['script'], maskIds: true }
    const result = await snapshotHtml(html, options)
    expect(result).not.toContain('Hidden Content')
    expect(result).toContain('[HIDDEN_SCRIPT]')
    expect(result).toContain('<span id="item***">Visible Content</span>')
  })

  it('should handle single quotes in attributes correctly', async () => {
    const html = `<div style='background-image: url("https://example.com/image.png");'>Content</div>`
    const options = {}
    const result = await snapshotHtml(html, options)
    expect(result).toMatchInlineSnapshot(`
      "<div style="background-image: url(&quot;https://example.com/image.png&quot;)">Content</div>
      "
    `)
    expect(result).toMatchInlineSnapshot(`
      "<div style="background-image: url(&quot;https://example.com/image.png&quot;)">Content</div>
      "
    `)
  })

  it('should handle double quotes in attributes correctly, even with masked IDs', async () => {
    const html = `<div id="user123" style="background-image: url('https://example.com/user123/image.png');">Content</div>`
    const options = { maskIds: true }
    const result = await snapshotHtml(html, options)
    expect(result).toContain('id="user***"')

    expect(result).toMatchInlineSnapshot(`
      "<div id="user***" style="background-image: url(&quot;https://example.com/user123/image.png&quot;)">Content</div>
      "
    `)
  })
})
