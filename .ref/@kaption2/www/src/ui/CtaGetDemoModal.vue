<script lang="ts" setup>
import { emitEvent, vue } from '@factor/api'

import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElemModal from '@factor/ui/ElModal.vue'
import { useRoute } from 'vue-router'
import ElButton from '@factor/ui/ElButton.vue'

const defaultUser = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  website: '',
}

const user = vue.ref<{
  email: string
  phone: string
  firstName: string
  lastName: string
  website: string
}>(defaultUser)
const company = vue.ref<{ name: string, employee_count: number }>({
  name: '',
  employee_count: 0,
})
const isValid = vue.ref<boolean>(false)
const sending = vue.ref(false)
const sent = vue.ref(false)
const route = useRoute()

vue.watch(
  () => route.query.email,
  (v) => {
    if (v)
      user.value.email = v as string
  },
)

async function submit(): Promise<void> {
  sending.value = true

  if (!user.value.email)
    emitEvent('notify', 'No email address')

  // const r = await client.identify({ ...user.value, company: company.value })

  // sending.value = false

  // if (r && r.status === "success") {
  //   sent.value = true
  // }
}

function reset(): void {
  user.value = defaultUser
  sent.value = false
}
</script>

<template>
  <ElemModal
    name="getDemo"
    class="p-12"
    @close="reset()"
  >
    <div class="">
      <svg
        class="text-primary-600 h-8 w-8"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)">
          <path
            d="M0.959867 10.2685C1.114 11.7092 2.2727 12.8679 3.71266 13.0284C4.78221 13.1476 5.88037 13.25 7 13.25C8.11963 13.25 9.21779 13.1476 10.2873 13.0284C11.7273 12.8679 12.886 11.7092 13.0401 10.2685C13.1539 9.20502 13.25 8.11315 13.25 7C13.25 5.88684 13.1539 4.79498 13.0401 3.73147C12.886 2.29082 11.7273 1.13211 10.2873 0.971609C9.21779 0.852392 8.11963 0.75 7 0.75C5.88037 0.75 4.78221 0.852392 3.71266 0.971609C2.2727 1.13211 1.114 2.29082 0.959867 3.73147C0.846083 4.79498 0.75 5.88684 0.75 7C0.75 8.11315 0.846084 9.20502 0.959867 10.2685Z"
            fill=""
            stroke="currentColor"
            stroke-width="1.5"
          />
          <path
            d="M4.00595 3.60144H5.74425"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4.00595 6.27245H7.00001"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.4685 7.57935L8.80068 10.0168L6.42903 8.86106L4.88718 10.7709"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </div>

    <div class="py-3">
      <h2 class="text-2xl font-semibold">
        Get A Demo
      </h2>
      <p class="text-theme-500">
        Fill out the form and an expert will be in touch right away.
      </p>
    </div>

    <div v-if="sent" class="p-12 text-center">
      <div class="text-xl font-semibold">
        Success!
      </div>
      <div class="">
        We'll be in touch soon but you can also
        <a class="text-primary" href="mailto:support@kaption.co">email us</a>
        directly.
      </div>
    </div>
    <ElForm
      v-else
      v-model:valid="isValid"
      :data="user"
      @submit="submit()"
    >
      <div class="my-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ElInput
          v-model="user.firstName"
          class="my-0"
          input="InputText"
          label="First Name"
          @keyup.enter.stop="emitEvent('submit')"
        />
        <ElInput
          v-model="user.lastName"
          class="my-0"
          input="InputText"
          label="Last Name"
          @keyup.enter.stop="emitEvent('submit')"
        />
        <ElInput
          v-model="user.email"
          class="my-0"
          input="InputEmail"
          label="Your Email"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />

        <ElInput
          v-model="user.phone"
          class="my-0"
          input="InputPhone"
          label="Your Phone Number"
          required
          @keyup.enter.stop="emitEvent('submit')"
        />
        <ElInput
          v-model="company.name"
          class="my-0"
          input="InputText"
          label="Company"
          @keyup.enter.stop="emitEvent('submit')"
        />
        <ElInput
          v-model="user.website"
          class="my-0"
          input="InputUrl"
          label="Website"
          @keyup.enter.stop="emitEvent('submit')"
        />
        <ElInput
          v-model="company.employee_count"
          class="my-0 md:col-span-2"
          input="InputSelect"
          label="Number of Employees"
          :list="[
            { name: '1 to 5', value: 1 },
            { name: '6 to 10', value: 6 },
            { name: '11 to 20', value: 11 },
            { name: '21 to 50', value: 21 },
            { name: '51 to 200', value: 51 },
            { name: '201 to 1000', value: 201 },
            { name: '1000+', value: 1000 },
          ]"
          @keyup.enter.stop="emitEvent('submit')"
        />
      </div>

      <div class="my-8 text-center">
        <ElButton
          type="submit"
          btn="primary"
          :loading="sending"
        >
          Request A Demo &rarr;
        </ElButton>
      </div>
    </ElForm>
  </ElemModal>
</template>
