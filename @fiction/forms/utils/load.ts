import { deepMerge } from '@fiction/core'
import type { Site } from '@fiction/site'
import { Form } from '../form'
import { getFormTemplates } from '../formTemplates'
import { getCardTemplates } from '../templates'
import type { FictionForms } from '..'
import type { FormConfigPortable } from '../schema'

export async function loadForm(args: { config: FormConfigPortable, site: Site, fictionForms: FictionForms }): Promise<Form> {
  const { config, site, fictionForms } = args

  const { formId, formTemplateId } = config

  const orgId = site.settings.orgId

  if (!orgId)
    throw new Error('missing orgId for form')

  let f: FormConfigPortable | undefined = undefined
  if (formTemplateId) {
    const formTemplates = await getFormTemplates({ site })
    const formTemplate = formTemplates.find(t => t.settings.formTemplateId === formTemplateId)

    if (!formTemplate)
      throw new Error(`Form template not found: ${formTemplateId}`)

    f = await formTemplate.toFormConfig({ site })
  }

  if (!f) {
    throw new Error(`Form config not found: ${formId || formTemplateId}`)
  }

  const formConfig = deepMerge<FormConfigPortable>([{ formId: formId || `static-${formTemplateId}`, ...f }, config])

  const templates = await getCardTemplates()
  return new Form({ fictionForms, orgId, templates, site, ...formConfig })
}
