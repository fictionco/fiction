<template>
  <div :key="renderKey" class="input-wrap" :class="[requiredClass, inputFormat]">
    <div v-if="label || description" class="input-meta">
      <label class="label-wrap">
        <span v-if="label" class="label" :class="labelClasses">{{ label }}</span>
      </label>
      <div v-if="description || $slots.description" class="description-wrap">
        <slot v-if="$slots.description" name="description" />
        <span v-else v-formatted-text="description" />
      </div>
    </div>

    <div class="input-area">
      <div class="the-input">
        <component
          :is="input"
          v-if="input"
          :value="value"
          v-bind="$attrs"
          :class="inputClasses"
          v-on="$listeners"
        />
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  factorInputWrap,
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
  factorInputSortable
} from "@factor/ui"

import { dashboardUserList } from "@factor/dashboard"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorInputWrap,
    factorInputEmail,
    factorInputDate,
    factorInputTags,
    factorInputEditor,
    factorInputText,
    factorInputPhone,
    factorInputCheckbox,
    factorInputBirthday,
    factorInputImageUpload,
    factorInputSelect,
    factorInputSubmit,
    factorInputPassword,
    factorInputTextarea,
    factorInputSortable,
    dashboardUserList
  },
  inheritAttrs: false,
  props: {
    value: {
      type: null, // any type
      default: () => {}
    },
    label: { type: String, default: "" },
    description: { type: String, default: "" },
    format: { type: String, default: "" },
    input: { type: String, default: "" },
    inputClasses: { type: String, default: "" },
    labelClasses: { type: String, default: "" }
  },
  computed: {
    // Vue sometimes can cache this component and handle it incorrectly across views
    // http://michaelnthiessen.com/force-re-render/
    renderKey(this: any) {
      return this.$attrs["data-test"] ? this.$attrs["data-test"] : this.label
    },
    isRequired(this: any) {
      return typeof this.$attrs.required != "undefined" || this.$attrs["input-min"]
        ? true
        : false
    },
    requiredClass(this: any) {
      return this.isRequired ? "is-required" : "is-optional"
    },
    inputFormat(this: any) {
      return this.format ? this.format : "vertical"
    }
  },

  methods: {}
})
</script>

<style lang="less">
.input-wrap {
  .label {
    font-size: 0.9em;
  }
  .description-wrap {
    margin-bottom: 0.7em;
    font-size: 0.9em;
    opacity: 0.5;
    margin: 0 auto 0.5em;
    line-height: 1.35;
  }
  .input-area {
    position: relative;
  }

  &.horizontal,
  &.vertical {
    margin: 0 0 1.25em;
  }

  &.vertical {
    .input-meta {
      margin-bottom: 0.5em;
    }
  }

  &.horizontal {
    display: grid;
    grid-template-columns: minmax(80px, 1fr) 3fr;
    grid-column-gap: 1em;
    .input-meta {
      opacity: 0.7;
      text-align: right;
      .label {
        line-height: 1.2;
        display: block;
      }
    }
  }
}
</style>
