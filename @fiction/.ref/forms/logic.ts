import type { ListItem } from '@fiction/core'
import type { FormInputValue, FormInputValueFormat } from './schema.js'

export type LogicOperator =
  | '#'
  | '=='
  | '!='
  | '<>'
  | '><'
  | '>'
  | '>='
  | '<'
  | '<='

export interface LogicStep {
  stepId?: string
  operator?: LogicOperator
  valueKey?: string
  value?: string | number
  skipTo?: string | 'end'
}

export function getAvailableOperatorList(format: FormInputValueFormat): ListItem[] {
  const list: { name: string, value: LogicOperator }[] = [
    { name: 'Is Submitted', value: '#' },
  ]

  if (format === 'number' || format === 'select') {
    list.push(
      { name: 'is equal to', value: '==' },
      { name: 'is not equal to', value: '!=' },
    )
  }

  if (format === 'select') {
    list.push(
      { name: 'contains', value: '<>' },
      { name: 'does not contain', value: '><' },
    )
  }
  else if (format === 'number') {
    list.push(
      { name: 'is greater than', value: '>' },
      { name: 'is less than', value: '<' },
      { name: 'is greater than or equal to', value: '>=' },
      { name: 'is less than or equal to', value: '<=' },
    )
  }

  return list
}

export function getLogicResult(args: {
  logic?: LogicStep[]
  value?: FormInputValue
}): string | undefined {
  const { logic, value } = args

  if (!logic || !value)
    return

  let skipTo: string | undefined
  logic.every((l) => {
    if (!l.value || !l.operator)
      return false

    const v
      = Array.isArray(value) && l.valueKey
        ? value.findIndex(val => l.valueKey === val)
        : value

    if (
      (l.operator === '==' && v === l.value)
      || (l.operator === '!=' && v !== l.value)
      || (l.operator === '>' && v > l.value)
      || (l.operator === '>=' && v >= l.value)
      || (l.operator === '<' && v < l.value)
      || (l.operator === '<=' && v <= l.value)
      || (l.operator === '<>'
        && (typeof v === 'string' || Array.isArray(v))
        && v.includes(String(l.value)))
      || (l.operator === '><'
        && (typeof v === 'string' || Array.isArray(v))
        && !v.includes(String(l.value)))
    ) {
      skipTo = l.skipTo
      return false
    }

    return true
  })

  return skipTo
}
