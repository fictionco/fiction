import { describe, expect, it } from 'vitest'

import { getButtonClasses } from '../utils'

// Describe block for getButtonClasses
describe('getButtonClasses', () => {
  // Test the isDisabled flag
  it('should include disabled classes when isDisabled is true', () => {
    const result = getButtonClasses({ btn: 'primary', size: 'md', format: 'block', isDisabled: true })
    expect(result).toContain('opacity-40 cursor-not-allowed')
  })

  // Test the useShadow flag
  it('should include shadow classes when useShadow is true', () => {
    const result = getButtonClasses({ btn: 'primary', size: 'md', format: 'block', useShadow: true })
    expect(result).toContain('shadow')
  })
})
