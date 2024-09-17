import type { ComplexDataFilter, DataFilter, EndpointMeta, EndpointResponse, IndexQuery } from '@fiction/core'
import type { EmailResponse } from '@fiction/core/plugin-email/endpoint.js'
import type { CardConfigPortable } from '@fiction/site/tables.js'
import type { FictionForms, FormPluginSettings } from './index.js'
import type { FormConfigPortable, FormSubmissionConfig } from './schema.js'
import type { InputUserConfig } from './templates.js'
import { applyComplexFilters, isPlainObject, Query } from '@fiction/core'
import { t } from './schema.js'

type FormSubmissionSettings = {
  fictionForms: FictionForms
} & FormPluginSettings

abstract class FormQuery extends Query<FormSubmissionSettings> {
  db = () => this.settings.fictionDb.client()
  constructor(settings: FormSubmissionSettings) {
    super(settings)
  }
}

export type WhereSubmission = { formId?: string, formTemplateId?: string, orgId?: string, submissionId?: string } & ({ orgId: string, formTemplateId: string } | { formId: string } | { submissionId: string })

export type SubmissionCreate = { fields: Partial<FormSubmissionConfig> & FormConfigPortable }

export type ManageSubmissionRequest =
  | { _action: 'create', orgId: string } & SubmissionCreate
  | { _action: 'list', orgId: string, where?: FormSubmissionConfig, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: ComplexDataFilter[] }
  | { _action: 'update', orgId: string, where: WhereSubmission[], fields: Partial<FormSubmissionConfig> }
  | { _action: 'delete', orgId: string, where: WhereSubmission[] }

export type SubmissionParams = ManageSubmissionRequest & IndexQuery

export type ManageSubmissionResponse = EndpointResponse<FormSubmissionConfig[]>

export class QueryManageSubmission extends FormQuery {
  limit = 40
  offset = 0

