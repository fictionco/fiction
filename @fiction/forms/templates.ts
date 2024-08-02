import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import type { inputs } from '@fiction/ui/inputs/index.js'
import CardForm from './deck/CardForm.vue'
import InputWrap from './deck/InputWrap.vue'
import { CardAlignmentSchema, CardLayoutSchema } from './schema'

const inputSchema = z.object({
  layout: CardLayoutSchema.optional(),
  alignment: CardAlignmentSchema.optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  placeholder: z.string().optional(),
  buttonText: z.string().optional(),
  isRequired: z.boolean().optional(),
  inputType: z.string().optional() as z.Schema<keyof typeof inputs | undefined>,
  userValue: z.unknown().optional(),
  media: z.object({
    url: z.string().optional(),
    format: z.enum(['url', 'image', 'video']).optional(),
  }).optional(),
})

export type InputUserConfig = z.infer<typeof inputSchema>

export async function getCardTemplates() {
  return [
    new CardTemplate({ templateId: 'formWrap', el: CardForm, isPageCard: true }),
    new CardTemplate({ templateId: 'inputTextShort', el: InputWrap, schema: inputSchema, getBaseConfig: () => ({ inputType: 'InputText' as const }) }),
    new CardTemplate({ templateId: 'inputTextLong', el: InputWrap, schema: inputSchema, getBaseConfig: () => ({ inputType: 'InputTextarea' as const }) }),
  ] as const
}

// new CardType({
//   key: 'shortText',
//   handling: 'input',
//   feature: true,
//   category: 'text',
//   description: 'Simple short form text, one line.',
//   color: 'bg-pink-500',
//   iconStyle: {
//     bg: 'bg-blue-100',
//     text: 'text-blue-700',
//     border: 'border-blue-300',
//     icon: 'i-carbon-string-text',
//   },
//   el: (card): CardTypeEl<typeof InputText> => {
//     return vue.computed(() => {
//       return {
//         component: InputText,
//         styling: 'textInput',
//         valueFormat: 'text',
//         props: {},
//         options: standardCardOptions({
//           card,
//           list: ['maxCharacters'],
//         }),
//       }
//     })
//   },
// }),
