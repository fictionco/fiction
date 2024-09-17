import type { Knex } from 'knex'
import type { ComplexDataFilter, DataFilter } from '../types'

function applyDataFilter(query: Knex.QueryBuilder, filter: DataFilter): Knex.QueryBuilder {
  const { field, operator, value } = filter

  switch (operator) {
    case '=':
    case '!=':
    case '>':
    case '<':
    case '>=':
    case '<=':
      return query.where(field, operator, value)
    case 'like':
    case 'not like':
      return query.where(field, operator, `%${value}%`)
    case 'in':
      return query.whereIn(field, Array.isArray(value) ? value : [value])
    case 'not in':
      return query.whereNotIn(field, Array.isArray(value) ? value : [value])
    default:
      throw new Error(`Unsupported operator: ${operator}`)
  }
}

export function applyComplexFilters(query: Knex.QueryBuilder, filters: ComplexDataFilter[]): Knex.QueryBuilder {
  if (filters.length === 0) {
    return query
  }

  return query.where(function () {
    filters.forEach((andFilters, index) => {
      const method = index === 0 ? 'where' : 'orWhere'
      this[method](function () {
        andFilters.forEach((filter) => {
          applyDataFilter(this, filter)
        })
      })
    })
  })
}
