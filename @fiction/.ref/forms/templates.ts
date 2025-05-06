import type { inputs } from '@fiction/ui/inputs/index.js'
import { cardTemplate } from '@fiction/site/card.js'
import { z } from 'zod'
import CardForm from './deck/CardForm.vue'
import InputWrap from './deck/InputWrap.vue'
import { CardAlignmentSchema, CardLayoutSchema } from './schema'

const inputSchema = z.object({
  cardType: z.enum(['input', 'end']).optional(),
  layout: CardLayoutSchema.optional(),
  alignment: CardAlignmentSchema.optional(),
  key: z.string().optional(),
  title: z.string().optional(),
  subTitle: z.string().optional(),
  placeholder: z.string().optional(),
  buttonText: z.string().optional(),
  required: z.boolean().optional(),
  inputType: z.string().optional() as z.Schema<keyof typeof inputs | undefined>,
  userValue: z.union([z.string(), z.number(), z.record(z.string(), z.union([z.string(), z.number()]))]).optional(),
  media: z.object({
    url: z.string().optional(),
    format: z.enum(['url', 'image', 'video']).optional(),
  }).optional(),
})

export type InputUserConfig = z.infer<typeof inputSchema>

export async function getFormCardTemplates() {
  const common = { el: InputWrap, getConfig: async () => {
    return { schema: inputSchema }
  } }
  return [
    cardTemplate({ templateId: 'formWrap', el: CardForm, isPageCard: true }),
    cardTemplate({ templateId: 'formStart', ...common, getBaseConfig: () => ({ }) }),
    cardTemplate({ templateId: 'formEnd', ...common, getBaseConfig: () => ({ cardType: 'end' as const }) }),
    cardTemplate({ templateId: 'inputTextShort', ...common, getBaseConfig: () => ({ inputType: 'InputText' as const }) }),
    cardTemplate({ templateId: 'inputTextLong', ...common, getBaseConfig: () => ({ inputType: 'InputTextarea' as const }) }),
    cardTemplate({ templateId: 'inputEmail', ...common, getBaseConfig: () => ({ inputType: 'InputEmail' as const }) }),
    cardTemplate({ templateId: 'inputNumber', ...common, getBaseConfig: () => ({ inputType: 'InputNumber' as const }) }),
    cardTemplate({ templateId: 'inputSelect', ...common, getBaseConfig: () => ({ inputType: 'InputSelect' as const }) }),
    cardTemplate({ templateId: 'inputDate', ...common, getBaseConfig: () => ({ inputType: 'InputDate' as const }) }),
    cardTemplate({ templateId: 'inputCheckbox', ...common, getBaseConfig: () => ({ inputType: 'InputCheckbox' as const }) }),
    cardTemplate({ templateId: 'inputRadio', ...common, getBaseConfig: () => ({ inputType: 'InputRadio' as const }) }),
    cardTemplate({ templateId: 'inputRanking', ...common, getBaseConfig: () => ({ inputType: 'InputRanking' as const }) }),
  ] as const
}
