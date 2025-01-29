<script lang="ts" setup>
import type { ActionArea, ActionButton, PostObject } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionBrand } from '..'
import type { BrandGuideArrayKeys, BrandGuideV3, BrandItem } from '../guideSchema'
import type { TableBrand } from '../schema'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { useService, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save'
import { createOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { BrandGuideSchemaV3 as schema } from '../guideSchema'

const props = defineProps<{ card: Card }>()

const loading = vue.ref(true)
const requesting = vue.ref<'setPrimary' | 'save' | ''>('')

const { fictionBrand, fictionRouter } = useService<{ fictionBrand: FictionBrand }>()

const brand = vue.shallowRef<TableBrand>()

async function load() {
  loading.value = true

  const brandId = fictionRouter.query.value.brandId as string | undefined

  try {
    const endpoint = fictionBrand.requests.ManageBrandGuide

    const r = await endpoint.projectRequest({ _action: 'retrieve', where: { brandId } })

    if (!r.data || !r.data.length)
      throw new Error('No campaign found')

    brand.value = r.data[0]
  }
  catch (error) {
    console.error('Error loading', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(() => {
  vue.watch(
    () => fictionRouter.query.value.brandId,
    () => {
      load()
    },
    { immediate: true },
  )
})

async function saveBrand() {
  requesting.value = 'save'

  const endpoint = fictionBrand.requests.ManageBrandGuide
  const brandId = brand.value?.brandId
  if (!brandId)
    return

  const fields = brand.value || {}

  await endpoint.projectRequest({ _action: 'update', fields, where: { brandId } })

  requesting.value = ''
}

async function setPrimaryBrand() {
  requesting.value = 'setPrimary'
  const endpoint = fictionBrand.requests.ManageBrandGuide
  const brandId = brand.value?.brandId
  if (!brandId)
    throw new Error('No brandId')

  const r = await endpoint.projectRequest({ _action: 'setPrimary', where: { brandId } })

  requesting.value = ''

  if (r.status === 'success') {
    brand.value = { ...brand.value, isPrimary: true }
  }
  else {
    console.error('Error setting primary brand', r)
  }
}

const saveUtil = new AutosaveUtility({ onSave: () => saveBrand() })

function updateBrandGuide(guide?: BrandGuideV3) {
  brand.value = { ...brand.value, guide: { ...brand.value?.guide, ...guide } }

  saveUtil.autosave()
}

function updateBrandTitle(header: PostObject) {
  const title = header.title
  brand.value = { ...brand.value, title }

  saveUtil.autosave()
}

// Core function to create brand item sections
function createBrandSection(args: {
  key: BrandGuideArrayKeys
  label: string
  icon: string
  subLabel?: string
  description: string
  minItems?: number
  examplePrompt?: string
}) {
  const {
    key,
    label,
    icon,
    description,
    minItems = 1,
    examplePrompt = 'Add examples...',
  } = args

  return createOption({
    schema,
    key: `guideControl.${key}`,
    label,
    input: 'InputControl',
    subLabel: description,
    icon: { class: icon },
    valueDisplay: () => {
      const items = brand.value?.guide?.[key] || []

      if (!Array.isArray(items)) {
        console.error('BrandGuide.vue', 'createBrandSection', 'items is not an array', { key, items, brand: brand.value })
        return { status: 'incomplete', data: 'Invalid data' }
      }
      const itemsComplete = items.map((i) => {
        return i.title
          ? {
              label: i.title,
              description: i.description,
            }
          : undefined
      }).filter(Boolean)
      const totalItems = items.length
      const isComplete = items.every(i => i.title && i.description && i.examples)

      return {
        status: totalItems >= minItems ? 'ready' : 'incomplete',
        data: itemsComplete.length ? itemsComplete : 'None defined',
        message: !isComplete ? 'Complete all required fields' : undefined,
        format: 'list',
      }
    },
    options: [
      createOption({
        schema,
        key,
        label,
        input: 'InputList',
        props: {
          itemLabel: args => (args?.item as BrandItem)?.title || '(Untitled)',
          itemName: 'Guideline',
          minItems,
        },
        options: [
          createOption({
            schema,
            key: `${key}.0.title`,
            label: 'Title',
            input: 'InputText',
            isRequired: true,
            placeholder: 'Enter a title...',
          }),
          createOption({
            schema,
            key: `${key}.0.description`,
            label: 'Description',
            input: 'InputTextarea',
            isRequired: true,
            props: { rows: 3 },
            placeholder: 'Add some specifics...',
          }),
          createOption({
            schema,
            key: `${key}.0.examples`,
            label: 'Examples',
            input: 'InputTextarea',
            isRequired: true,
            placeholder: examplePrompt,
            props: { rows: 2 },
          }),
        ],
      }),
    ],
  })
}

const options = vue.computed(() => {
  const b = brand.value
  return [
  // Core Brand Vision
    createOption({
      schema,
      key: 'visionControl',
      label: 'Vision Statement',
      subLabel: 'Create a clear picture of your desired future',
      input: 'InputControl',
      icon: { class: 'i-tabler-target' },
      valueDisplay: () => {
        const vision = b?.guide?.vision
        const words = vision?.split(' ').length || 0
        const minWords = 10
        const data = words && words < minWords ? `${vision} (Needs ${minWords}+ words)` : !words ? 'Define your vision' : vision
        return {
          status: words >= minWords ? 'ready' : 'incomplete',
          data,
          message: `Current word count: ${words}`,
        }
      },
      options: [
        createOption({
          schema,
          key: 'vision',
          input: 'InputTextarea',
          label: 'Vision Statement',
          subLabel: 'Describe how you will be seen in the future',
          props: { rows: 3 },
          placeholder: 'Known as THE leader in X by innovating Y and building a brand known as Z...',
        }),
      ],
    }),

    // Brand Identity
    createBrandSection({
      key: 'personality',
      label: 'Traits and Personality',
      icon: 'i-tabler-user-circle',
      description: 'Core traits and characteristics',
      examplePrompt: 'Role models or examples that embody these traits...',
    }),

    // Content Strategy
    createBrandSection({
      key: 'pillars',
      label: 'Content Focus',
      icon: 'i-tabler-layout-columns',
      subLabel: 'Core themes',
      description: 'Core themes',
      examplePrompt: 'Content that exemplifies this theme...',
    }),

    // createBrandSection({
    //   key: 'audience',
    //   label: 'Target Audience',
    //   icon: 'i-tabler-users',
    //   description: 'Who you serve',
    //   examplePrompt: 'Real examples of this audience...',
    // }),

    // createBrandSection({
    //   key: 'constraints',
    //   label: 'Constraints',
    //   icon: 'i-tabler-shield-x',
    //   description: 'What to avoid',
    //   examplePrompt: 'Specific examples to avoid...',
    // }),

    // Visual Identity
    createOption({
      schema,
      key: 'colors',
      label: 'Brand Colors',
      input: 'InputControl',
      icon: { class: 'i-tabler-palette' },
      valueDisplay: () => ({
        status: brand.value?.guide?.colors?.primary ? 'ready' : 'incomplete',
        data: 'Color scheme settings',
      }),
      options: [
        createOption({
          schema,
          key: 'colors.primary',
          label: 'Primary Color',
          input: 'InputColorTheme',
          isRequired: true,
        }),
      ],
    }),
  ]
})

const action = vue.computed<ActionArea>(() => {
  const isPrimaryButton = !brand.value
    ? undefined
    : brand.value?.isPrimary
      ? {
          testId: 'current-primary-button',
          label: 'Primary Guide',
          theme: 'primary',
          design: 'outline',
          loading: requesting.value === 'setPrimary',
        }
      : {
          testId: 'set-to-primary-button',
          label: 'Set to Primary Guide',
          theme: 'primary',
          design: 'solid',
          onClick: () => setPrimaryBrand(),
          loading: requesting.value === 'setPrimary',
        }

  const isDirty = saveUtil?.isDirty.value

  const buttons = [
    {
      testId: isDirty ? 'brand-saving-button' : 'brand-saved-button',
      label: isDirty ? 'Saving...' : 'Saved',
      onClick: () => saveUtil?.autosave(),
      theme: isDirty ? 'green' : 'default',
      icon: isDirty ? 'i-tabler-upload' : 'i-tabler-check',
    },
    isPrimaryButton,
  ].filter(Boolean) as ActionButton[]

  return { buttons }
})
</script>

<template>
  <SettingsPanel
    :title="card?.title.value"
    :header="{
      title: brand?.title || 'Brand Guide',
      subTitle: 'Define your brand identity and content strategy',
      media: { class: 'i-tabler-map' },
    }"
    :action
    :editable="['title']"
    @update:header="updateBrandTitle($event)"
  >
    <div class="my-6 space-y-6">
      <FormEngine
        :model-value="brand?.guide"
        state-key="brandGuide"
        ui-size="lg"
        :options
        :card
        format="control"
        @update:model-value="updateBrandGuide($event as BrandGuideV3)"
      />
    </div>
  </SettingsPanel>
</template>
