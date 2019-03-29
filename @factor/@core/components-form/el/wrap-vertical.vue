
<template>
  <div :key="renderKey" class="input-wrap-horizontal input-wrap">
    <div class="input-description">
      <label class="f-input-label" :class="[requiredClass]">
        <span v-if="label" class="label">{{ label }}</span>
      </label>
      <div v-if="description || $slots.description" class="f-input-desc">
        <slot v-if="$slots.description" name="description" />
        <span v-else v-formatted-text="description" />
      </div>
    </div>

    <div class="input-area">
      <div class="f-input">
        <component :is="input" v-if="input" :value="value" v-bind="$attrs" v-on="$listeners">
          <slot />
        </component>
        <template v-else>
          <slot />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: null, // any type
      default: () => {}
    },
    label: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, default: "" },
    input: { type: String, default: "" }
  },
  data() {
    return {
      inputClasses: []
    }
  },
  computed: {
    // Vue sometimes can cache this component and handle it incorrectly across views
    // http://michaelnthiessen.com/force-re-render/
    renderKey() {
      return this.$attrs["data-test"] ? this.$attrs["data-test"] : this.label
    },
    isRequired() {
      return typeof this.$attrs.required != "undefined" ||
        this.$attrs["input-min"]
        ? true
        : false
    },
    requiredClass() {
      return this.isRequired ? "is-required" : "is-optional"
    }
  },

  methods: {}
}
</script>

<style lang="less">
.input-wrap-horizontal {
  .custom-validity-input {
    position: absolute;
    height: 1px !important;
    width: 1px !important;
    left: 50%;
    bottom: 0;
    padding: 0;
    background-color: transparent !important;
    pointer-events: none !important;
    border: none !important;
    box-shadow: none !important;
    color: transparent;
  }
  &.input-wrap {
    margin: 0 0 1.5em;
    display: flex;
    flex-wrap: wrap;
    input:not([type="checkbox"]):not([type="radio"]):not([type="file"]),
    textarea,
    select {
      background-color: #f7f9ff;
      border-radius: 4px;
      width: 100%;
    }

    .input-description {
      flex-basis: 30%;
      min-width: 80px;
      margin-bottom: 0.7em;
    }
    .f-input-desc {
      font-size: 0.8em;
      font-style: italic;
      opacity: 0.4;
      font-weight: 500;
      margin: 0 auto 0.5em;
      line-height: 1.2;
    }
    .input-area {
      flex-basis: 70%;

      position: relative;
    }

    .f-input-label {
      &.no-label .input-status {
        width: auto;
      }
    }
  }
}
</style>
