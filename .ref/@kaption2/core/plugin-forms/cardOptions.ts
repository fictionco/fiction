import type { ListItem } from '@factor/api'
import { toLabel, vue } from '@factor/api'
import { InputOption } from '@factor/ui/inputOption'
import type { Card } from './card'
import InputLogic from './ui/InputLogic.vue'

export const standardOptionList = [
  new InputOption({
    optionKey: 'isRequired',
    input: 'InputToggle',
    core: true,
    category: 'validation',
  }),

  new InputOption({
    optionKey: 'choices',
    label: 'Choices',
    description: 'Add each choice on a new line',
    input: 'InputTextarea',
    core: true,
    category: 'info',
  }),
  new InputOption({
    optionKey: 'maxCharacters',
    label: 'Max Response Length',
    description: 'Max characters allowed in response',
    input: 'InputNumber',
    category: 'handling',
  }),
  new InputOption({
    optionKey: 'minSelect',
    input: 'InputNumber',
    label: 'Min Selected',
    description: 'Fails validation if not met (Default 0)',
    category: 'validation',
  }),
  new InputOption({
    optionKey: 'maxSelect',
    input: 'InputNumber',
    label: 'Max Selected',
    description: 'Add large number for unlimited (Default 1) ',
    category: 'validation',
  }),
  new InputOption({
    optionKey: 'allowMultiple',
    input: 'InputToggle',
    label: 'Allow Multiple Selections',
    category: 'validation',
  }),
  new InputOption({
    optionKey: 'randomize',
    input: 'InputToggle',
    category: 'handling',
  }),
  new InputOption({
    optionKey: 'addOtherOption',
    label: 'Add \'other\' option',
    input: 'InputToggle',
    category: 'handling',
  }),
  new InputOption({
    optionKey: 'dateFormat',
    input: 'InputSelect',
    category: 'handling',

    props: vue.computed(() => ({
      list: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'],
    })),
  }),
  new InputOption({
    optionKey: 'country',
    input: 'InputSelect',
    category: 'handling',
  }),
]

export type StandardOptionKeys = Omit<
  typeof standardOptionList[number],
  'list'
>['optionKey']

export function standardCardOptions(args: {
  card: Card
  list: (InputOption<string> | StandardOptionKeys)[]
}): InputOption<string>[] {
  const { list, card } = args

  const handling = card.handling

  const fullList = [
    new InputOption({
      optionKey: 'heading',
      input: 'InputText',
      core: true,
      category: 'info',
    }),
    new InputOption({
      optionKey: 'description',
      input: 'InputText',
      core: true,
      category: 'info',
    }),
    new InputOption({
      optionKey: 'buttonText',
      input: 'InputText',
      core: true,
      category: 'info',
    }),
    ...list,
  ]

  if (handling === 'input') {
    fullList.push(
      new InputOption({
        optionKey: 'logic',
        input: InputLogic,
        core: true,
        category: 'handling',
        props: vue.computed(() => {
          const { valueFormat } = card.el.value || {}

          const list = card.el.value?.props?.list as ListItem[] | undefined
          return {
            valueFormat,
            list,
            card,
          }
        }),
      }),
    )
  }

  if (handling !== 'view') {
    const changeTypeOption = new InputOption({
      optionKey: 'cardTypeKey',
      label: `${toLabel(handling)} Type`,
      input: 'InputSelect',
      category: 'handling',

      props: vue.computed(() => ({
        list: card.form.theme.value.cardTypes
          .filter(t => t.handling === handling)
          .map((t) => {
            return { name: t.name, value: t.key }
          }),
      })),
    })

    fullList.unshift(changeTypeOption)
  }

  const r = fullList.map((o) => {
    let out: InputOption<string> | undefined
    if (typeof o === 'string')
      out = standardOptionList.find(s => s.optionKey === o)
    else
      out = o

    return out
  })

  return r.filter(Boolean) as InputOption<string>[]
}
