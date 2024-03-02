import { describe, expect, it } from 'vitest'
import { objectId, shortId, uuid } from '../id'

describe('objectId', () => {
  it('should generate an ID with default prefix', () => {
    const id = objectId()
    expect(id).toMatch(/^id_/)
    expect(id.length).toBe(27)
  })

  it('should trim longer prefix to 3 characters', () => {
    const id = objectId({ prefix: 'longprefix' })
    expect(id.substring(0, 3)).toBe('lon')
  })

  it('should pad shorter prefix to 3 characters', () => {
    const id = objectId({ prefix: 'ab' })
    expect(id.substring(0, 3)).toBe('ab_')
  })

  it('should generate unique IDs', () => {
    const id1 = objectId()
    const id2 = objectId()
    expect(id1).not.toBe(id2)
  })
})

describe('uuid', () => {
  it('should generate a valid UUID format', () => {
    const id = uuid()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('should generate unique UUIDs', () => {
    const id1 = uuid()
    const id2 = uuid()
    expect(id1).not.toBe(id2)
  })
})

describe('shortId', () => {
  it('should generate an ID of specified length', () => {
    const length = 10
    const id = shortId({ len: length })
    expect(id.length).toBe(length)
  })

  it('should generate an ID only with lowercase letters by default', () => {
    const id = shortId({ len: 8, withNumbers: false })
    expect(id).toMatch(/^[a-z]+$/)
  })

  it('should include numbers when specified', () => {
    const id = shortId({ len: 8, withNumbers: true })
    expect(id).toMatch(/^[a-z0-9]+$/)
  })

  it('should generate unique IDs', () => {
    const id1 = shortId()
    const id2 = shortId()
    expect(id1).not.toBe(id2)
  })
})
