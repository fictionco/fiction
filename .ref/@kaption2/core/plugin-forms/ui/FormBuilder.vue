<script lang="ts" setup>
import type { MenuGroup } from '@factor/api'
import { onResetUi, toLabel, vue, vueRouter } from '@factor/api'
import ElSpinner from '@factor/ui/ElSpinner.vue'
import { useKaption } from '../../utils/inject'
import ElButton from '../../ui/ElButton.vue'
import ElNavMenu from '../../ui/ElNavMenu.vue'
import type { FormUserConfig } from '../form'
import FormBuilderEditor from './FormBuilderEditor.vue'
import FormBuilderIntegrate from './FormBuilderIntegrate.vue'
import FormBuilderShare from './FormBuilderShare.vue'
import FormBuilderElements from './FormBuilderElements.vue'
import VisualizerFrame from './VisualizerFrame.vue'
import type { DeviceMode } from './util'
import { deviceModes } from './util'

const { factorRouter, kaptionForms, factorUser, factorMedia } = useKaption()
const service = { factorMedia }
const indexLink = factorRouter.link('formIndex')
const RouterLink = vueRouter.RouterLink
const activeForm = kaptionForms.activeForm
const editMode = kaptionForms.editMode
const loading = vue.computed(() => !activeForm.value)
const editCard = vue.ref<'newCard'>()
const sending = vue.ref('')
const editing = vue.ref(false)

const navItems = ['create', 'deploy'] as const

type NavItem = typeof navItems[number]

const activeDeviceMode = vue.ref<DeviceMode>('desktop')

const formMenu = vue.computed<MenuGroup[]>(() => {
  const m = [{ groupName: 'Your Form', menu: kaptionForms.formEditModes }]
  return m
})

const updateFormUserConfig = vue.ref<Partial<FormUserConfig> | undefined>(
  undefined,
)

onResetUi(() => {
  // remove add card dropdown
  editCard.value = undefined

  // for wysiwyg editing of values
  editing.value = false

  if (updateFormUserConfig.value && activeForm.value) {
    activeForm.value?.updateUserConfig(updateFormUserConfig.value)
    updateFormUserConfig.value = undefined
  }
})

const currentTopic = vue.computed(() => {
  const p = factorRouter.params.value
  const topic = p.topic as NavItem | undefined
  return topic && !topic.includes(':') ? topic : navItems[0]
})

const topicNav = vue.computed(() => {
  const p = factorRouter.params.value

  return navItems.map((item) => {
    const formId = (p.formId || 'new') as string
    return {
      id: item,
      label: toLabel(item),
      active: currentTopic.value === item,
      to: factorRouter.link('formBuilder', { topic: item, formId }).value,
    }
  })
})

function onInput(ev: Event, field: 'formName') {
  const target = ev.target as HTMLElement
  const v = target.innerHTML
  updateFormUserConfig.value = { ...updateFormUserConfig.value, [field]: v }
}

async function saveForm() {
  sending.value = 'saveForm'
  await kaptionForms.saveActiveForm()
  sending.value = ''
}
</script>

