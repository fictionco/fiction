// @unocss-include

import type { OptionSetArgs, Refinement } from '@fiction/ui'
import { InputOption, OptionSet } from '@fiction/ui'
import InputAi from '@fiction/site/plugin-builder/InputAi.vue'

function standardOption(args?: OptionSetArgs) {
  return {
    heading: new InputOption({
      key: 'heading',
      label: 'Heading',
      input: 'InputTextarea',
      props: { maxHeight: 250 },
      default: () => 'Headline',
      schema: ({ z }) => z.string(),
    }),
    subHeading: new InputOption({
      key: 'subHeading',
      label: 'Sub Heading',
      input: 'InputTextarea',
      props: { maxHeight: 250 },
      default: () => 'Sub headline',
      schema: ({ z }) => z.string(),
    }),
    superHeading: new InputOption({
      key: 'superHeading',
      label: 'Super Heading',
      input: 'InputTextarea',
      props: { maxHeight: 250 },
      default: () => 'Super Headline',
      schema: ({ z }) => z.string().optional(),
    }),
    btnType: new InputOption({
      key: 'btn',
      label: 'Type',
      input: 'InputSelect',
      list: ['primary', 'default', 'theme', 'danger', 'caution', 'success', 'naked'],
    }),
  }
}

export const headerOptionSet = new OptionSet<{
  refine?: { heading?: Refinement, subHeading?: Refinement, superHeading?: Refinement }
}> ({
  basePath: 'userConfig',
  inputOptions(args) {
    const standard = standardOption(args)
    return [standard.heading, standard.subHeading, standard.superHeading]
  },
})

