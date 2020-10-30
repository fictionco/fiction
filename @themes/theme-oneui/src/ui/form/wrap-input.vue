<template lang="pug">
  .form-group.form-input-wrap
    label.d-block(v-if="label" v-text="label")
    .bv-no-focus-ring
      component(:is="input"  v-if="input" :value="value" v-bind="$attrs" :class="inputClasses" v-on="$listeners")
      slot
    .details( v-if="description || $slots.description" )
      slot(v-if="$slots.description" name="description")
      p(v-text="description")
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator"
import {
  factorInputEmail,
  factorInputDate,
  factorInputText,
  factorInputTags,
  factorInputPhone,
  factorInputCheckbox,
  factorInputBirthday,
  factorInputImageUpload,
  factorInputSelect,
  factorInputSubmit,
  factorInputPassword,
  factorInputTextarea,
  factorInputEditor,
  factorInputSortable,
  dashboardUserList,
} from "@factor/ui"

import { applyFilters } from "@factor/api"

const inputs = applyFilters("ui-form-inputs", {
  factorInputEmail,
  factorInputDate,
  factorInputText,
  factorInputTags,
  factorInputPhone,
  factorInputCheckbox,
  factorInputBirthday,
  factorInputImageUpload,
  factorInputSelect,
  factorInputSubmit,
  factorInputPassword,
  factorInputTextarea,
  factorInputEditor,
  factorInputSortable,
})

@Component({
  components: {
    dashboardUserList,
    ...inputs,
  },
  inheritAttrs: false,
})
export default class OneUiInputWrap extends Vue {
  @Prop({ default: () => {} }) readonly value: any
  @Prop({ default: "" }) readonly label?: string
  @Prop({ default: "" }) readonly description?: string
  @Prop({ default: "" }) readonly format?: string
  @Prop({ default: "" }) readonly input?: string
  @Prop({ default: "" }) readonly inputClasses?: string
  @Prop({ default: "" }) readonly labelClasses?: string
  @Prop({ default: () => true }) readonly show?: () => boolean
  @Prop({ default: () => {} }) readonly values?: any

  get renderKey() {
    return this.$attrs["data-test"] ? this.$attrs["data-test"] : this.label
  }
  get isRequired() {
    return typeof this.$attrs.required != "undefined" || this.$attrs["input-min"]
      ? true
      : false
  }
  get requiredClass() {
    return this.isRequired ? "is-required" : "is-optional"
  }
  get inputFormat() {
    return this.format ? this.format : "vertical"
  }
}
</script>

<style lang="less">
.form-input-wrap {
  .details {
    font-size: 12px;
    font-style: italic;
  }
}
</style>
