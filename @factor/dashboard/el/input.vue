<template>
  <factor-input-wrap class="dashboard-input" v-bind="$attrs" v-on="$listeners">
    <slot />
  </factor-input-wrap>
</template>
<script lang="ts">
import { factorInputWrap } from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: { factorInputWrap }
})
</script>

<style lang="less">
.dashboard-input {
  ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    color: var(--color-placeholder);
  }

  .input-wrap {
    max-width: 100%;
  }

  input,
  select,
  textarea {
    resize: none;
    border: 0;
    font-size: 1em;
    box-shadow: none;
    padding: 0;
    width: 25em;
    max-width: 100%;
  }

  button,
  select,
  input,
  textarea,
  select,
  .checkbox-label {
    font-family: var(--font-family-primary);
  }

  input[type="email"],
  input[type="password"],
  input[type="search"],
  input[type="tel"],
  input[type="text"],
  textarea,
  select {
    -webkit-appearance: none;
    background-color: var(--input-bg);
    box-shadow: inset var(--box-shadow-input);
    border-radius: 4px;
  }

  input,
  textarea {
    line-height: 1.2;
  }

  [type="checkbox"],
  [type="radio"] {
    margin: 0;
    width: auto;
    display: inline-block;
    box-shadow: none;
  }

  input,
  textarea,
  select {
    display: inline-block;
    padding: 0.5em;
    font-size: 1em;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    overflow: hidden;
    border: 0;
    font-weight: 500;
    color: var(--color-text);

    &.disabled {
      opacity: 0.5;
    }

    &.dropdown,
    &.toggle,
    &.range {
      border: 0;

      &:hover,
      &:focus {
        border: none;
      }
    }

    &::placeholder {
      /* Chrome/Opera/Safari */
      color: var(--color-placeholder);
    }
  }

  .image-upload-input {
    .validity {
      position: absolute;
      height: 0;
      width: 0;
      left: 50%;
    }

    flex-basis: 100%;
    max-width: 100%;
    position: relative;
  }
  .image-item {
    position: relative;

    display: block;
    &.sort-img {
      cursor: grab;
    }

    .image-item-pad {
      width: 100%;
      height: 100%;
    }
  }

  .image-item-content {
    box-shadow: inset var(--box-shadow-input);

    background-color: var(--input-bg);

    &.preprocess {
      background-color: var(--color-text);
    }
  }
  .image-drop .image-item-content {
    color: var(--color-placeholder);
    background-color: var(--input-bg);
    box-shadow: inset var(--box-shadow-input);
  }

  .sortable-items {
    .controls {
      .sortable-item {
        box-shadow: var(--box-shadow-input);

        &.active {
          background: var(--canvas-bg);
        }
      }
    }

    .inputs {
      box-shadow: var(--box-shadow-input);
    }
  }

  .el-tag {
    box-shadow: var(--box-shadow-input);
  }
}
</style>
