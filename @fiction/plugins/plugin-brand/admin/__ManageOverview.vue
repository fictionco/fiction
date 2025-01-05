<script lang="ts" setup>
import type { AutosaveUtility } from '@fiction/core/utils/save'
import type { Card } from '@fiction/site'
import type { TableBrand } from '../schema'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import FormEngine from '@fiction/ui/inputs/FormEngine.vue'
import { brandArchetypes } from '../guideSchema'

const { card, brand, saveUtil } = defineProps<{
  card: Card
  brand?: TableBrand
  saveUtil?: AutosaveUtility
}>()

const emit = defineEmits<{
  (event: 'update:brand', payload: TableBrand): void
}>()

function getWordCount(text?: string) {
  if (!text)
    return 0
  return text.split(/\s+/).length
}

function updateBrand(brandNew?: TableBrand) {
  const final = { ...brand, ...brandNew }

  emit('update:brand', final)
}

const options = vue.computed(() => {
  const guide = brand?.guide

  return [
    // Brand Personality Section
    new InputOption({
      key: 'personality',
      label: 'Personality',
      input: 'group',
      options: [
        new InputOption({
          testId: 'personality-archetype',
          icon: { class: 'i-tabler-mask' },
          label: 'Personality Archetype',
          subLabel: 'Select your core archetype that reflects how you connect with others',
          input: 'InputControl',
          valueDisplay: () => {
            const selected = brandArchetypes.find(a => a.value === guide?.personality?.archetype)
            return {
              status: selected ? 'ready' : 'incomplete',
              data: selected ? `${selected.label} - ${selected.description}` : 'Select an archetype',
            }
          },
          options: [
            new InputOption({
              key: 'guide.personality.archetype',
              label: 'Personality Archetype',
              input: 'InputSelectCustom',
              list: brandArchetypes,
              isRequired: true,
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-traits',
          icon: { class: 'i-tabler-list-details' },
          label: 'Character Traits',
          subLabel: 'Define distinctive traits',
          input: 'InputControl',
          valueDisplay: () => {
            const traits = guide?.personality?.traits || ''

            const wordCount = getWordCount(traits)
            const minWords = 15
            return {
              status: wordCount > minWords ? 'ready' : 'incomplete',
              data: traits.length ? traits : 'Add personality traits',
              message: wordCount && wordCount < minWords ? `Should be at least ${minWords} words` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.personality.traits',
              label: 'Character Traits',
              subLabel: 'List aspects of your personality that are unique',
              input: 'InputTextarea',
              placeholder: 'Describe your distinctive traits...',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-voice',
          icon: { class: 'i-tabler-message-circle' },
          label: 'Communication Style',
          subLabel: 'Define your communication style',
          input: 'InputControl',
          valueDisplay: () => {
            const tone = guide?.personality?.voice?.tone
            const guidelines = guide?.personality?.voice?.guidelines
            const toneWords = getWordCount(tone)
            const guideWords = getWordCount(guidelines)
            const minWords = 10
            const hasVoice = toneWords >= minWords && guideWords >= minWords
            return {
              status: hasVoice ? 'ready' : 'incomplete',
              data: hasVoice ? 'Tone and guidelines defined' : 'Define your tone and guidelines',
              message: !hasVoice ? `${toneWords} of ${minWords}+ words tone, ${guideWords} of ${minWords}+ words guidelines` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.personality.voice.tone',
              label: 'Tone of Voice',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Describe the tone of your communication...',
            }),
            new InputOption({
              key: 'guide.personality.voice.guidelines',
              label: 'Communication Guidelines',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'List your do\'s and don\'ts for meaningful communication',
            }),
          ],
        }),

      ],
      format: 'control',
    }),

    // Brand Purpose Section
    new InputOption({
      label: 'Purpose',
      input: 'group',
      options: [
        new InputOption({
          testId: 'brand-mission',
          key: 'mission',
          icon: { class: 'i-tabler-target' },
          label: 'Purpose & Mission',
          subLabel: 'Define your core motivation',
          input: 'InputControl',
          valueDisplay: () => {
            const mission = guide?.purpose?.mission
            const wordCount = getWordCount(mission)
            const minWords = 15
            return {
              status: wordCount >= minWords ? 'ready' : 'incomplete',
              data: mission || 'Define your mission',
              message: wordCount && wordCount < minWords ? `Should be at least ${minWords} words` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.purpose.mission',
              label: 'Mission Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'What drives and motivates you?',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-vision',
          icon: { class: 'i-tabler-eye' },
          label: 'Vision',
          subLabel: 'Define the future you want to create',
          input: 'InputControl',
          valueDisplay: () => {
            const vision = guide?.purpose?.vision
            const wordCount = getWordCount(vision)
            const minWords = 10
            return {
              status: wordCount >= minWords ? 'ready' : 'incomplete',
              data: vision || 'Define your vision',
              message: wordCount && wordCount < minWords ? `Should be at least ${minWords} words` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.purpose.vision',
              label: 'Vision Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'What lasting impact do you want to have?',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-positioning',
          icon: { class: 'i-tabler-chart-dots' },
          label: 'Positioning',
          subLabel: 'Define the unique niche you can own',
          input: 'InputControl',
          valueDisplay: () => {
            const positioning = guide?.purpose?.positioning
            const wordCount = getWordCount(positioning)
            const minWords = 15
            return {
              status: wordCount >= minWords ? 'ready' : 'incomplete',
              data: positioning || 'Define your positioning',
              message: wordCount && wordCount < minWords ? `Positioning should be at least ${minWords} words` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.purpose.positioning',
              label: 'Positioning Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'What sets you apart in your field?',
            }),
          ],
        }),

        new InputOption({
          testId: 'brand-values',
          icon: { class: 'i-tabler-heart' },
          label: 'Core Values',
          subLabel: 'Define your core values and how you demonstrate them',
          input: 'InputControl',
          valueDisplay: () => {
            const values = guide?.purpose?.values || []
            const totalValues = values.length
            return {
              status: totalValues >= 3 ? 'ready' : 'incomplete',
              data: totalValues ? values.map(_ => _.title).join(', ') : 'Add core values',
              message: totalValues && totalValues < 3 ? `Added ${totalValues} of 3+ core values` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.purpose.values',
              label: 'Core Values',
              input: 'InputList',
              props: {
                itemLabel: 'Core Value',
                uiSize: 'lg',
              },
              options: [
                new InputOption({ key: 'title', label: 'Title', input: 'InputText', placeholder: 'Core value name' }),
                new InputOption({ key: 'description', label: 'Description', input: 'InputTextarea', placeholder: 'What this value means to you' }),
                new InputOption({ key: 'inPractice', label: 'In Practice', input: 'InputTextarea', placeholder: 'How you demonstrate this value' }),
              ],
            }),
          ],
        }),
      ],
      format: 'control',
    }),
    // Communities Section
    new InputOption({
      label: 'Target and Niche',
      input: 'group',
      options: [
        new InputOption({
          testId: 'audience-segments',
          icon: { class: 'i-tabler-users' },
          label: 'Audience Segments',
          subLabel: 'Define your key audience segments',
          input: 'InputControl',
          valueDisplay: () => {
            const communities = guide?.communities || []
            const isComplete = communities.every(c =>
              c.interests?.length && c.challenges?.length && c.content?.length,
            )
            return {
              status: communities.length >= 1 && isComplete ? 'ready' : 'incomplete',
              data: communities.length ? `${communities.length} segments defined` : 'Add audience segments',
              message: !isComplete ? 'Complete all segment details' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.communities',
              label: 'Audience Segments',
              input: 'InputList',
              options: [
                new InputOption({ key: 'name', label: 'Segment Name', input: 'InputText', placeholder: 'Name this audience segment' }),
                new InputOption({ key: 'interests', label: 'Interests', input: 'InputText', placeholder: 'Add topics that matter to this audience' }),
                new InputOption({ key: 'challenges', label: 'Challenges', input: 'InputText', placeholder: 'Add pain points this audience faces' }),
                new InputOption({ key: 'content', label: 'Content Types', input: 'InputText', placeholder: 'Add content formats that resonate' }),
              ],
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    new InputOption({
      label: 'Content Pillars',
      input: 'group',
      options: [
        new InputOption({
          testId: 'content-pillars',
          icon: { class: 'i-tabler-layout-columns' },
          label: 'Content Themes',
          subLabel: 'The core topics that guide your content strategy',
          input: 'InputControl',
          valueDisplay: () => {
            const pillars = guide?.pillars || []
            const isComplete = pillars.every(p =>
              getWordCount(p.description) >= 20 && (p.examples?.length || 0) >= 3 && (p.audiences?.length || 0) >= 1,
            )
            return {
              status: pillars.length >= 3 && isComplete ? 'ready' : 'incomplete',
              data: pillars.length ? `${pillars.length} content pillars defined` : 'Add content pillars',
              message: pillars.length < 3 ? 'Define at least 3 pillars' : !isComplete ? 'Complete all pillar details' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.pillars',
              label: 'Content Pillars',
              input: 'InputList',
              options: [
                new InputOption({ key: 'topic', label: 'Topic', input: 'InputText', placeholder: 'Content theme name' }),
                new InputOption({ key: 'description', label: 'Description', input: 'InputTextarea', placeholder: 'How this theme serves your audience' }),
                new InputOption({ key: 'examples', label: 'Content Examples', input: 'InputTextarea', placeholder: 'Add specific content ideas' }),
                new InputOption({ key: 'audiences', label: 'Target Audiences', input: 'InputText', placeholder: 'Add audience segments this serves' }),
              ],
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    // Future Pacing Section
    new InputOption({
      label: 'Future Vision',
      input: 'group',
      options: [
        new InputOption({
          testId: 'future-declaration',
          key: 'declaration',
          icon: { class: 'i-tabler-rocket' },
          label: 'Future Vision',
          subLabel: 'Write your vision as if already achieved',
          input: 'InputControl',
          valueDisplay: () => {
            const declaration = guide?.futurePacing?.declaration
            const wordCount = getWordCount(declaration)
            return {
              status: wordCount >= 50 ? 'ready' : 'incomplete',
              data: declaration ? `${wordCount} word vision statement` : 'Write your vision',
              message: wordCount < 50 ? 'Vision should be at least 50 words' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.futurePacing.declaration',
              label: 'Vision Statement',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Write your ambitious future vision...',
            }),
          ],
        }),

        new InputOption({
          testId: 'next-steps',
          icon: { class: 'i-tabler-list-check' },
          label: 'Next Actions',
          subLabel: 'Define concrete steps to achieve your vision',
          input: 'InputControl',
          valueDisplay: () => {
            const steps = guide?.futurePacing?.nextSteps
            const totalSteps = steps?.length || 0
            const isComplete = steps && steps.every(s => s.statement && s.action && s.deadline)
            const minSteps = 1
            return {
              status: totalSteps >= minSteps && isComplete ? 'ready' : 'incomplete',
              data: totalSteps ? `${totalSteps} action steps defined` : 'Add action steps',
              message: totalSteps && totalSteps < minSteps ? `Define at least ${minSteps} steps` : !isComplete ? 'Complete all step details' : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.futurePacing.nextSteps',
              label: 'Action Steps',
              input: 'InputList',
              options: [
                new InputOption({ key: 'statement', label: 'Milestone', input: 'InputText', placeholder: 'What you want to achieve' }),
                new InputOption({ key: 'action', label: 'Next Action', input: 'InputTextarea', placeholder: 'Specific and actionable next step to take' }),
                new InputOption({ key: 'deadline', label: 'Deadline', input: 'InputDate', placeholder: 'When you\'ll achieve this' }),
              ],
              props: {
                template: {
                  statement: '',
                  action: '',
                  deadline: '',
                },
                minItems: 3,
                itemFormat: [
                  { key: 'statement', label: 'Milestone', input: 'InputText', placeholder: 'What you want to achieve' },
                  { key: 'action', label: 'Action', input: 'InputTextarea', placeholder: 'Specific action to take' },
                  { key: 'deadline', label: 'Deadline', input: 'InputText', placeholder: 'When you\'ll achieve this' },
                ],
              },
            }),
          ],
        }),
      ],
      format: 'control',
    }),

    // Visuals Section
    new InputOption({
      label: 'Visual Identity',
      input: 'group',
      options: [
        new InputOption({
          testId: 'brand-color',
          icon: { class: 'i-tabler-palette' },
          label: 'Brand Color',
          subLabel: 'Choose your signature color',
          input: 'InputControl',
          valueDisplay: () => {
            const color = guide?.visuals?.primaryColor
            return {
              status: color ? 'ready' : 'incomplete',
              data: color || 'Select primary color',
            }
          },
          options: [
            new InputOption({
              key: 'guide.visuals.primaryColor',
              label: 'Primary Color',
              input: 'InputColor',
              isRequired: true,
            }),
          ],
        }),

        new InputOption({
          testId: 'typography',
          icon: { class: 'i-tabler-typography' },
          label: 'Typography',
          subLabel: 'Define your brand fonts',
          input: 'InputControl',
          valueDisplay: () => {
            const typography = guide?.visuals?.typography
            return {
              status: typography?.title || typography?.body ? 'ready' : 'incomplete',
              data: typography?.title ? `Title: ${typography.title || 'Default'} / Body: ${typography.body || 'Default'}` : 'Set brand typography',
            }
          },
          options: [
            new InputOption({
              key: 'guide.visuals.typography.title',
              label: 'Heading Font',
              input: 'InputFont',
              isRequired: true,
            }),
            new InputOption({
              key: 'guide.visuals.typography.body',
              label: 'Body Font',
              input: 'InputFont',
              isRequired: true,
            }),
          ],
        }),

        new InputOption({
          testId: 'image-style',
          icon: { class: 'i-tabler-photo' },
          label: 'Image Style',
          subLabel: 'Define your visual guidelines',
          input: 'InputControl',
          valueDisplay: () => {
            const style = guide?.visuals?.imageStyle
            const wordCount = getWordCount(style)
            const minWords = 15
            return {
              status: wordCount >= minWords ? 'ready' : 'optional',
              data: style ? `${wordCount} words of guidelines` : 'Define image guidelines',
              message: minWords && wordCount < minWords ? `Should be at least ${minWords} words` : undefined,
            }
          },
          options: [
            new InputOption({
              key: 'guide.visuals.imageStyle',
              label: 'Image Guidelines',
              input: 'InputTextarea',
              isRequired: true,
              placeholder: 'Describe your visual style guidelines...',
            }),
          ],
        }),
      ],
      format: 'control',
    }),

  ]
})
</script>

<template>
  <SettingsPanel
    :title="card?.title.value"
    :header="{
      title: brand?.title || 'Untitled',
      subTitle: 'As you build your influence, a consistent and intentional brand will be the foundation of your success.',
      media: { class: `i-tabler-briefcase` },
      action: {},
    }"
    :action="{
      buttons: [{
        testId: 'brand-save-button',
        label: saveUtil?.isDirty.value ? 'Saving...' : 'Saved',
        onClick: () => updateBrand(),
        theme: saveUtil?.isDirty.value ? 'green' : 'default',
        icon: saveUtil?.isDirty.value ? 'i-tabler-upload' : 'i-tabler-check',
        size: 'sm',
      }],
    }"
  >
    <div class="my-6 space-y-6">
      <FormEngine
        :model-value="brand"
        state-key="settingsTool"
        ui-size="lg"
        :options="options"
        :card="card"
        format="control"
        @update:model-value="updateBrand($event as TableBrand)"
      />
    </div>
  </SettingsPanel>
</template>