  async run(params: SubmissionParams, meta: EndpointMeta): Promise<ManageSubmissionResponse> {
    const { _action } = params

    let r: ManageSubmissionResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'list':
        r = await this.listSubmissions(params, meta)
        break
      case 'update':
        r = await this.updateSubmission(params, meta)
        break
      case 'count':
        r = { status: 'success', data: [] } // added in indexMeta
        break
      case 'delete':
        r = await this.deleteSubmission(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: SubmissionParams, r: ManageSubmissionResponse, _meta?: EndpointMeta): Promise<ManageSubmissionResponse> {
    const { orgId } = params
    const { limit = this.limit, offset = this.offset, filters = [] } = params

    let baseQuery = this.db().table(t.submission).where({ orgId }).count().first<{ count: string }>()

    baseQuery = applyComplexFilters(baseQuery, filters)

    const { count } = await baseQuery

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    return r
  }

  private async create(params: SubmissionParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageSubmissionResponse> {
    const { orgId, fields } = params

    const { fictionDb } = this.settings

    const { formId, formTemplateId } = fields

    if (!formId && !formTemplateId) {
      return { status: 'error', message: 'formId or formTemplateId are required' }
    }

    const submissionFields: Partial<FormSubmissionConfig> = { orgId, ...fields, submittedAt: new Date().toISOString() }

    const insertData = fictionDb.prep({ type: 'insert', fields: submissionFields, meta, table: t.submission })

    if (!insertData.userValues && insertData.card?.cards) {
      insertData.userValues = Object.fromEntries(insertData.card.cards.map(c => [c.userConfig?.key, c.userConfig?.userValue]))
    }

    this.log.info('createSubmission', { data: insertData, caller: meta.caller })

    const result = await this.db().table(t.submission).insert(insertData).returning('*')

    await this.settings.fictionMonitor?.slackNotify({ message: '*New Form Submission*', data: result[0] })

    await this.sendUserEmailNotification(params, meta)

    return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
  }

  private async listSubmissions(params: SubmissionParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageSubmissionResponse> {
    const { where, orgId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const submissions = await this.db().select('*').from(t.submission).where({ orgId, ...where }).limit(limit).offset(offset).orderBy('submittedAt', 'desc')

    return { status: 'success', data: submissions }
  }

  private async updateSubmission(params: SubmissionParams & { _action: 'update' }, _meta: EndpointMeta): Promise<ManageSubmissionResponse> {
    const { where, fields, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, meta: _meta, table: t.submission })

    const results: FormSubmissionConfig[] = []
    for (const condition of where) {
      if (Object.values(condition).length !== 1) {
        return { status: 'error', message: 'one and only one where condition should be set' }
      }
      const updatedAt = new Date().toISOString()

      const result = await this.db().table(t.submission).where({ orgId, ...condition }).update({ ...prepped, updatedAt }).returning('*')
      results.push(...result)
    }

    return { status: 'success', data: results, indexMeta: { changedCount: results.length } }
  }

  private async deleteSubmission(params: SubmissionParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageSubmissionResponse> {
    const { where, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: FormSubmissionConfig[] = []
    for (const condition of where) {
      const result = await this.db().table(t.submission).where({ orgId, ...condition }).delete().returning('*')
      results.push(...result)
    }

    return { status: 'success', message: 'Submissions deleted', data: results, indexMeta: { changedCount: results.length } }
  }

  private async sendUserEmailNotification(params: SubmissionParams & { _action: 'create' }, meta: EndpointMeta): Promise<EndpointResponse<EmailResponse[]>> {
    const { orgId, fields } = params
    try {
      const { title, userConfig = {}, card } = fields

      const { notifyEmails } = userConfig
      // Retrieve organization details
      const r = await this.settings.fictionUser?.queries.ManageOrganization.serve({
        _action: 'retrieve',
        where: { orgId },
      }, { ...meta, server: true })

      if (r?.status !== 'success' || !r.data) {
        throw new Error('Failed to retrieve organization details')
      }

      const org = r.data

      const { orgName, orgEmail } = org

      const heading = `${orgName}: New ${title || 'Form'} Submission`

      const cards = (card?.cards || []) as CardConfigPortable<InputUserConfig>[]

      const formattedDetails = cards.filter(c => c.userConfig?.userValue).map((c) => {
        const uc = c.userConfig || {}

        const val = Array.isArray(uc.userValue) ? uc.userValue.join(', ') : isPlainObject(uc.userValue) ? JSON.stringify(uc.userValue) : uc.userValue as string

        return `- **${uc.title}**: ${val}`
      },
      ).join('\n')

      const bodyMarkdown = `${heading}:\n\n${formattedDetails}`

      if (!this.settings.fictionEmail) {
        throw new Error('No email service available')
      }

      // limit to 5 emails
      const emailList = notifyEmails?.slice(0, 5) || [{ email: orgEmail }]

      const emailPromises = emailList.map(async item => this.settings.fictionEmail.renderAndSendEmail({
        to: item.email,
        subject: heading,
        bodyMarkdown,
        heading,
        subHeading: `Details are below`,
        actions: [{ name: 'Fiction Dashboard', href: `${this.settings.fictionEnv.meta.app?.url}/app` }],
      }, { server: true }))

      const emails = await Promise.all(emailPromises)

      this.log.info('Email sent for new form submission', { data: { heading, bodyMarkdown } })

      const data = (emails.map(e => e.data).filter(Boolean)) as EmailResponse[]

      return { status: 'success', data }
    }
    catch (error) {
      this.log.error('Failed to send email notification for new form submission', { error, data: params })
      return { status: 'error', message: 'Failed to send email notification' }
    }
  }
}

export type WhereForm = { formId?: string, orgId?: string } & ({ orgId: string } | { formId: string })

export type FormCreate = { fields: Partial<FormConfigPortable> }

export type ManageFormRequest =
  | { _action: 'create', orgId: string } & FormCreate
  | { _action: 'list', orgId: string, where?: Partial<FormConfigPortable>, limit?: number, offset?: number, page?: number }
  | { _action: 'count', orgId: string, filters?: DataFilter[] }
  | { _action: 'update', orgId: string, where: WhereForm[], fields: Partial<FormConfigPortable> }
  | { _action: 'delete', orgId: string, where: WhereForm[] }

export type FormParams = ManageFormRequest & IndexQuery

export type ManageFormResponse = EndpointResponse<FormConfigPortable[]>

export class QueryManageForm extends FormQuery {
  limit = 40
  offset = 0

  async run(params: FormParams, meta: EndpointMeta): Promise<ManageFormResponse> {
    const { _action } = params

    let r: ManageFormResponse | undefined
    switch (_action) {
      case 'create':
        r = await this.create(params, meta)
        break
      case 'list':
        r = await this.listForms(params, meta)
        break
      case 'update':
        r = await this.updateForm(params, meta)
        break
      case 'count':
        r = { status: 'success', data: [] } // added in indexMeta
        break
      case 'delete':
        r = await this.deleteForm(params, meta)
        break
      default:
        r = { status: 'error', message: 'Invalid action' }
    }

    if (!r) {
      return { status: 'error', message: 'Invalid action' }
    }

    return this.addIndexMeta(params, r, meta)
  }

  private async addIndexMeta(params: FormParams, r: ManageFormResponse, _meta?: EndpointMeta): Promise<ManageFormResponse> {
    const { orgId } = params
    const { limit = this.limit, offset = this.offset, filters = [] } = params

    let baseQuery = this.db().table(t.form).where({ orgId }).count().first<{ count: string }>()

    baseQuery = applyComplexFilters(baseQuery, filters)

    const { count } = await baseQuery

    r.indexMeta = { limit, offset, count: +count, ...r.indexMeta }

    return r
  }

  private async create(params: FormParams & { _action: 'create' }, meta: EndpointMeta): Promise<ManageFormResponse> {
    const { orgId, fields } = params

    const { fictionDb } = this.settings

    const formFields: Partial<FormConfigPortable> = {
      orgId,
      ...fields,
      status: fields.status || 'draft',
    }

    const insertData = fictionDb.prep({ type: 'insert', fields: formFields, meta, table: t.form })

    this.log.info('createForm', { data: insertData, caller: meta.caller })

    const result = await this.db().table(t.form).insert(insertData).returning('*')

    await this.settings.fictionMonitor?.slackNotify({ message: '*New Form Created*', data: result[0] })

    return { status: 'success', data: result, indexMeta: { changedCount: 1 } }
  }

  private async listForms(params: FormParams & { _action: 'list' }, _meta: EndpointMeta): Promise<ManageFormResponse> {
    const { where, orgId } = params
    let { limit = this.limit, offset = this.offset, page } = params

    if (page && page > 0) {
      offset = (page - 1) * limit
    }

    const forms = await this.db().select('*').from(t.form).where({ orgId, ...where }).limit(limit).offset(offset).orderBy('createdAt', 'desc')

    return { status: 'success', data: forms }
  }

  private async updateForm(params: FormParams & { _action: 'update' }, _meta: EndpointMeta): Promise<ManageFormResponse> {
    const { where, fields, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const prepped = this.settings.fictionDb.prep({ type: 'update', fields, meta: _meta, table: t.form })

    const results: FormConfigPortable[] = []
    for (const condition of where) {
      if (Object.values(condition).length !== 1) {
        return { status: 'error', message: 'one and only one where condition should be set' }
      }
      const updatedAt = new Date().toISOString()

      const result = await this.db().table(t.form).where({ orgId, ...condition }).update({ ...prepped, updatedAt }).returning('*')
      results.push(...result)
    }

    return { status: 'success', data: results, indexMeta: { changedCount: results.length } }
  }

  private async deleteForm(params: FormParams & { _action: 'delete' }, _meta: EndpointMeta): Promise<ManageFormResponse> {
    const { where, orgId } = params

    if (!Array.isArray(where)) {
      return { status: 'error', message: 'where must be an array of conditions' }
    }

    const results: FormConfigPortable[] = []
    for (const condition of where) {
      const result = await this.db().table(t.form).where({ orgId, ...condition }).delete().returning('*')
      results.push(...result)
    }

    return { status: 'success', message: 'Forms deleted', data: results, indexMeta: { changedCount: results.length } }
  }
}
