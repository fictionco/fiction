import type { Site } from '@fiction/site'
import { getFormTemplates } from '../formTemplates'
import type { FormConfigPortable } from '../schema'
import { Form } from '../form'
import { getCardTemplates } from '../templates'
import type { FictionForms } from '..'

export async function loadForm(args: { formId?: string, formTemplateId?: string, site: Site, fictionForms: FictionForms }): Promise<Form> {
  const { formId, formTemplateId, site, fictionForms } = args

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

  const formConfig = { formId: formId || `static-${formTemplateId}`, ...f }

  const templates = await getCardTemplates()
  return new Form({ fictionForms, orgId, templates, site, ...formConfig })
}
