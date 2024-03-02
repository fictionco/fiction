<script lang="ts" setup>
import { emitEvent, isValid, vue, vueRouter } from '@factor/api'
import ElInput from '@factor/ui/ElInput.vue'
import ElForm from '@factor/ui/ElForm.vue'
import { useKaption } from '../../utils'
import RegisterWrap from '../AuthWrap.vue'

const { factorRouter, factorUser, kaptionAdmin } = useKaption()

const router = vueRouter.useRouter()
const form = vue.ref({
  projectName: '',
  projectDomain: '',
  projectTimezone: '',
})
const formError = vue.ref('')
const sending = vue.ref(false)
const disabled = vue.computed(() => form.value.projectName.length < 2)

vue.onMounted(async () => {
  await factorUser.userInitialized()
})

async function createProject(): Promise<void> {
  const { projectName, projectDomain, projectTimezone } = form.value

  const userId = factorUser.activeUser.value?.userId
  const organizationId
    = factorUser.activeUser.value?.organizations?.[0]?.organizationId

  if (!userId) {
    formError.value = 'user id is missing'
    return
  }
  if (!organizationId) {
    formError.value = 'organization id is missing'
    return
  }
  if (!isValid(projectDomain, 'domain')) {
    formError.value = 'domain is invalid'
    return
  }

  const r = await kaptionAdmin.requests.ManageProject.request({
    userId,
    organizationId,
    project: {
      projectName,
      origins: [projectDomain],
      timezone: projectTimezone,
    },
    _action: 'create',
  })

  if (r.status === 'success')
    await router.push(factorRouter.to('trackingCode'))
}

async function send(): Promise<void> {
  sending.value = true

  await createProject()

  sending.value = false
}
</script>

<template>
  <RegisterWrap title="Create A Project" :loading="sending">
    <ElForm :notify="formError" @submit="send()">
      <ElInput
        v-model="form.projectName"
        input="InputText"
        label="Project Name"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElInput
        v-model="form.projectDomain"
        input="InputUrl"
        label="Website"
        description="Enter the primary website associated with this project"
        @keyup.enter.stop="emitEvent('submit')"
      />

      <ElInput
        v-model="form.projectTimezone"
        input="InputTimezone"
        label="Project Timezone"
        description="For visualizing dates and times"
        required
        @keyup.enter.stop="emitEvent('submit')"
      />
      <div class="action">
        <button
          type="submit"
          class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 w-full items-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="disabled ? 'opacity-80 cursor-not-allowed' : ''"
          :disabled="disabled"
        >
          Create Project
        </button>
      </div>
    </ElForm>
  </RegisterWrap>
</template>
