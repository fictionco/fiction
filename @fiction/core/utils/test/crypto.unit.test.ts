import { sha256 } from 'js-sha256'
import { expect, it } from 'vitest'

// Example usage and expected hash values for testing
const testCases = [
  { input: 'example message', expected: 'ad84cd0b10fc028738971b078124aec2a0e7c6d986a381be0b386f32bee887af' },
  { input: 'hello', expected: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824' },
  { input: '123456', expected: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' },
]

it('sha256 function should generate correct SHA-256 hashes', async () => {
  for (const { input, expected } of testCases) {
    const result = sha256(input)
    expect(result).toBe(expected)
  }
})

it('sha256 function should handle empty string', async () => {
  const result = sha256('')
  expect(result).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
})
