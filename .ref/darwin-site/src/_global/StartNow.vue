<template>
  <ElemForm @submit="sendToRegister()">
    <div class="flex space-x-4">
      <InputDomain
        v-model="domain"
        class="w-full text-xl"
        autocomplete="url"
        required
      />
      <ElemButton btn="primary" size="lg" class="flex-shrink-0" input="submit">
        <span class="hidden lg:inline">View My Dashboard &rarr;</span>
        <span class="inline lg:hidden">Start</span>
      </ElemButton>
    </div>
    <div class="text-xs mt-3 text-bluegray-400">
      Enter your website URL &middot; Darwin is Free &middot; No credit card
      required
    </div>
  </ElemForm>
</template>
<script lang="ts">
import ElemForm from "@factor/ui/ElemForm.vue"
import InputDomain from "@factor/ui/InputDomain.vue"
import ElemButton from "../el/ElemButton.vue"
import { useRouter } from "vue-router"
import { ref } from "vue"
export default {
  components: {
    InputDomain,
    ElemForm,
    ElemButton,
  },
  setup: () => {
    const showInput = ref(false)
    const domain = ref("")

    const router = useRouter()
    const sendToRegister = (): void => {
      if (domain.value) {
        window.location.href = `https://app.darwin.so/register?domain=${domain.value}`
      }
    }

    return { router, sendToRegister, domain, showInput }
  },
}
</script>