export const actionItemOptionSet = new OptionSet< {
  refine?: { group?: Refinement | { name?: Refinement, desc?: Refinement, href?: Refinement, target?: Refinement }, title?: Refinement }
}> ({
  basePath: 'userConfig',
  inputOptions: (args) => {
    const label = args?.label || 'Actions'
    const groupPath = args?.groupPath || 'actions'

    const listOptions = [
      new InputOption({
        key: 'name',
        label: 'Text',
        input: 'InputText',
      }),
      new InputOption({
        key: 'href',
        label: 'Link / Route',
        input: 'InputText',
      }),
      new InputOption({
        key: 'btn',
        label: 'Type',
        input: 'InputSelect',
        list: ['primary', 'default', 'theme', 'danger', 'caution', 'success'],
      }),
      new InputOption({
        key: 'size',
        label: 'Size',
        input: 'InputSelect',
        list: ['default', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'],
      }),
    ]

    const out = [
      new InputOption({
        aliasKey: 'group',
        key: `${groupPath}`,
        input: 'InputList',
        options: listOptions,
      }),
    ]

    return [new InputOption({ label, input: 'group', options: out, key: 'actionItemsGroup' })]
  },
})

export const navItemsOptionSet = new OptionSet<{
  refine?: { group?: Refinement<{ name?: Refinement, desc?: Refinement, href?: Refinement, target?: Refinement }>, title?: Refinement }
}> ({
  basePath: 'userConfig',
  defaultRefinement: { group: { refine: { name: true, href: true, target: true } } },
  inputOptions: (args) => {
    const label = args?.label || 'Nav'
    const groupPath = args?.groupPath || 'nav'
    const listOptions = [
      new InputOption({
        key: 'name',
        label: 'Text',
        input: 'InputText',
        schema: ({ z }) => z.string(),
      }),
      new InputOption({
        key: 'desc',
        label: 'Description',
        input: 'InputTextarea',
        schema: ({ z }) => z.string().optional(),
      }),
      new InputOption({
        key: 'href',
        label: 'Link / Route',
        input: 'InputText',
        schema: ({ z }) => z.string().refine((val) => {
          // Simple regex to allow relative paths and full URLs
          const pattern = /^(\/[^\s]*)|([a-z]+:\/\/[^\s]*)$/i
          return pattern.test(val)
        }),
      }),
      new InputOption({
        key: 'target',
        label: 'Target',
        input: 'InputSelect',
        list: [
          { name: 'Normal', value: '_self' },
          { name: 'New Window', value: '_blank' },
        ],
        schema: ({ z }) => z.enum(['_self', '_blank']).optional(),
      }),
    ]

    const out = [
      new InputOption({
        aliasKey: 'title',
        key: `${groupPath}Title`,
        label: `${label} Title`,
        input: 'InputText',
        schema: ({ z }) => z.string().optional(),
      }),
      new InputOption({
        aliasKey: 'group',
        key: `${groupPath}`,
        label,
        input: 'InputList',
        options: listOptions,
        schema: ({ z, subSchema }) => z.array(subSchema),
      }),
    ]

    return [new InputOption({ label, input: 'group', options: out, key: 'navItemsGroup' })]
  },
})

export const mediaItemsOptionSet = new OptionSet< {
  formats?: { url?: boolean, html?: boolean }
  refine?: { group?: Refinement<{ media?: Refinement, name?: Refinement, desc?: Refinement, href?: Refinement }> }
}> ({
  basePath: 'userConfig',
  inputOptions: (args) => {
    const label = args?.label || 'Media Items'
    const groupPath = args?.groupPath || 'mediaItems'

    // Define all possible options
    const options = [
      new InputOption({
        key: 'media',
        label: 'Image',
        input: 'InputMediaDisplay',
        props: { formats: args?.formats },
        schema: ({ z }) => z.object({ url: z.string(), format: z.enum(['url']) }),
      }),
      new InputOption({ key: 'name', label: 'Text', input: 'InputText' }),
      new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
      new InputOption({ key: 'href', label: 'Link / Route', input: 'InputText' }),
    ]

    return [
      new InputOption({
        aliasKey: 'group',
        key: `${groupPath}`,
        label,
        input: 'InputList',
        options,
        schema: ({ z, subSchema }) => z.array(subSchema),
        generation: { estimatedMs: 40000 },
      }),
    ]
  },
})

export const socialsOptionSet = new OptionSet< {
  refine?: { group?: Refinement<{ name?: Refinement, desc?: Refinement, icon?: Refinement, href?: Refinement, target?: Refinement }>, title?: Refinement }
}> ({
  basePath: 'userConfig',
  defaultRefinement: { group: { refine: { icon: true, href: true } } },
  inputOptions: (args) => {
    const label = args?.label || 'Socials'
    const groupPath = args?.groupPath || 'socials'

    const options = [
      new InputOption({
        key: 'name',
        label: 'Text',
        input: 'InputText',
        schema: ({ z }) => z.string().min(2).max(30),
      }),
      new InputOption({
        key: 'desc',
        label: 'Description',
        input: 'InputTextarea',
        schema: ({ z }) => z.string().min(2).max(100).optional(),
      }),
      new InputOption({
        key: 'icon',
        label: 'Icon',
        input: 'InputSelect',
        schema: ({ z }) => z.enum(['x', 'linkedin', 'facebook', 'instagram', 'youtube', 'github', 'email', 'phone', 'pinterest', 'snapchat', 'twitch', 'discord', 'slack', 'snapchat']),
        list: [
          { name: 'X', value: 'x' },
          { name: 'LinkedIn', value: 'linkedin' },
          { name: 'Facebook', value: 'facebook' },
          { name: 'Instagram', value: 'instagram' },
          { name: 'YouTube', value: 'youtube' },
          { name: 'GitHub', value: 'github' },
          { name: 'Email', value: 'email' },
          { name: 'Phone', value: 'phone' },
          { name: 'Pinterest', value: 'pinterest' },
          { name: 'Snapchat', value: 'snapchat' },
          { name: 'Twitch', value: 'twitch' },
          { name: 'Discord', value: 'discord' },
          { name: 'Slack', value: 'slack' },
          { name: 'Snapchat', value: 'snapchat' },
        ],
      }),
      new InputOption({
        key: 'href',
        label: 'Link / Route',
        input: 'InputText',
        schema: ({ z }) => z.string().refine(val => /^(\/[^\s]*)|([a-z]+:\/\/[^\s]*)$/i.test(val)),
      }),
      new InputOption({
        key: 'target',
        label: 'Target',
        input: 'InputSelect',
        schema: ({ z }) => z.enum(['_self', '_blank']).optional(),
        list: [
          { name: 'Normal', value: '_self' },
          { name: 'New Window', value: '_blank' },
        ],
      }),
    ]

    const out = [
      new InputOption({
        aliasKey: 'title',
        key: `${groupPath}Title`,
        label: `${label} Title`,
        input: 'InputText',
        schema: ({ z }) => z.string().optional(),
      }),
      new InputOption({
        aliasKey: 'group',
        key: `${groupPath}`,
        input: 'InputList',
        label,
        options,
        schema: ({ z, subSchema }) => z.array(subSchema),
      }),
    ]

    return [new InputOption({ label, input: 'group', options: out, key: 'socialsGroup' })]
  },
})

type QuoteFilterKeys = {
  text?: Refinement
  authorName?: Refinement
  authorTitle?: Refinement
  authorImage?: Refinement
  authorUrl?: Refinement
  orgName?: Refinement
  orgImage?: Refinement
  orgUrl?: Refinement
}

export const quoteOptionSet = new OptionSet<{ mode: 'single', refine?: QuoteFilterKeys } | { mode: 'multi', refine?: { group: Refinement<QuoteFilterKeys> } }>({
  basePath: 'userConfig',
  inputOptions: (args) => {
    const { mode } = args || {}
    const label = args?.label || (mode === 'single' ? 'Quote' : 'Quotes')
    const groupPath = args?.groupPath || 'quotes'

    const quoteOptions = () => {
      const options = [
        new InputOption({ key: 'text', label: 'Quote Text', input: 'InputText', schema: ({ z }) => z.string() }),
        new InputOption({ key: 'authorName', label: 'Author Name', input: 'InputText', schema: ({ z }) => z.string() }),
        new InputOption({ key: 'authorTitle', label: 'Author Title', input: 'InputText', schema: ({ z }) => z.string().optional() }),
        new InputOption({ key: 'authorImage', label: 'Author Image', input: 'InputMediaUpload', schema: ({ z }) => z.string().optional() }),
        new InputOption({ key: 'authorUrl', label: 'Author Link', input: 'InputUrl', schema: ({ z }) => z.string().optional() }),
        new InputOption({ key: 'orgName', label: 'Organization Name', input: 'InputText', schema: ({ z }) => z.string().optional() }),
        new InputOption({ key: 'orgImage', label: 'Organization Image', input: 'InputMediaUpload', schema: ({ z }) => z.object({ url: z.string() }).optional() }),
        new InputOption({ key: 'orgUrl', label: 'Organization Url', input: 'InputText', schema: ({ z }) => z.string().optional() }),
      ]

      return options
    }

    if (args?.mode === 'multi') {
      return [
        new InputOption({ aliasKey: 'group', key: groupPath, label, input: 'InputList', options: quoteOptions(), schema: ({ z, subSchema }) => z.array(subSchema) }),
      ]
    }

    else {
      return [new InputOption({ label, input: 'group', options: quoteOptions(), key: 'quote' })]
    }
  },
})

export const postOptionSet = new OptionSet< { refine?: { title?: boolean, authorName?: boolean, bodyMarkdown?: boolean } }> ({
  basePath: 'userConfig',
  inputOptions: () => {
    const options = [
      new InputOption({ key: 'title', label: 'Title', input: 'InputText', schema: ({ z }) => z.string() }),
      new InputOption({ key: 'authorName', label: 'Author Name', input: 'InputText', schema: ({ z }) => z.string() }),
      new InputOption({ key: 'bodyMarkdown', label: 'Content', input: 'InputTextarea', schema: ({ z }) => z.string() }),
    ]
    return options
  },
})

export const aiOptionSet = new OptionSet< { refine?: { title?: boolean, authorName?: boolean, bodyMarkdown?: boolean } }> ({
  basePath: 'userConfig',
  inputOptions: () => {
    const options = [
      new InputOption({ key: 'purpose', input: InputAi }),
    ]
    return [
      new InputOption({ label: 'AI', input: 'group', options, key: 'AISettings' }),
    ]
  },
})

export const optionSets = {
  post: postOptionSet,
  quotes: quoteOptionSet,
  socials: socialsOptionSet,
  mediaItems: mediaItemsOptionSet,
  navItems: navItemsOptionSet,
  actionItems: actionItemOptionSet,
  headers: headerOptionSet,
  ai: aiOptionSet,
}
