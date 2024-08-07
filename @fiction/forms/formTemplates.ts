import { FictionObject } from '@fiction/core'
import type { CardConfigPortable, Site } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory'
import { getCardTemplates } from './templates'
import type { FormConfigPortable } from './schema'

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

export async function getFormTemplates(args: { site?: Site }) {
  const { site } = args

  const factory = new CardFactory({ site, templates: await getCardTemplates() })
  return [
    new FormTemplate({
      formTemplateId: 'contact',
      title: 'Contact Form',
      getCardConfig: async () => {
        return {
          cards: [
            await factory.create({
              templateId: 'formStart',
              userConfig: {
                title: 'Contact Form',
                subTitle: 'Need to reach us? Fill out the form below.',
                buttonText: 'Start',
              },
            }),
            await factory.create({
              templateId: 'inputTextShort',
              userConfig: {
                path: 'name',
                title: `What's your name?`,
                subTitle: 'What should we call you?',
                placeholder: 'Name',
                isRequired: true,
              },
            }),
            await factory.create({
              templateId: 'inputEmail',
              userConfig: {
                path: 'email',
                title: 'What\'s your email address?',
                subTitle: 'We\'ll use this to get back to you.',
                placeholder: 'email@example.com',
                isRequired: true,
              },
            }),
            await factory.create({
              templateId: 'inputTextLong',
              userConfig: {
                path: 'message',
                title: 'How can we help you?',
                subTitle: 'Please provide details about your inquiry.',
                placeholder: 'Type your message here...',
                isRequired: true,
              },
            }),
            await factory.create({
              templateId: 'formEnd',
              userConfig: {
                title: 'Thank you!',
                subTitle: 'We\'ve received your message and will get back to you soon.',
              },
            }),
          ],
        }
      },
    }),
  ]
}
