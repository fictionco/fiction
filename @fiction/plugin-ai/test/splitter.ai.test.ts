import { describe, expect, it } from 'vitest'

import { TextSplitter } from '../splitter'

// Adjust the import according to your file structure

describe('textSplitter', () => {
  it('should not split short content that is under the chunk size', async () => {
    const content = 'Short content'
    const splitter = new TextSplitter()
    const chunks = await splitter.splitText(content)
    expect(chunks).toEqual([content])
  })

  it('should split content on double newline for long content', async () => {
    const content = 'First paragraph\nSecond paragraph\n\nThird paragraph'
    const splitter = new TextSplitter({ chunkSize: 20, chunkOverlap: 5 })
    const chunks = await splitter.splitText(content)
    // Adjust expectations based on the actual behavior of your splitText method
    expect(chunks).toEqual(['First paragraph', 'Second paragraph', 'Third paragraph'])
  })

  it('should split content on newline if no double newlines exist', async () => {
    const content = 'First line\nSecond line\nThird line'
    const splitter = new TextSplitter({ chunkSize: 20, chunkOverlap: 5 })
    const chunks = await splitter.splitText(content)
    // Adjust expectations based on the actual behavior of your splitText method
    expect(chunks).toEqual(['First line', 'Second line', 'Third line'])
  })

  it('should handle content with length exactly equal to chunk size without splitting', async () => {
    const content = 'Exact length content.'
    const splitter = new TextSplitter({ chunkSize: content.length, chunkOverlap: 5 })
    const chunks = await splitter.splitText(content)
    expect(chunks).toEqual([content])
  })

  it('should properly handle the chunk overlap in split content', async () => {
    const content = 'Some longer content that will need to be split into chunks.'
    const splitter = new TextSplitter({ chunkSize: 20, chunkOverlap: 5 })

    const chunks = await splitter.splitText(content)
    expect(chunks).toMatchInlineSnapshot(`
      [
        "Some longer content",
        "that will need to be",
        "to be split into",
        "into chunks.",
      ]
    `)

    // Check if the end of each chunk overlaps with the start of the next chunk
    // for (let i = 0; i < chunks.length - 1; i++) {
    //   const endOfChunk = chunks[i].slice(-splitter.chunkOverlap)
    //   const startOfNextChunk = chunks[i + 1].slice(0, splitter.chunkOverlap)
    //   expect(endOfChunk).toEqual(startOfNextChunk)
    // }

    // The below check assumes the specific chunks based on the splitter logic
    expect(chunks).toEqual([
      'Some longer content',
      'that will need to be',
      'to be split into',
      'into chunks.',
    ])
  })
})
