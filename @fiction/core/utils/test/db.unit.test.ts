import type { Knex } from 'knex'
import type { ComplexDataFilter } from '../../types'
import { describe, expect, it, vi } from 'vitest'
import { applyComplexFilters } from '../db.js'

// Mock Knex query builder
function createMockQueryBuilder() {
  const mock: Partial<Knex.QueryBuilder> = {
    where: vi.fn().mockReturnThis(),
    orWhere: vi.fn().mockReturnThis(),
    whereIn: vi.fn().mockReturnThis(),
    whereNotIn: vi.fn().mockReturnThis(),
  }
  return mock as Knex.QueryBuilder
}

describe('applyComplexFilters', () => {
  it('should return the original query if filters are empty', () => {
    const query = createMockQueryBuilder()
    const result = applyComplexFilters(query, [])
    expect(result).toBe(query)
    expect(query.where).not.toHaveBeenCalled()
  })

  it('should apply a single filter correctly', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [[{ field: 'status', operator: '=', value: 'active' }]]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should apply multiple AND filters correctly', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [[
      { field: 'status', operator: '=', value: 'active' },
      { field: 'age', operator: '>', value: 18 },
    ]]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should apply OR filters correctly', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [
      [{ field: 'status', operator: '=', value: 'active' }],
      [{ field: 'status', operator: '=', value: 'pending' }],
    ]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should handle "in" operator correctly', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [[{ field: 'status', operator: 'in', value: ['active', 'pending'] }]]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should handle "not in" operator correctly', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [[{ field: 'status', operator: 'not in', value: ['inactive', 'deleted'] }]]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should handle "like" operator correctly', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [[{ field: 'name', operator: 'like', value: 'John' }]]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })

  it('should handle complex combinations of filters', () => {
    const query = createMockQueryBuilder()
    const filters: ComplexDataFilter[] = [
      [
        { field: 'status', operator: '=', value: 'active' },
        { field: 'age', operator: '>', value: 18 },
      ],
      [
        { field: 'type', operator: 'in', value: ['premium', 'gold'] },
        { field: 'last_login', operator: '>=', value: '2023-01-01' },
      ],
    ]

    applyComplexFilters(query, filters)

    expect(query.where).toHaveBeenCalledTimes(1)
    expect(query.where).toHaveBeenCalledWith(expect.any(Function))
  })
})
