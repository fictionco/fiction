import { mapTypeHelper } from '../helpers'

export const map = mapTypeHelper({
  dimensionTable: {
    title: 'Table',
    description: 'A table for aggregated data',
    queryFormat: 'dimensionTable',
    rowSpan: 5,
    colSpan: 12,
    ui: 'DataTable',
  },
  dimensionChart: {
    title: 'Chart',
    description: 'A time series chart for a tracking dimension',
    queryFormat: 'dimensionChart',
    rowSpan: 1,
    colSpan: 12,
    ui: 'TimeChart',
  },
})
