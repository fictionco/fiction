<script lang="ts" setup>
import ElemForm from '@factor/ui/ElemForm.vue'
import ElemInput from '@factor/ui/ElemInput.vue'
import { ref } from 'vue'
import ElemBox from '../el/ElemBox.vue'

const form = ref({})
</script>

<template>
  <ElemBox title="Variant Settings">
    <ElemForm>
      <ElemInput
        v-model="form.variantName"
        input="text"
        label="Variant Name"
        description="Used to track and display analytics results."
        required
      />

      <ElemInput
        v-model="form.variantName"
        input="text"
        label="Variant Description"
        description="The purpose or idea behind this variant."
        required
      />
    </ElemForm>
  </ElemBox>
</template>
