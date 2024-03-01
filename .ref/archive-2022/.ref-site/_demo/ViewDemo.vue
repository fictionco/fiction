<script lang="ts" setup>
import { reactive, ref } from 'vue'
import ElForm from '@factor/ui/ElForm.vue'
import ElInput from '@factor/ui/ElInput.vue'
import ElHoverArrow from '@kaption/ui/ElHoverArrow.vue'

const sending = ref(false)
const isValid = ref<boolean>(false)
const form = reactive({})
</script>

<template>
  <div class="overflow-hidden">
    <div
      class="relative mb-24 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-700"
    >
      <div
        class="absolute z-0 bottom-0 w-full bg-pattern-bottom-top-light bg-repeat-x overflow-hidden h-1/2"
      />

      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div
          class="relative py-20 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"
        >
          <div
            class="flex flex-col rounded-lg shadow-2xl bg-white p-10 overflow-hidden"
          >
            <h2
              class="text-center mt-4 font-bold text-sm uppercase text-primary-600 tracking-wide lg:text-left lg:-ml-2 lg:pl-2"
            >
              Kaption Experience Engine
            </h2>
            <h1 class="mt-4 text-4xl font-extrabold md:text-6xl">
              Get A Demo
            </h1>
            <p class="mt-6 text-lg text-slate-500 md:text-xl">
              Tell us a little about yourself and we'll answer any questions you
              have.
            </p>
            <ElForm
              v-model:valid="isValid"
              class="mt-4"
              :data="form"
              @submit="send()"
            >
              <ElInput
                v-model="form.email"
                input="text"
                placeholder="Work email"
                required
              />
              <ElInput
                v-model="form.name"
                input="text"
                placeholder="Full name"
                required
              />
              <ElInput
                v-model="form.phoneNumber"
                input="phone"
                placeholder="Phone number"
                required
              />

              <ElInput
                v-model="form.company"
                input="text"
                placeholder="Company name"
                required
              />
              <ElInput
                input="submit"
                :loading="sending"
                class="w-full md:text-lg"
              >
                Get a demo <ElHoverArrow size="large" />
              </ElInput>
            </ElForm>

            <div class="text-slate-500">
              By requesting a demo you agree to Kaption's Privacy Policy, and
              you consent to receive marketing communications from Kaption.
            </div>
          </div>

          <div class="mt-16 relative lg:mt-0" aria-hidden="true">
            <svg
              class="text-white w-12"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                transform="matrix(3.4285714285714284,0,0,3.4285714285714284,0,0)"
              >
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

            <h3 class="mt-8 text-2xl text-white font-bold max-w-sm">
              Organize and Automate
            </h3>
            <div class="mt-4 text-xl text-primary-300 max-w-md">
              Join companies from small business to enterprise who are using
              Kaption to power and optimize their customer experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
