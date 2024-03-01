import { mapTypeHelper } from '../helpers'

function validateParams(_: Record<string, any>): boolean {
  return _.id
}

export const map = mapTypeHelper({
  expPrimary: {
    title: 'Primary Goal Conversion Rate',
    description: 'Primary goal conversion for each variant in an experiment',
    ui: 'WidgetResults',
    queryFormat: 'variantResults',
    rowSpan: 2,
    colSpan: 12,
    options: { goalIndex: 0 },
    validateParams,
    pro: true,
  },
  expSecondary: {
    title: 'Secondary Goal Conversion Rate',
    description: 'Secondary goal conversion for each variant in an experiment',
    ui: 'WidgetResults',
    queryFormat: 'variantResults',
    rowSpan: 2,
    colSpan: 12,
    options: { goalIndex: 1 },
    validateParams,
    pro: true,
  },
  expPrimaryTable: {
    title: 'Primary Goal Performance',
    description: 'Primary goal variant performance',
    ui: 'ResultsTable',
    queryFormat: 'variantTable',
    rowSpan: 2,
    colSpan: 12,
    options: { goalIndex: 0 },
    validateParams,
    pro: true,
  },
  expSecondaryTable: {
    title: 'Secondary Goal Performance',
    description: 'Secondary goal variant performance',
    ui: 'ResultsTable',
    queryFormat: 'variantTable',
    rowSpan: 2,
    colSpan: 12,
    options: { goalIndex: 1 },
    validateParams,
    pro: true,
  },
})
