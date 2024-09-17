import type { InputOptionSettings } from '@fiction/ui/index.js'
import { ButtonDesignSchema, colorTheme, colorThemeUser, SizeSchema } from '@fiction/core'
import InputAi from '@fiction/site/ai/InputAi.vue'
import { InputOption } from '@fiction/ui/index.js'

type OptArgs<T extends string = string> = (Partial<InputOptionSettings<T>> & Record<string, unknown>) | undefined

export const standardOption = {
  media: (_: OptArgs = {}) => new InputOption({ key: 'media', label: 'Image', input: 'InputMedia', props: { formats: _?.formats }, ..._ }),
  name: (_: OptArgs = {}) => new InputOption({ key: 'name', label: 'Text', input: 'InputText', ..._ }),
  desc: (_: OptArgs = {}) => new InputOption({ key: 'desc', label: 'Description', input: 'InputTextarea', ..._ }),
  icon: (_: OptArgs = {}) => new InputOption({ key: 'icon', label: 'Icon', input: 'InputSelect', ..._ }),
  href: (_: OptArgs = {}) => new InputOption({ key: 'href', label: 'Link / Route', input: 'InputText', ..._ }),
  target: (_: OptArgs = {}) => new InputOption({ key: 'target', label: 'Target', input: 'InputSelect', list: [{ name: 'Normal', value: '_self' }, { name: 'New Window', value: '_blank' }], ..._ }),
  size: (_: OptArgs = {}) => new InputOption({ key: 'size', label: 'Size', input: 'InputSelect', list: ['default', ...SizeSchema.options], ..._ }),
  colorThemeUser: (_: OptArgs = {}) => new InputOption({ key: 'theme', label: 'Type', input: 'InputSelect', list: colorThemeUser, ..._ }),
  buttonDesign: (_: OptArgs = {}) => new InputOption({ key: 'design', label: 'Type', input: 'InputSelect', list: ['default', ...ButtonDesignSchema.options], ..._ }),
  heading: (_: OptArgs = {}) => new InputOption({
    key: 'heading',
    label: 'Heading',
    input: 'InputTextarea',
    props: { maxHeight: 250 },
    schema: ({ z }) => z.string(),
    ..._,
  }),
  subHeading: (_: OptArgs = {}) => new InputOption({
    key: 'subHeading',
    label: 'Sub Heading',
    input: 'InputTextarea',
    props: { maxHeight: 250 },
    schema: ({ z }) => z.string(),
    ..._,
  }),
  superHeading: (_: OptArgs = {}) => new InputOption({
    key: 'superHeading',
    label: 'Super Heading',
    input: 'InputTextarea',
    props: { maxHeight: 250 },
    schema: ({ z }) => z.string().optional(),
    ..._,
  }),
  layout: (_: OptArgs = {}) => new InputOption({
    key: 'layout',
    label: 'Layout',
    input: 'InputSelect',
    props: { list: ['justify', 'center', 'left', 'right'] },
    schema: ({ z }) => z.enum(['justify', 'center', 'left', 'right']).optional(),
    ..._,
  }),
  socialIcon: (_: OptArgs = {}) => new InputOption({
    key: 'icon',
    label: 'Icon',
    input: 'InputIcon',
  }),

  groupTitle: (_: OptArgs = {}) => new InputOption({
    aliasKey: 'title',
    input: 'InputText',
    schema: ({ z }) => z.string().optional(),
    ..._,
    key: `${_?.key}Title`,
    label: `${_?.label} Title`,
  }),
  group: (_: OptArgs = {}) => new InputOption({
    input: 'group',
    key: `${_?.key}Group`,
    ..._,
  }),
  inputList: (_: OptArgs = {}) => new InputOption({
    input: 'InputList',
    aliasKey: 'group',
    schema: ({ z, subSchema }) => z.array(subSchema),
    key: `${_?.key}`,
    ..._,
  }),
  headers: (_: OptArgs = {}) => {
    const s = standardOption
    return s.group({ label: 'Headers', key: 'headers', ..._, options: [
      s.heading(),
      s.subHeading(),
      s.superHeading(),
      new InputOption({ key: 'superColor', input: 'InputSelect', label: 'Color of Super Header', list: colorTheme }),
      new InputOption({ key: 'superIcon', input: 'InputText', label: 'Super Header Icon', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),
    ] })
  },
  buttons: (_: OptArgs = {}) => {
    const s = standardOption
    return s.inputList({ label: 'Actions', key: 'actions', ..._, options: [
      s.name(),
      s.href(),
      s.colorThemeUser(),
      s.size(),
      s.buttonDesign(),
      s.target(),
      new InputOption({ key: 'icon', input: 'InputText', label: 'Icon', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),
      new InputOption({ key: 'iconAfter', input: 'InputText', label: 'Icon After', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),

    ] })
  },
  navItems: (_: OptArgs & { maxDepth?: number, itemNames?: string[] } = {}) => {
    const { maxDepth = 0, itemNames = ['Nav Item'] } = _
    const s = standardOption
    const __ = { label: 'Nav Items', key: 'navItems', ..._ }
    const opts = (depth: number) => {
      const out = [
        s.name(),
        s.icon(),
        s.href(),

      ]

      if (depth < maxDepth) {
        out.push(
          s.groupTitle({ key: 'items', label: 'Sub Items' }) as InputOption,
          s.inputList({ key: 'items', label: 'Sub Items', props: { itemName: itemNames[depth + 1] || itemNames.pop() }, options: opts(depth + 1) }),
          new InputOption({ key: 'subStyle', label: 'Submenu Style', input: 'InputSelect', list: ['drop', 'mega'] }),
        )
      }

      out.push(...[
        s.desc(),
        s.target(),
        new InputOption({ key: 'itemStyle', label: 'Style', input: 'InputSelect', list: ['default', 'button', 'user'] }),
        new InputOption({ key: 'authState', label: 'Auth State', input: 'InputSelect', list: ['default', 'loggedIn', 'loggedOut'] }),
      ] as InputOption[])

      return out
    }
    const g = s.group({ ...__, options: [s.groupTitle(__) as InputOption, s.inputList({ ...__, props: { itemName: itemNames[0] }, options: opts(0) })] })
    return g
  },
  mediaItems: (_: OptArgs = {}) => {
    const s = standardOption
    return s.inputList({ label: 'Media Items', key: 'mediaItems', ..._, options: [s.media(), s.name(), s.desc(), s.href()], generation: { estimatedMs: 40000 } })
  },
  postItems: (_: OptArgs = {}) => {
    const s = standardOption
    return s.inputList({ label: 'Post Items', key: 'postItems', ..._, options: [
      s.media(),
      s.href(),
      new InputOption({ key: 'title', label: 'Title', input: 'InputText', placeholder: 'Title' }),
      new InputOption({ key: 'subTitle', label: 'Subtitle', input: 'InputText', placeholder: 'Sub title' }),
      new InputOption({ key: 'superTitle', label: 'Super Title', input: 'InputText', placeholder: 'Super Title' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputProse', placeholder: 'Content' }),

    ], generation: { estimatedMs: 40000 } })
  },
  socials: (_: OptArgs = {}) => {
    const s = standardOption
    const __ = { label: 'Socials', key: 'socials', ..._ }
    return s.group({ ...__, options: [
      s.groupTitle(__) as InputOption,
      s.inputList({ ...__, props: { itemName: 'Account' }, options: [s.name(), s.desc(), new InputOption({
        key: 'icon',
        label: 'Icon',
        input: 'InputIcon',
      }), s.href(), s.target()] }),
    ] })
  },
  post: (_: OptArgs = {}) => {
    const __ = { label: 'Post', key: 'post', ..._ }
    const s = standardOption
    return s.group({ ...__, options: [
      new InputOption({ key: 'title', label: 'Title', input: 'InputText', schema: ({ z }) => z.string(), ..._ }),
      new InputOption({ key: 'authorName', label: 'Author Name', input: 'InputText', schema: ({ z }) => z.string(), ..._ }),
      new InputOption({ key: 'bodyMarkdown', label: 'Content', input: 'InputTextarea', schema: ({ z }) => z.string(), ..._ }),
    ] })
  },
  ai: (_: OptArgs = {}) => {
    return new InputOption({ label: 'Content Generation', input: 'group', key: 'ai', options: [
      new InputOption({ key: 'purpose', input: InputAi, ..._, isUtility: true }),
    ], ..._ })
  },
}
