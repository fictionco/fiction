import { Col, type ColType, FictionDbTable, standardTable } from '@fiction/core'
import type { Card, CardConfigPortable } from '@fiction/site'
import { z } from 'zod'

export const t = { ...standardTable, form: 'fiction_form', submission: 'fiction_form_submission' }

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

export const CardAlignmentSchema = z.enum(['left', 'center', 'right'])
export type CardAlignmentMode = z.infer<typeof CardAlignmentSchema>
export const CardLayoutSchema = z.enum(['background', 'left', 'right', 'hero', 'heroLeft', 'heroRight'])
export type CardLayoutMode = z.infer<typeof CardLayoutSchema>

export const FormModeSchema = z.enum(['standard', 'designer', 'editable', 'coding'])
export type FormMode = z.infer<typeof FormModeSchema>

export type FormConfigPortable = Partial<ColType<typeof formConfigCols>>

export type FormConfig = Omit<FormConfigPortable, 'card'> & { card: Card, formMode?: FormMode }

export const FormUserConfigSchema = z.object({
  notifyEmails: z.array(z.string().email()).optional(),
})

export type FormUserConfig = z.infer<typeof FormUserConfigSchema>

export const formConfigCols = [
  new Col({ key: 'formId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('form')`)).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col }) => s.string(col.k).notNullable().index() }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'description', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.text(col.k).defaultTo('') }),
  new Col({ key: 'userConfig', sec: 'setting', sch: () => FormUserConfigSchema, make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'card', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<CardConfigPortable<FormUserConfig>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo([]) }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.enum(['draft', 'published', 'archived']), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('draft') }),
] as const

export const formSubmissionCols = [
  new Col({ key: 'submissionId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col, db }) => s.string(col.k).primary().defaultTo(db.raw(`object_id('submission')`)).index() }),
  new Col({ key: 'orgId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k, 50).references(`fiction_org.org_id`).onUpdate('CASCADE').notNullable().index() }),
  new Col({ key: 'formId', sec: 'permanent', sch: () => z.string().min(1), make: ({ s, col }) => s.string(col.k).index() }),
  new Col({ key: 'formTemplateId', sec: 'permanent', sch: () => z.string(), make: ({ s, col }) => s.string(col.k).index() }),
  new Col({ key: 'status', sec: 'setting', sch: () => z.enum(['unread', 'reviewed', 'archived']), make: ({ s, col }) => s.string(col.k).notNullable().defaultTo('draft') }),
  new Col({ key: 'title', sec: 'setting', sch: () => z.string(), make: ({ s, col }) => s.string(col.k) }),
  new Col({ key: 'card', sec: 'setting', sch: () => z.record(z.unknown()) as z.Schema<CardConfigPortable<FormUserConfig>>, make: ({ s, col }) => s.jsonb(col.k).defaultTo([]) }),
  new Col({ key: 'userValues', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'ip', sec: 'permanent', sch: () => z.string().ip().nullable(), make: ({ s, col }) => s.string(col.k).nullable() }),
  new Col({ key: 'meta', sec: 'setting', sch: () => z.record(z.unknown()), make: ({ s, col }) => s.jsonb(col.k).defaultTo({}) }),
  new Col({ key: 'submittedAt', sec: 'permanent', sch: () => z.string(), make: ({ s, col, db }) => s.string(col.k).defaultTo(db.fn.now()).notNullable() }),
  new Col({ key: 'completedAt', sec: 'setting', sch: () => z.string().nullable(), make: ({ s, col }) => s.string(col.k).nullable() }),
] as const

export type FormSubmissionConfig = Partial<ColType<typeof formSubmissionCols>>

export const tables = [
  new FictionDbTable({ tableKey: t.form, timestamps: true, cols: formConfigCols }),
  new FictionDbTable({ tableKey: t.submission, timestamps: true, cols: formSubmissionCols }),
]
