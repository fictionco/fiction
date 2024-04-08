// @unocss-include

import type { InputOptionGeneration, OptionSetArgs, Refinement } from '@fiction/ui'
import { InputOption, OptionSet } from '@fiction/ui'
import InputAi from '@fiction/site/plugin-builder/InputAi.vue'

type StandardOptionArgs = OptionSetArgs & { options?: InputOption[], generation?: InputOptionGeneration }

function standardOption(args?: StandardOptionArgs) {
  const { groupPath, label } = args || {}
  return {
    media: new InputOption({
      key: 'media',
      label: 'Image',
      input: 'InputMediaDisplay',
      props: { formats: args?.formats },
      schema: ({ z }) => z.object({ url: z.string(), format: z.enum(['url']) }),
    }),
    name: new InputOption({ key: 'name', label: 'Text', input: 'InputText', schema: ({ z }) => z.string() }),
    desc: new InputOption({ key: 'desc', label: 'Description', input: 'InputTextarea', schema: ({ z }) => z.string().optional() }),
    href: new InputOption({
      key: 'href',
      label: 'Link / Route',
      input: 'InputText',
      schema: ({ z }) => z.string().refine(val => /^(\/[^\s]*)|([a-z]+:\/\/[^\s]*)$/i.test(val)),
    }),
    target: new InputOption({
      key: 'target',
      label: 'Target',
      input: 'InputSelect',
      list: [{ name: 'Normal', value: '_self' }, { name: 'New Window', value: '_blank' }],
      schema: ({ z }) => z.enum(['_self', '_blank']).optional(),
    }),
    size: new InputOption({
      key: 'size',
      label: 'Size',
      input: 'InputSelect',
      list: ['default', '2xl', 'xl', 'lg', 'md', 'sm', 'xs'],
    }),
    btn: new InputOption({
      key: 'btn',
      label: 'Type',
      input: 'InputSelect',
      list: ['primary', 'default', 'theme', 'danger', 'caution', 'success', 'naked'],
    }),
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
    socialIcon: new InputOption({
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

    groupTitle: new InputOption({
      aliasKey: 'title',
      key: `${groupPath}Title`,
      label: `${label} Title`,
      input: 'InputText',
      schema: ({ z }) => z.string().optional(),
    }),
    group: (_: StandardOptionArgs) => new InputOption({
      label,
      input: 'group',
      options: _.options,
      key: `${groupPath}Group`,
      generation: _.generation,
    }),
    inputList: (_: StandardOptionArgs) => new InputOption({
      aliasKey: 'group',
      key: `${groupPath}`,
      label,
      input: 'InputList',
      options: _.options,
      schema: ({ z, subSchema }) => z.array(subSchema),
    }),
  }
}

export const headerOptionSet = new OptionSet<{
  refine?: { heading?: Refinement, subHeading?: Refinement, superHeading?: Refinement }
}> ({
  basePath: 'userConfig',
  inputOptions(args) {
    const std = standardOption(args)
    return [std.heading, std.subHeading, std.superHeading]
  },
})

export const actionItemOptionSet = new OptionSet< {
  refine?: { group?: Refinement | { name?: Refinement, desc?: Refinement, href?: Refinement, target?: Refinement }, title?: Refinement }
}> ({
  basePath: 'userConfig',
  inputOptions: (args) => {
    const s = standardOption({ label: 'Actions', groupPath: 'actions', ...args })

    const options = [s.name, s.href, s.btn, s.size]

    const out = [s.inputList({ options })]

    return [s.group({ options: out })]
  },
})

export const navItemsOptionSet = new OptionSet<{
  refine?: { group?: Refinement<{ name?: Refinement, desc?: Refinement, href?: Refinement, target?: Refinement }>, title?: Refinement }
}> ({
  basePath: 'userConfig',
  defaultRefinement: { group: { refine: { name: true, href: true, target: true } } },
  inputOptions: (args) => {
    const s = standardOption({ label: 'Nav', groupPath: 'nav', ...args })

    const out = [s.groupTitle, s.inputList({ options: [s.name, s.desc, s.href, s.target] })]

    return [s.group({ options: out })]
  },
})

export const mediaItemsOptionSet = new OptionSet< {
  formats?: { url?: boolean, html?: boolean }
  refine?: { group?: Refinement<{ media?: Refinement, name?: Refinement, desc?: Refinement, href?: Refinement }> }
}> ({
  basePath: 'userConfig',
  inputOptions: (args) => {
    const s = standardOption({ label: 'Media Items', groupPath: 'mediaItems', ...args })

    return [s.inputList({ options: [s.media, s.name, s.desc, s.href], generation: { estimatedMs: 40000 } })]
  },
})

export const socialsOptionSet = new OptionSet< {
  refine?: { group?: Refinement<{ name?: Refinement, desc?: Refinement, icon?: Refinement, href?: Refinement, target?: Refinement }>, title?: Refinement }
}> ({
  basePath: 'userConfig',
  defaultRefinement: { group: { refine: { icon: true, href: true } } },
  inputOptions: (args) => {
    const std = standardOption({ label: 'Socials', groupPath: 'socials', ...args })

    const options = [std.name, std.desc, std.socialIcon, std.href, std.target]

    const out = [std.groupTitle, std.inputList({ options })]

    return [std.group({ options: out })]
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

    const std = standardOption({ label: mode === 'single' ? 'Quote' : 'Quotes', groupPath: 'quotes', ...args })

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

    return [mode === 'multi' ? std.inputList({ options: quoteOptions() }) : std.group({ options: quoteOptions() })]
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
