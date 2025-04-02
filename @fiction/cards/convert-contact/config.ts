import type { NavList, NavListItem } from '@fiction/core'
import type { StandardUserConfig } from '@fiction/site/schema'
import { ActionAreaSchema, NavListItemSchema, NavListSchema } from '@fiction/core'
import { FormUserConfigSchema } from '@fiction/forms'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

// Create contact item schema by picking fields from base nav item schema
export const ContactItemSchema = NavListItemSchema.pick({
  label: true,
  value: true,
  href: true,
  icon: true,
}).describe('Contact method details [@ai]')

const ContactGroupSchema = NavListSchema.pick({
  title: true,
  description: true,
}).extend({
  items: z.array(ContactItemSchema).optional(),
}).describe('Group of contact methods [@ai]')

// Main configuration schema
export const schema = z.object({
  layout: z.enum(['left', 'right', 'stacked']).optional().describe('Layout style - form position relative to contact details'),
  groups: z.array(ContactGroupSchema).optional().describe('Organized groups of contact information [@ai]'),
  action: ActionAreaSchema.optional().describe('actions and forms [@ai]'),
  form: FormUserConfigSchema.optional().describe('Form submission settings'),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

export function getOptions() {
  return [
    createOption({
      schema,
      key: 'layout',
      label: 'Layout',
      input: 'InputRadioButton',
      props: { uiSize: 'sm' },
      list: [
        { label: 'Form on Right', value: 'right' },
        { label: 'Form on Left', value: 'left' },
        { label: 'Stacked', value: 'stacked' },
      ],
    }),

    createOption({
      schema,
      key: 'groups',
      label: 'Contact Information',
      input: 'InputList',
      props: {
        itemName: 'Contact Group',
        itemLabel: args => (args?.item as NavList)?.title ?? 'Untitled',
      },
      options: [
        createOption({
          schema,
          key: 'groups.0.title',
          label: 'Group Title',
          input: 'InputText',
        }),
        createOption({
          schema,
          key: 'groups.0.description',
          label: 'Group Description',
          input: 'InputText',
        }),
        createOption({
          schema,
          key: 'groups.0.items',
          label: 'Contact Methods',
          input: 'InputList',
          props: {
            itemName: 'Contact Method',
            itemLabel: args => (args?.item as NavListItem)?.label ?? 'Untitled',
          },
          options: [
            createOption({
              schema,
              key: 'groups.0.items.0.label',
              label: 'Label',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'groups.0.items.0.value',
              label: 'Details',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'groups.0.items.0.href',
              label: 'Action Link',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'groups.0.items.0.icon',
              label: 'Icon',
              input: 'InputIcon',
            }),
          ],
        }),
      ],
    }),

    createOption({
      schema,
      key: 'action',
      label: 'Links / Social Media',
      input: 'InputActionArea',
    }),

    createOption({
      schema,
      key: 'form',
      label: 'Form Settings',
      input: 'group',
      options: [
        createOption({
          schema,
          key: 'form.notifyEmails',
          label: 'Notification Emails',
          input: 'InputList',
          props: {
            itemName: 'Email',
            itemLabel: args => (args?.item as { email: string })?.email ?? 'Untitled',
          },
          options: [
            createOption({
              schema,
              key: 'form.notifyEmails.0.email',
              label: 'Email Address',
              input: 'InputEmail',
            }),
          ],
        }),

        createOption({
          input: 'group',
          key: 'successGroup',
          label: 'Confirmation',
          isClosed: true,
          options: [
            createOption({
              schema,
              key: 'form.success.title',
              label: 'Title',
              input: 'InputText',
            }),
            createOption({
              schema,
              key: 'form.success.subTitle',
              label: 'Message',
              input: 'InputText',
            }),
          ],
        }),
        createOption({
          input: 'group',
          key: 'advancedGroup',
          label: 'Advanced Settings',
          isClosed: true,
          options: [
            createOption({
              schema,
              key: 'form.redirectUrl',
              label: 'Redirect URL',
              subLabel: '(Optional) URL to redirect to after form submission',
              input: 'InputSiteRoute',
            }),
          ],
        }),
      ],
    }),
  ]
}

function getDefaultConfig(): UserConfig {
  return {
    layout: 'right',
    groups: [
      {
        title: 'Contact Methods',
        items: [
          {
            label: 'Email',
            value: 'hello@example.com',
            href: 'mailto:hello@example.com',
            icon: { iconId: 'mail' },
          },
          {
            label: 'Phone',
            value: '+1 (555) 123-4567',
            href: 'tel:+15551234567',
            icon: { iconId: 'phone' },
          },
        ],
      },
      {
        title: 'Location',
        items: [
          {
            label: 'Office',
            value: '123 Business Ave, Suite 100, City, ST 12345',
            href: 'https://maps.google.com',
            icon: { iconId: 'map' },
          },
          {
            label: 'Hours',
            value: 'Mon-Fri: 9AM-5PM EST',
            icon: { iconId: 'clock' },
          },
        ],
      },
    ],
    action: {
      buttons: [
        {
          label: '@company at LinkedIn',
          href: 'https://linkedin.com/company',
          icon: { iconId: 'brand-linkedin' },
          theme: 'cyan',
        },
        {
          label: '@company at X',
          href: 'https://x.com/company',
          icon: { iconId: 'brand-x' },
          theme: 'blue',
        },
      ],
    },
    form: {
      notifyEmails: [{ email: 'notifications@example.com' }],
      success: {
        title: 'Message Sent',
        subTitle: 'Thanks for reaching out! We\'ll get back to you shortly.',
      },
    },
  }
}

function getSupportConfig(): UserConfig {
  return {
    layout: 'left',
    standard: { headers: {
      title: '24/7 Customer Support',
      subTitle: 'Our support team is here to help you succeed. Get in touch through any of these channels.',
    } },

    groups: [
      {
        title: 'Immediate Assistance',
        items: [
          {
            label: 'Live Chat',
            value: 'Available 24/7',
            href: '#chat',
            icon: { iconId: 'message' },

          },
          {
            label: 'Support Email',
            value: 'support@example.com',
            href: 'mailto:support@example.com',
            icon: { iconId: 'mail' },

          },
        ],
      },
      {
        title: 'Help Center',
        items: [
          {
            label: 'Knowledge Base',
            value: 'Browse FAQs and Tutorials',
            href: '/help',
            icon: { iconId: 'book' },
          },
          {
            label: 'Community Forum',
            value: 'Connect with other users',
            href: '/community',
            icon: { iconId: 'user' },
          },
        ],
      },
    ],
    action: {
      buttons: [
        {
          label: '@example at Discord',
          href: 'https://discord.gg/example',
          icon: { iconId: 'brand-discord' },
          theme: 'green',
          design: 'ghost',
        },
        {
          label: '@example at GitHub',
          href: 'https://github.com/example',
          icon: { iconId: 'brand-github' },
          theme: 'orange',
          design: 'ghost',
        },
      ],
    },
    form: {
      notifyEmails: [{ email: 'support@example.com' }],
      success: {
        title: 'Support ticket created!',
        subTitle: 'We\'ll respond within 24 hours.',
      },
    },
  }
}

function getEnterpriseConfig(): UserConfig {
  return {
    layout: 'stacked',

    standard: { headers: {
      title: 'Enterprise Sales',
      subTitle: 'Ready to scale? Our enterprise team is here to help you evaluate our enterprise plans and features.',
    } },
    groups: [
      {
        title: 'Sales Team',
        items: [
          {
            label: 'Schedule a Call',
            value: 'Book a consultation',
            href: '/schedule',
            icon: { iconId: 'calendar' },
          },
          {
            label: 'Enterprise Sales',
            value: 'enterprise@example.com',
            href: 'mailto:enterprise@example.com',
            icon: { iconId: 'briefcase' },
          },
        ],
      },
      {
        title: 'Resources',
        items: [
          {
            label: 'Case Studies',
            value: 'See customer success stories',
            href: '/case-studies',
            icon: { iconId: 'file' },
          },
          {
            label: 'Security',
            value: 'Review our security practices',
            href: '/security',
            icon: { iconId: 'shield' },
          },
        ],
      },
    ],
    action: {
      buttons: [
        {
          label: 'Follow us on LinkedIn',
          href: 'https://linkedin.com/company/example',
          icon: { iconId: 'brand-linkedin' },
        },
      ],
    },
    form: {
      notifyEmails: [{ email: 'enterprise@example.com' }],
      success: {
        title: 'Thanks for your interest!',
        subTitle: 'Our enterprise team will contact you within 1 business day.',
      },
    },
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    support: {
      templateId,
      userConfig: getSupportConfig(),
    },
    enterprise: {
      templateId,
      userConfig: getEnterpriseConfig(),
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
