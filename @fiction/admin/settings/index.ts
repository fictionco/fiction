import type { Organization } from '@fiction/core'
import { vue } from '@fiction/core'
import { OrgSchema as schema } from '@fiction/core/plugin-user/schema'
import { createOption } from '@fiction/ui'

export function getOrgSettings(args: { org?: Organization }) {
  const { org } = args

  return {
    essentials: createOption({
      schema,
      label: 'Essentials',
      key: 'group.essentials',
      input: 'group',
      icon: { class: 'i-tabler-north-star' },
      options: [
        createOption({
          schema,
          key: 'name',
          label: 'Name',
          input: 'InputText',
          placeholder: 'Enter a name',
          isRequired: true,
          description: 'A concise name defining your identity, displayed prominently on your profile.',
        }),
        createOption({
          schema,
          key: 'email',
          label: 'Email',
          input: 'InputEmail',
          isRequired: true,
          description: 'A primary contact email for communication and account verification.',
        }),
        createOption({
          key: 'handle',
          label: 'Handle',
          input: 'InputHandle',
          placeholder: 'my-handle',
          props: { table: 'fiction_org', columns: [{ name: 'handle' }] },
          description: 'A unique identifier for your profile, used in URLs and mentions.',
        }),
        createOption({
          schema,
          key: 'profile.headline',
          label: 'Headline',
          input: 'InputUrl',
          isRequired: true,
          placeholder: 'Enter a headline',
        }),
        createOption({
          schema,
          key: 'profile.summary',
          label: 'About / Summary',
          input: 'InputTextarea',
          isRequired: true,
          placeholder: 'Enter a description',
        }),
        createOption({
          schema,
          key: 'avatar',
          label: 'Avatar',
          input: 'InputMedia',
        }),
        createOption({
          schema,
          key: 'branding.logo',
          label: 'Logo',
          subLabel: 'For visual identity',
          input: 'InputMedia',
        }),
        createOption({
          schema,
          key: 'branding.primaryColor',
          label: 'Primary Color',
          input: 'InputColorTheme',
          placeholder: 'Default',
          props: {
            mode: 'bright',
          },
        }),
      ],
    }),
    domain: createOption({
      schema,
      key: 'group.domain',
      label: 'Domain',
      input: 'group',
      icon: { class: 'i-tabler-world-upload' },
      options: [
        createOption({
          schema,
          key: 'handle',
          label: 'Fiction Domain',
          input: 'InputHandle',
          isRequired: true,
          props: {
            beforeInput: 'https://',
            afterInput: '.fiction.com',
            table: 'fiction_org',
            columns: [{ name: 'handle' }],
            uiSize: 'md',
          },
        }),
        createOption({
          key: 'customDomains',
          label: 'Enter Custom Domain',
          description: 'Add your custom domain, you\'ll need to set up DNS records for it to work.',
          input: vue.defineAsyncComponent(() => import('./CustomDomain.vue')),
          isRequired: true,
        }),
        createOption({
          key: 'domainSetupInstructions',
          label: 'Setup Instructions',
          input: vue.defineAsyncComponent(() => import('./CustomDomainInstructions.vue')),
          props: {
            destination: `https://${org?.handle}.fictionsites.com`,
          },
        }),

      ],
    }),
    social: createOption({
      key: 'group.social',
      label: 'Social',
      input: 'group',
      icon: { class: 'i-tabler-social' },
      options: [
        createOption({ schema, key: 'accounts.x.handle', label: 'X / Twitter Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.instagram.handle', label: 'Instagram Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.linkedin.handle', label: 'LinkedIn Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.facebook.handle', label: 'Facebook Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.github.handle', label: 'GitHub Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.youtube.handle', label: 'YouTube Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.pinterest.handle', label: 'Pinterest Username', input: 'InputText', placeholder: 'username' }),
        createOption({ schema, key: 'accounts.tiktok.handle', label: 'TikTok Username', input: 'InputText', placeholder: 'username' }),
      ],
    }),
  }
}
