<script lang="ts" setup>
import { dayjs, notify, resetUi, vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '@kaption/core/ui/ElButton.vue'
import type { ModelTemplate } from '../model'
import { templates } from '../model'
import { useFictionApp } from '../../util'

const { factorRouter, fictionModels } = useFictionApp()

const templateId = vue.ref('')
const modelName = vue.ref(`New Model (${dayjs().format('MMM DD [at] h:mma')})`)
const sending = vue.ref(false)

function selectTemplate(tpl: ModelTemplate) {
  templateId.value = tpl.templateId
}

function creationError(data?: unknown) {
  notify.error(
    'There was a problem with this action. Developers have been notified.',
    { data },
  )
  resetUi()
}

async function createModel() {
  sending.value = true
  try {
    const r = await fictionModels.requests.ManageModel.projectRequest({
      _action: 'create',
      model: {
        userConfig: { modelName: modelName.value },
        templateId: templateId.value,
      },
    })
    if (r.status === 'error' && !r.data?.modelId) {
      creationError(r)
    }
    else {
      const path = factorRouter.link('modelEdit', {
        modelId: r.data?.modelId,
        topic: 'create',
      }).value

      await factorRouter.router.push({ path })
    }
  }
  catch (error) {
    creationError(error)
  }
  sending.value = false
}
</script>

<template>
  <ElModal modal-class="max-w-screen-md">
    <div class="px-12 py-16">
      <div class="text-center text-lg font-semibold uppercase text-slate-300">
        Select A Model Template
      </div>
      <div class="mt-6">
        <template v-if="!templateId">
          <div class="divide-y divide-slate-200">
            <div
              v-for="(tpl, i) in templates"
              :key="i"
              class="grid cursor-pointer grid-cols-2 gap-4 rounded-md bg-slate-50 p-8 hover:border-slate-400 hover:bg-slate-100"
            >
              <div
                class="flex flex-col justify-center space-y-2"
                @click="selectTemplate(tpl)"
              >
                <div
                  class="text-2xl font-semibold"
                  @click="selectTemplate(tpl)"
                >
                  {{ tpl.templateName }}
                </div>
                <div class="text-xl text-slate-500">
                  {{ tpl.description }}
                </div>
                <div
                  class="mt-3 text-xl font-semibold text-primary-600 hover:text-primary-500"
                >
                  Select &rarr;
                </div>
              </div>
              <div class="flex flex-col items-center space-y-2">
                <div class="flex space-x-4">
                  <img
                    v-for="img in tpl.beforeImages"
                    :key="img"
                    :src="img"
                    class="w-20 rounded-lg shadow-md"
                  >
                </div>
                <div class="text-2xl text-slate-400">
                  <div class="i-heroicons-arrow-long-down-20-solid" />
                </div>
                <div class="flex space-x-4">
                  <img
                    v-for="img in tpl.afterImages"
                    :key="img"
                    :src="img"
                    class="w-20 rounded-lg shadow-md"
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <ElInput
            v-model="modelName"
            class="my-6"
            label="Give it a name"
            input="InputText"
          />
          <div class="mt-4">
            <ElButton
              btn="slate"
              :loading="sending"
              @click="createModel()"
            >
              Continue &rarr;
            </ElButton>
          </div>
        </template>
      </div>
    </div>
  </ElModal>
</template>
