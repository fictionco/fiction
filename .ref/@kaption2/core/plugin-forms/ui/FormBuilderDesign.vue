<script lang="ts" setup>
import { useKaption } from '../../utils/inject'
import ElOption from '../../ui/ElOption.vue'

const { kaptionForms, factorMedia } = useKaption()

const activeForm = kaptionForms.activeForm.value

const service = { factorMedia }
</script>

<template>
  <div v-if="activeForm" class="space-y-3 rounded-md bg-theme-50 p-4">
    <template v-for="(opt, ii) in activeForm.el.value.options" :key="ii">
      <ElOption
        v-bind="opt.props.value"
        v-model="activeForm.userConfig.value[opt.optionKey]"
        :option="opt"
        :service="service"
        class="form-settings-input"
      />
    </template>
  </div>
</template>

<style lang="less" scoped>
.form-setting-input {
  --input-size: 12px;
  --input-label-size: 11px;
  --input-bg: #ffffff;
}
</style>
