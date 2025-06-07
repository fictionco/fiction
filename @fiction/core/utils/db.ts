import type { Knex } from 'knex'
import type { ComplexDataFilter, DataFilter } from '../types'

export function dbMergeJsonData(args: { db: Knex, column: string, mergeData: object }) {
  const { db, column, mergeData } = args
  return db.raw(`COALESCE(??, '{}') || ?`, [column, JSON.stringify(mergeData)])
}

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
    case 'in': {
      const values = Array.isArray(value) ? value : [value]
      return query.whereRaw('?? && ?', [field, values]) // Using && overlap operator
    }
    case 'not in': {
      const values = Array.isArray(value) ? value : [value]
      return query.whereRaw('NOT (?? && ?)', [field, values])
    }
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
