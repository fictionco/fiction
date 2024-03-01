/* eslint-disable @typescript-eslint/no-use-before-define */
import type {
  EndpointMeta,
  EndpointResponse,
  FactorDb,
  FactorUser,
  IndexMeta,
} from '@factor/api'
import {
  Query,
} from '@factor/api'
import type { KaptionCache } from '../plugin-cache'
import type { FormConfig, FormConfigData } from './form'
import { templates } from './form'

interface FormQuerySettings {
  factorUser?: FactorUser
  factorDb: FactorDb
  kaptionCache: KaptionCache
}

export abstract class QueryForms extends Query<FormQuerySettings> {
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  kaptionCache = this.settings.kaptionCache
  tbl = 'kaption_form'
  constructor(settings: FormQuerySettings) {
    super(settings)
  }
}

interface BulkEditParams {
  projectId: string
  _action?: 'delete'
  selectedIds?: string[]
}

export class QueryBulkEdit extends QueryForms {
  async run(
    params: BulkEditParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<number>> {
    const { projectId, _action = 'delete', selectedIds = [] } = params
    if (!meta.bearer)
      throw this.stop('login reuired')

    const db = this.factorDb.client()
    let message = ''
    let data = 0

    if (_action === 'delete' && selectedIds.length) {
      data = await db
        .delete()
        .table(this.tbl)
        .whereIn('formId', selectedIds)
        .where({ projectId })

      message = `${data} deleted`
    }

    return { status: 'success', data, message }
  }
}

type FormListParams = {
  projectId: string
  _action?: 'list' | 'delete'
  selectedIds?: string[]
} & IndexMeta

export class QueryFormsIndex extends QueryForms {
  async run(
    params: FormListParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<FormConfig[]>> {
    const {
      projectId,
      _action = 'list',
      limit = 20,
      offset = 0,
      selectedIds = [],
    } = params
    if (!meta.bearer)
      throw this.stop('login reuired')
    if (!projectId)
      throw this.stop('projectId required')

    const db = this.factorDb.client()
    let message = ''

    if (_action === 'delete' && selectedIds.length) {
      const num = await db
        .delete()
        .table(this.tbl)
        .whereIn('formId', selectedIds)

      message = `${num} deleted`
    }

    const forms = await db
      .select('*')
      .from(this.tbl)
      .where({ projectId })
      .limit(limit)
      .offset(offset)
      .orderBy('updatedAt', 'desc')

    const r = await db
      .count<{ count: string }>('*')
      .from(this.tbl)
      .where({ projectId })
      .first()

    const count = +(r?.count || 0)

    return {
      status: 'success',
      data: forms,
      indexMeta: { count, limit, offset },
      message,
    }
  }
}

export class FindOneForm extends QueryForms {
  async run(
    params: { formId: string },
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<FormConfig>> {
    const { formId } = params

    if (!formId)
      throw this.stop('formId required')

    const db = this.factorDb.client()

    const r = await db
      .table(this.tbl)
      .select('*')
      .where({ formId })
      .first<FormConfig>()

    if (!r) {
      throw this.stop({
        message: `form not found`,
        httpStatus: 301,
        location: 'https://www.kaption.co',
      })
    }

    return { status: 'success', data: r }
  }
}

interface ManageFormParams {
  _action: 'create' | 'retrieve' | 'update' | 'delete'
  projectId?: string
  form: FormConfig
}
export class QueryManageForms extends QueryForms {
  prepFields(
    _type: 'settings',
    config: Partial<FormConfig>,
    _meta?: EndpointMeta,
  ): Partial<FormConfig> {
    if (!this.factorDb)
      throw this.stop('no db')

    const cols = this.factorDb.getColumns(this.tbl)

    const out: Record<string, unknown> = {}

    cols?.forEach((col) => {
      const k = col.key as keyof FormConfig
      const val = config[k]
      if (col.isSetting && val !== undefined)
        out[k] = val
    })

    return out
  }

  async run(
    params: ManageFormParams,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<FormConfig>> {
    if (!params._action)
      throw this.stop('_action required')

    const { _action, projectId, form } = params

    let { formId } = form

    if (_action !== 'create' && !formId)
      throw this.stop({ message: 'formId required' })
    else
      formId = formId || this.utils.objectId()

    const db = this.factorDb.client()

    let formResponse: FormConfig | undefined
    let message: string | undefined

    let templateData: FormConfig | undefined

    // when creating, lookup templateId and get associated baseline form
    if (_action === 'create' && form.templateId) {
      const t = templates.find(
        template => template.templateId.value === form.templateId,
      )

      templateData = t?.toConfig()
    }

    const formData: FormConfig = this.prepFields(
      'settings',
      this.utils.deepMerge([templateData, form]),
      meta,
    )

    const formattedFormData: FormConfigData = {
      ...formData,
      updatedAt: this.utils.dayjs().toISOString(),
      userConfig: formData.userConfig
        ? JSON.stringify(formData.userConfig)
        : undefined,
    }

    this.log.info('formData', {
      data: { templateData, formData, formattedFormData },
    })

    if (_action === 'create') {
      if (!meta.bearer)
        throw this.stop('login required')
      if (!params.projectId)
        throw this.stop('projectId required')
      ;[formResponse] = await db
        .insert({
          ...formattedFormData,
          projectId: params.projectId,
          createdByUserId: meta.bearer.userId,
        })
        .into(this.tbl)
        .returning<FormConfig[]>('*')

      message = 'form created'
    }
    else if (_action === 'update') {
      if (!meta.bearer)
        throw this.stop('login required')
      if (!params.projectId)
        throw this.stop('projectId required')
      ;[formResponse] = await db
        .update(formattedFormData)
        .table(this.tbl)
        .where({ projectId, formId })
        .returning<FormConfig[]>('*')
      message = 'form updated'
    }
    else if (_action === 'delete') {
      if (!meta.bearer)
        throw this.stop('login required')
      if (!params.projectId)
        throw this.stop('projectId required')
      ;[formResponse] = await db
        .delete()
        .from(this.tbl)
        .where({ formId })
        .limit(1)
        .returning<FormConfig[]>('*')
      message = 'form deleted'
    }
    else if (_action === 'retrieve') {
      if (!formId)
        throw this.stop('formId required')

      const r = await db
        .table(this.tbl)
        .select('*')
        .where({ formId })
        .first<FormConfig>()

      formResponse = r
    }

    return { status: 'success', data: formResponse, message, params }
  }
}
