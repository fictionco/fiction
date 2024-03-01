<script lang="ts" setup>
import { vue } from '@factor/api'
import type { Form } from '../form'

const props = defineProps({
  form: {
    type: Object as vue.PropType<Form>,
    required: true,
  },
})

const elProps = vue.computed(() => {
  const p = props.form.el.value.props
  return p
})
</script>

<template>
  <div class="kaption-form-theme">
    <component
      :is="form.el.value.component"
      v-bind="elProps"
      :form="form"
    />
  </div>
</template>
