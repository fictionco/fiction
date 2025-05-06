import type { Site } from '@fiction/site'
import type { FictionForms } from '..'
import type { FormConfigPortable } from '../schema'
import { deepMerge } from '@fiction/core'
import { Form } from '../form'
import { getFormTemplates } from '../formTemplates'
import { getFormCardTemplates } from '../templates'

export async function loadForm(args: { formConfig: FormConfigPortable, site: Site, fictionForms: FictionForms }): Promise<Form> {
  const { formConfig, site, fictionForms } = args

  const { formId, formTemplateId } = formConfig

  const orgId = site.settings.orgId

  if (!orgId)
    throw new Error('missing orgId for form')

  let f: FormConfigPortable | undefined = undefined
  if (formTemplateId) {
    const formTemplates = await getFormTemplates({ site, formConfig })
    const formTemplate = formTemplates.find(t => t.settings.formTemplateId === formTemplateId)

    if (!formTemplate)
      throw new Error(`Form template not found: ${formTemplateId}`)

    f = await formTemplate.toFormConfig({ site })
  }

  if (!f) {
    throw new Error(`Form config not found: ${formId || formTemplateId}`)
  }

  const fullFormConfig = deepMerge<FormConfigPortable>([{ formId: formId || `static-${formTemplateId}`, ...f }, formConfig])

  const templates = await getFormCardTemplates()
  return new Form({ fictionForms, orgId, templates, site, ...fullFormConfig })
}
