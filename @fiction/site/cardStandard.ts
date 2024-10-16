import type { Card } from './card'
import { colorTheme, colorThemeBright, HeaderLayoutSchema, SizeSchema, SizeSchemaComplete } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import InputAi from './ai/InputAi.vue'

export function standardCardOptions(args: { card: Card }) {
  const { card } = args
  return new InputOption({ key: 'standard', label: 'Standard Options', input: 'group', options: [
    new InputOption({ key: 'contentGen', icon: { class: 'i-tabler-sparkles' }, isClosed: true, label: 'AI Content Generation', input: 'group', options: [
      new InputOption({ key: 'purpose', input: InputAi, isUtility: true, props: { site: card.site } }),
    ] }),
    new InputOption({ key: 'standardHeaders', icon: { class: 'i-tabler-heading' }, isClosed: true, label: 'Text Headers', input: 'group', options: [
      new InputOption({ key: 'standard.headers.title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'standard.headers.subTitle', label: 'Sub Title', input: 'InputText' }),
      new InputOption({ key: 'standard.headers.layout', label: 'Layout', input: 'InputSelectCustom', list: HeaderLayoutSchema.options }),
      new InputOption({ key: 'standard.headers.size', label: 'Size', input: 'InputSelectCustom', list: SizeSchema.options }),
      new InputOption({ key: 'standard.headers.superTitle', label: 'Super Title', input: 'InputText' }),
      new InputOption({ key: 'standard.headers.superIcon', label: 'Super Icon', input: 'InputIcon' }),
      new InputOption({ key: 'standard.headers.superColor', label: 'Super Color', input: 'InputSelectCustom', list: colorThemeBright }),
    ] }),
    new InputOption({ key: 'standardSpacing', icon: { class: 'i-tabler-viewport-wide' }, isClosed: true, label: 'Width / Spacing', input: 'group', options: [
      new InputOption({ key: 'standard.spacing.contentWidth', label: 'Content Width', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
      new InputOption({ key: 'standard.spacing.verticalSpacing', label: 'Vertical Spacing', input: 'InputSelectCustom', list: SizeSchemaComplete.options }),
    ] }),
    new InputOption({ key: 'standardBackground', icon: { class: 'i-tabler-background' }, isClosed: true, label: 'Color / Background', input: 'group', options: [
      new InputOption({ key: 'standard.scheme.base.bg', label: 'Dark Mode Background', input: 'InputMedia', props: { isBackground: true } }),
      new InputOption({ key: 'standard.scheme.base.primary', label: 'Dark Primary Color', input: 'InputSelectCustom', list: colorThemeBright }),
      new InputOption({ key: 'standard.scheme.base.theme', label: 'Dark Theme Color', input: 'InputSelectCustom', list: colorTheme }),
      new InputOption({ key: 'standard.scheme.light.bg', label: 'Light Mode Background', input: 'InputMedia', props: { isBackground: true } }),
      new InputOption({ key: 'standard.scheme.light.primary', label: 'Light Primary Color', input: 'InputSelectCustom', list: colorThemeBright }),
      new InputOption({ key: 'standard.scheme.light.theme', label: 'Light Theme Color', input: 'InputSelectCustom', list: colorTheme }),
      new InputOption({ key: 'standard.scheme.reverse', label: 'Reverse Light Mode', input: 'InputToggle' }),
    ] }),
    new InputOption({ key: 'standardFont', icon: { class: 'i-tabler-text-size' }, isClosed: true, label: 'Font', input: 'group', options: [
      new InputOption({ key: 'standard.fontStyle.title.fontKey', label: 'Title', input: 'InputFont' }),
      new InputOption({ key: 'standard.fontStyle.body.fontKey', label: 'Body', input: 'InputFont' }),
      new InputOption({ key: 'standard.fontStyle.highlight.fontKey', label: 'Highlight', input: 'InputFont' }),
    ] }),
    new InputOption({ key: 'standardHandling', icon: { class: 'i-tabler-status-change' }, isClosed: true, label: 'Page Handling', input: 'group', options: [
      new InputOption({ key: 'standard.handling.hideOnPage', label: 'Hide on Page', input: 'InputToggle', description: `Hide this element by default on the page. Useful for controlling elements on cards vs pages.` }),
      new InputOption({ key: 'standard.handling.showOnSingle', label: 'Show When Viewing Post', input: 'InputToggle', description: `Show this element when viewing a post, by default all elements are hidden unless configured otherwise.` }),
    ] }),
  ] })
}
