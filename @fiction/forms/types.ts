export type FormInputValue = string | number | boolean | string[] | undefined

export type FormInputValueFormat = 'text' | 'number' | 'none' | 'select' | 'ranking' | 'date'

export interface SubmissionValue {
  cardId: string
  heading: string
  data: string | number | boolean | string[]
  timeToAnswer: number
  revised: boolean
  failedValidation: number
}

export type SubmissionData = Record<string, SubmissionValue>