<template>
  <div class="h-full">
    <div v-if="loading" class="">
      <div class="text-theme-300 flex justify-center pt-32">
        <ElSpinner class="h-12 w-12" />
      </div>
    </div>
    <div v-else class="form-editor h-full">
      <div class="border-b border-slate-200">
        <div
          class="grid-cols-12 pt-6 pb-3 md:grid md:items-end md:justify-between"
        >
          <div
            class="col-span-3 items-center space-x-1 text-sm lg:text-base xl:flex"
          >
            <RouterLink
              class="text-theme-400 block pr-1 hover:text-primary-500"
              :to="indexLink"
            >
              Forms /
            </RouterLink>

            <div
              class="hover:bg-theme-100 cursor-pointer rounded-md focus:outline-none"
              contenteditable="true"
              spellcheck="false"
              :value="activeForm?.formName.value"
              @input="onInput($event, 'formName')"
              @click.stop="editing = true"
              v-html="activeForm?.formName.value || 'No Name'"
            />
          </div>
          <div
            class="col-span-6 flex items-center justify-center space-x-2 text-sm"
          >
            <div
              v-for="(item, i) in kaptionForms.formEditModes"
              :key="i"
              class="hover:text-theme-700 rounded-lg py-1.5 px-3"
              :class="
                item.value === editMode
                  ? ` text-theme-600 bg-theme-100 font-bold`
                  : `text-theme-400 cursor-pointer  `
              "
              @click="activeForm ? (editMode = item.value) : ''"
            >
              {{ toLabel(item.value) }}
            </div>
          </div>
          <div
            class="col-span-3 flex items-center justify-end space-x-2 text-right text-sm"
          >
            <ElButton
              btn="slate"
              :loading="sending === 'saveForm'"
              @click.prevent="saveForm()"
            >
              Save
            </ElButton>
          </div>
        </div>
      </div>

      <div
        v-if="activeForm && ['create', 'design'].includes(editMode)"
        class="work-area min-h-0"
      >
        <div
          class="manager-area no-scrollbar min-w-0 grow-0 overflow-scroll pr-4"
        >
          <div class="py-4">
            <ElNavMenu v-model="editMode" :menu="formMenu" />
          </div>
          <div class="list pb-24">
            <FormBuilderElements
              v-if="editMode === 'create'"
              :form="activeForm"
              @add-card="activeForm?.addNewElement($event)"
            />
          </div>
        </div>
        <div>
          <div class="editor-area h-full min-h-0">
            <div
              v-if="['create', 'design'].includes(editMode)"
              class="cards relative flex h-full w-full flex-col justify-center overflow-scroll border-x border-slate-200 bg-gradient-to-br from-slate-100 via-white to-slate-100"
            >
              <!-- allow reset ui clicks over iframe (else iframe captures clicks) -->
              <div
                v-if="editing"
                class="absolute inset-0 z-20 h-full w-full"
              />
              <div class="min-h-0 p-4">
                <div
                  class="relative mx-auto py-4"
                  :class="
                    activeDeviceMode === 'mobile'
                      ? 'w-[60%] max-w-xs'
                      : activeDeviceMode === 'tablet'
                        ? 'w-[85%] max-w-md'
                        : activeDeviceMode === 'landscape'
                          ? 'w-[85%] max-w-lg'
                          : 'w-full'
                  "
                >
                  <VisualizerFrame
                    :device-mode="activeDeviceMode"
                    class="rounded-md shadow-md ring-1 ring-black/5"
                  />
                  <div
                    class="mt-4 flex justify-center space-x-2 text-[10px] uppercase"
                  >
                    <span
                      v-for="(mode, i) in deviceModes"
                      :key="i"
                      class="inline-flex cursor-pointer select-none items-center rounded px-2 py-0.5 font-semibold"
                      :class="
                        activeDeviceMode === mode
                          ? 'bg-theme-400 text-theme-100'
                          : 'text-theme-400 bg-theme-200 hover:text-white hover:bg-primary-500'
                      "
                      @click.stop="activeDeviceMode = mode"
                    >
                      {{ mode }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="no-scrollbar -mr-4 overflow-auto px-4">
              <div class="pb-56">
                <FormBuilderEditor />
              </div>
            </div>
          </div>
        </div>
      </div>
      <FormBuilderIntegrate v-else-if="editMode === 'integrations'" />
      <FormBuilderShare v-else-if="editMode === 'share'" />
    </div>
  </div>
</template>

<style lang="less">
.form-editor {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto minmax(0, 1fr);
  grid-auto-flow: dense;
}
.work-area {
  display: grid;
  grid-template-columns: minmax(130px, 180px) 1fr;
  grid-template-rows: minmax(0, 1fr);
  grid-auto-flow: dense;
  .editor-area {
    display: grid;
    grid-template-columns: 1fr minmax(250px, 350px);
    grid-template-rows: minmax(0, 1fr);
    grid-auto-flow: dense;
    position: relative;
  }

  .manager-area {
    --input-size: 13px;
    --input-bg: #ffffff;
  }
}
</style>
