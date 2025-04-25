import type { CardConfigPortable, Site } from '@fiction/site'
import type { FormConfigPortable } from './schema'
import { FictionObject } from '@fiction/core'
import { CardFactory } from '@fiction/site/cardFactory'
import { getFormCardTemplates } from './templates'

type FormTemplateConfig = FormConfigPortable & {
  formTemplateId: string
  getCardConfig: (args: { site: Site }) => Promise<CardConfigPortable>

}

export class FormTemplate extends FictionObject<FormTemplateConfig> {
  constructor(settings: FormTemplateConfig) {
    super('FormTemplate', settings)
  }

  async toFormConfig(args: { site: Site }): Promise<FormConfigPortable> {
    const { site } = args
    return {
      title: this.settings.title,
      card: await this.settings.getCardConfig({ site }),
    }
  }
}

export async function getFormTemplates(args: { site?: Site, formConfig: FormConfigPortable }) {
  const { site, formConfig } = args

  const { userConfig } = formConfig

  const confirmation = userConfig?.success || {
    title: 'Thank you!',
    subTitle: 'We\'ve received your message and will get back to you soon.',
  }

  const factory = new CardFactory({
    site,
    templates: await getFormCardTemplates(),
    caller: 'getFormTemplates',
  })
  return [
    new FormTemplate({
      formTemplateId: 'contact',
      title: 'Contact Form',
      getCardConfig: async () => {
        return {
          cards: [
            await factory.fromTemplate({
              templateId: 'formStart',
              userConfig: {
                title: 'Contact Form',
                subTitle: 'Need to reach us? Fill out the form below.',
                buttonText: 'Start',
              },
            }),
            await factory.fromTemplate({
              templateId: 'inputTextShort',
              userConfig: {
                key: 'name',
                title: `What's your name?`,
                subTitle: 'What should we call you?',
                placeholder: 'Name',
                required: true,
              },
            }),
            await factory.fromTemplate({
              templateId: 'inputEmail',
              userConfig: {
                key: 'email',
                title: 'What\'s your email address?',
                subTitle: 'We\'ll use this to get back to you.',
                placeholder: 'email@example.com',
                required: true,

              },
            }),
            await factory.fromTemplate({
              templateId: 'inputTextLong',
              userConfig: {
                key: 'message',
                title: 'How can we help you?',
                subTitle: 'Please provide details about your inquiry.',
                placeholder: 'Type your message here...',
                required: true,
              },
            }),
            await factory.fromTemplate({
              templateId: 'formEnd',
              userConfig: confirmation,
            }),
          ],
        }
      },
    }),
  ]
}
