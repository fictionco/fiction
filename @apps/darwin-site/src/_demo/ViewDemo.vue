<template>
  <div class="overflow-hidden">
    <div
      class="
        relative
        mb-24
        bg-gradient-to-r
        from-primary-400
        via-primary-500
        to-primary-700
      "
    >
      <div
        class="
          absolute
          z-0
          bottom-0
          w-full
          bg-pattern-bottom-top-light bg-repeat-x
          overflow-hidden
          h-1/2
        "
      />

      <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div
          class="
            relative
            py-20
            lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center
          "
        >
          <div
            class="
              flex flex-col
              rounded-lg
              shadow-2xl
              bg-white
              p-10
              overflow-hidden
            "
          >
            <h2
              class="
                text-center
                mt-4
                font-medium
                uppercase
                text-primary-600
                tracking-wide
                lg:text-left lg:border-yellow-500 lg:border-l-2 lg:-ml-2 lg:pl-2
              "
            >
              Request Consultation
            </h2>
            <h1 class="mt-4 text-4xl font-bold md:text-5xl">
              Let's Grow Your Conversions!
            </h1>
            <p class="mt-6 text-lg text-bluegray-500 md:text-xl">
              Tell us a little about yourself and we'll answer any questions you
              have.
            </p>
            <ElemForm
              v-model:valid="isValid"
              class="mt-4"
              :data="form"
              @submit="send()"
            >
              <ElemInput
                v-model="form.email"
                input="text"
                placeholder="Work email"
                required
              />
              <ElemInput
                v-model="form.fullname"
                input="text"
                placeholder="Full name"
                required
              />
              <ElemInput
                v-model="form.phone"
                input="phone"
                placeholder="Phone number"
                required
              />

              <ElemInput
                v-model="form.company"
                input="text"
                placeholder="Company name"
                required
              />
              <ElemInput
                input="submit"
                :loading="sending"
                class="w-full md:text-lg"
              >
                Get a demo <ElemHoverArrow size="large" />
              </ElemInput>
            </ElemForm>

            <div class="text-bluegray-500">
              By requesting a demo you agree to Darwin's Privacy Policy, and you
              consent to receive marketing communications from Darwin.
            </div>
          </div>

          <div class="mt-16 relative lg:mt-0" aria-hidden="true">
            <svg
              class="w-36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130 130"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M130 65c0 35.899-29.102 65-65 65-35.899 0-65-29.101-65-65C0 29.102 29.101 0 65 0c35.898 0 65 29.102 65 65zm-18 0c0 25.958-21.043 47-47 47-25.958 0-47-21.042-47-47 0-25.957 21.042-47 47-47 25.957 0 47 21.043 47 47z"
                fill="#fff"
                fill-opacity=".08"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M111.83 65c0 25.958-21.043 47-47 47s-47-21.042-47-47c0-25.957 21.042-47 47-47 25.957 0 47 21.043 47 47zm-18 0c0 16.016-12.984 29-29 29s-29-12.984-29-29 12.984-29 29-29 29 12.984 29 29z"
                fill="#fff"
                fill-opacity=".16"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M57.01 69.891h12.32c.92 0 1.462-.353 1.822-.8.463-.624.71-1.395.696-2.185.009-.889-.26-1.644-.658-2.13-.352-.424-.923-.82-2.006-.82h-13.93c-.664 0-1.23-.191-1.595-.343a6.967 6.967 0 01-1.109-.6 11.7 11.7 0 01-1.938-1.62 11.302 11.302 0 01-1.675-2.175c-.444-.77-.937-1.887-.937-3.175V53h21.184c3.54 0 6.936 1.475 9.44 4.1 2.503 2.626 3.91 6.187 3.91 9.9s-1.407 7.274-3.91 9.9c-2.504 2.625-5.9 4.1-9.44 4.1h-4.933c-2.403 0-4.237-1.704-5.235-2.977a10.657 10.657 0 01-1.393-2.328 7.066 7.066 0 01-.627-2.775l.015-3.029zm-4.494-10.804c.972 1.035 2.132 1.826 2.739 1.826h13.93c7.544 0 7.254 12.022.144 12.022h-9.431v.021c.003.825.508 2.012 1.271 3.022.827 1.093 1.956 1.979 3.082 1.979h4.933c2.771 0 5.428-1.155 7.388-3.21 1.959-2.054 3.06-4.841 3.06-7.747 0-2.906-1.101-5.693-3.06-7.747-1.96-2.055-4.617-3.21-7.388-3.21H50.902c0 .944.725 2.097 1.614 3.044z"
                fill="#fff"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M53.92 69.04c-1.155-2.016-2.003-4.566-2.003-6.605h2.902c0 1.309.604 3.323 1.588 5.037.405.74.917 1.409 1.517 1.984.526.472.9.588 1.103.588v3.043c-1.172 0-2.197-.609-2.992-1.324a11.184 11.184 0 01-2.115-2.724z"
                fill="#fff"
              />
            </svg>

            <h3 class="mt-8 text-2xl text-white font-bold max-w-sm">
              See how Darwin can get you massive conversions
            </h3>
            <div class="mt-4 text-xl text-primary-300 max-w-md">
              Join companies from small business to enterprise who are using
              Darwin to power and optimize for more conversions.
            </div>
            <div v-if="isDev()" class="my-16 mx-auto grid grid-cols-3 gap-8">
              <div class="flex items-center justify-center">
                <img
                  class="h-12"
                  src="https://tailwindui.com/img/logos/tuple-logo-indigo-300.svg"
                  alt="Tuple"
                />
              </div>
              <div class="flex items-center justify-center">
                <img
                  class="h-12"
                  src="https://tailwindui.com/img/logos/mirage-logo-indigo-300.svg"
                  alt="Mirage"
                />
              </div>
              <div class="flex items-center justify-center">
                <img
                  class="h-12"
                  src="https://tailwindui.com/img/logos/statickit-logo-indigo-300.svg"
                  alt="StaticKit"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive } from "vue"
import { isDev } from "@factor/api"
import ElemForm from "@factor/ui/ElemForm.vue"
import ElemInput from "@factor/ui/ElemInput.vue"
import ElemHoverArrow from "../_global/ElemHoverArrow.vue"
//import FigureBusinessGrowth from "../_global/FigureBusinessGrowth.vue"

export default {
  components: {
    ElemForm,
    ElemInput,
    ElemHoverArrow,
    // FigureBusinessGrowth,
  },
  setup() {
    const sending = ref(false)
    const sent = ref(false)
    const isValid = ref<boolean>(false)
    const form = reactive({})

    return { isDev, sending, sent, isValid, form }
  },
}
</script>
