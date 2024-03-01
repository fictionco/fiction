<script lang="ts" setup>
import { dayjs, notify, resetUi, vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElButton from '../../ui/ElButton.vue'
import { useKaption } from '../../utils'

const { kaptionForms, factorRouter } = useKaption()

const templateId = vue.ref('')
const formName = vue.ref(`New Form (${dayjs().format('MMM DD [at] h:mma')})`)
const sending = vue.ref(false)

const options = vue.ref([
  {
    icon: 'i-carbon-bring-forward',
    title: 'Start From Scratch',
    description: 'Create a new form from scratch',
    cb: (val: string) => {
      templateId.value = val
    },
  },
  {
    icon: 'i-carbon-document-preliminary',
    title: 'Use a Template',
    description: 'Create a new form from a template',
    cb: (val: string) => {
      templateId.value = val
    },
  },
])

function creationError(data?: unknown) {
  notify.error(
    'There was a problem with this action. Developers have been notified.',
    { data },
  )
  resetUi()
}

async function createForm() {
  sending.value = true
  try {
    const r = await kaptionForms.requests.ManageForms.projectRequest({
      _action: 'create',
      form: {
        userConfig: { formName: formName.value },
        templateId: templateId.value,
      },
    })
    if (r.status === 'error' && !r.data?.formId) {
      creationError(r)
    }
    else {
      const path = factorRouter.link('formBuilder', {
        formId: r.data?.formId,
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
  <ElModal modal-class="max-w-lg">
    <div class="p-8">
      <div class="text-xl font-semibold">
        Create a new form
      </div>
      <div class="mt-4">
        <template v-if="!templateId">
          <div class="flex space-x-4">
            <div
              v-for="(item, i) in options"
              :key="i"
              class="hover:bg-theme-50 cursor-pointer rounded-md border border-slate-300 p-4 hover:border-slate-400"
              @click="item.cb('scratch')"
            >
              <div class="mb-2">
                <div class="text-theme-400 inline-block rounded-full">
                  <div class="text-3xl" :class="item.icon" />
                </div>
              </div>
              <div>{{ item.title }}</div>
              <div class="text-theme-400 text-sm">
                {{ item.description }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <ElInput
            v-model="formName"
            class="my-6"
            label="Give it a name"
            input="InputText"
          />
          <div class="mt-4">
            <ElButton
              btn="slate"
              :loading="sending"
              @click="createForm()"
            >
              Continue &rarr;
            </ElButton>
          </div>
        </template>
      </div>
    </div>
  </ElModal>
</template>
