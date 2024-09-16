import type { Card } from './card'
import { colorThemeUser, HeaderLayoutSchema, SizeSchema } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import InputAi from './ai/InputAi.vue'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return new InputOption({ key: 'standard', isClosed: true, label: 'Standard Options', input: 'group', options: [
    new InputOption({ key: 'contentGen', isClosed: true, label: 'Content Generation', input: 'group', options: [
      new InputOption({ key: 'purpose', input: InputAi, isUtility: true, props: { site: card.site } }),
    ] }),
    new InputOption({ key: 'standardHeaders', isClosed: true, label: 'Headers', input: 'group', options: [
      new InputOption({ key: 'standard.headers.layout', label: 'Layout', input: 'InputSelectCustom', list: HeaderLayoutSchema.options }),
      new InputOption({ key: 'standard.headers.size', label: 'Size', input: 'InputSelectCustom', list: SizeSchema.options }),
      new InputOption({ key: 'standard.headers.superTitle', label: 'Super Title', input: 'InputText' }),
      new InputOption({ key: 'standard.headers.superIcon', label: 'Super Icon', input: 'InputIcon' }),
      new InputOption({ key: 'standard.headers.superColor', label: 'Super Color', input: 'InputSelectCustom', list: colorThemeUser }),
      new InputOption({ key: 'standard.headers.title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'standard.headers.subTitle', label: 'Sub Title', input: 'InputText' }),
    ] }),
    new InputOption({ key: 'standardSpacing', isClosed: true, label: 'Spacing', input: 'group', options: [
      new InputOption({ key: 'standard.spacing.contentWidth', label: 'Content Width', input: 'InputSelectCustom', list: SizeSchema.options }),
      new InputOption({ key: 'standard.spacing.verticalSpacing', label: 'Vertical Spacing', input: 'InputSelectCustom', list: SizeSchema.options }),
    ] }),
    new InputOption({ key: 'standardBackground', isClosed: true, label: 'Background', input: 'group', options: [
      new InputOption({ key: 'standard.scheme.base.bg', label: 'Dark Mode Background', input: 'InputMedia' }),
      new InputOption({ key: 'standard.scheme.base.primary', label: 'Dark Primary Color', input: 'InputSelectCustom', list: colorThemeUser }),
      new InputOption({ key: 'standard.scheme.base.theme', label: 'Dark Theme Color', input: 'InputSelectCustom', list: colorThemeUser }),
      new InputOption({ key: 'standard.scheme.light.bg', label: 'Light Mode Background', input: 'InputMedia' }),
      new InputOption({ key: 'standard.scheme.light.primary', label: 'Light Primary Color', input: 'InputSelectCustom', list: colorThemeUser }),
      new InputOption({ key: 'standard.scheme.light.theme', label: 'Light Theme Color', input: 'InputSelectCustom', list: colorThemeUser }),
      new InputOption({ key: 'standard.scheme.reverse', label: 'Reverse Light Mode', input: 'InputToggle' }),
    ] }),
    new InputOption({ key: 'standardFont', isClosed: true, label: 'Font', input: 'group', options: [
      new InputOption({ key: 'standard.fontStyle.title.fontKey', label: 'Title', input: 'InputFont' }),
      new InputOption({ key: 'standard.fontStyle.body.fontKey', label: 'Body', input: 'InputFont' }),
      new InputOption({ key: 'standard.fontStyle.highlight.fontKey', label: 'Highlight', input: 'InputFont' }),
    ] }),
    new InputOption({ key: 'standardHandling', isClosed: true, label: 'Background', input: 'group', options: [
      new InputOption({ key: 'standard.handling.hideOnPage', label: 'Hide on Page', input: 'InputToggle' }),
      new InputOption({ key: 'standard.handling.showOnSingle', label: 'Show on Single', input: 'InputToggle' }),
    ] }),
  ] })
}
