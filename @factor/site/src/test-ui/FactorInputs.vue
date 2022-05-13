<template>
  <div class="wrap">
    <div class="flex justify-center space-x-4 text-xs">
      <a
        v-for="(c, i) in colors"
        :key="i"
        class="cursor-pointer hover:opacity-60"
        @click.prevent="selectColor(c)"
        >{{ c }}</a
      >
    </div>
    <div class="input-area mx-auto my-12 max-w-lg rounded-md">
      <TestInput
        input-name="Radio"
        :input-el="InputRadio"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Radio Button"
        :input-el="InputRadioButton"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Select Multi"
        :input-el="InputSelectMulti"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Select Custom"
        :input-el="InputSelectCustom"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Select"
        :input-el="InputSelect"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Toggle"
        :input-el="InputToggle"
        text-on="Toggle On"
        text-off="Toggle Off"
      />
      <TestInput input-name="TimeZone" :input-el="InputTimezone" />
      <TestInput input-name="Price" :input-el="InputPrice" />
      <TestInput input-name="URL" :input-el="InputUrl" />
      <TestInput input-name="Email" :input-el="InputEmail" />
      <TestInput input-name="Number" :input-el="InputNumber" />
      <TestInput input-name="One Time Code" :input-el="InputOneTimeCode" />
      <TestInput input-name="Password" :input-el="InputPassword" />
      <TestInput input-name="Phone" :input-el="InputPhone" />
      <TestInput
        input-name="Checkbox"
        :input-el="InputCheckbox"
        text="Checkbox Label Text"
      />
      <TestInput
        input-name="Checkbox Multi"
        :input-el="InputCheckboxMulti"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput input-name="Weight" :input-el="InputWeight" min="0" max="6" />
      <TestInput input-name="Text" :input-el="InputText" />
      <TestInput input-name="Textarea" :input-el="InputTextarea" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { colorStandard, ThemeColor, colors, vue } from "@factor/api"
import { inputs } from "@factor/ui"
import TestInput from "./TestInput.vue"

const {
  InputWeight,
  InputText,
  InputTextarea,
  InputCheckbox,
  InputCheckboxMulti,
  InputUrl,
  InputEmail,
  InputNumber,
  InputOneTimeCode,
  InputPassword,
  InputPhone,
  InputToggle,
  InputSelect,
  InputTimezone,
  InputSelectMulti,
  InputSelectCustom,
  InputPrice,
  InputRadio,
  InputRadioButton,
} = inputs

const theme = vue.ref<ThemeColor>("sky")

const selectColor = (c: ThemeColor) => {
  theme.value = c
}

const input = vue.computed(() => {
  return {
    primary: colorStandard({ color: theme.value }),
    primaryText: colorStandard({ color: "white" }),
    edge: colorStandard({ color: theme.value, level: 300 }),
    edgeLight: colorStandard({ color: theme.value, level: 200 }),
    placeholder: colorStandard({ color: theme.value, level: 400 }),
    body: colorStandard({ color: theme.value, level: 600 }),
    bodyLight: colorStandard({ color: theme.value, level: 500 }),
    base: colorStandard({ color: theme.value, level: 50 }),
    baseAlt: colorStandard({ color: theme.value, level: 100 }),
  }
})
</script>
<style>
.input-area {
  --input-primary: v-bind("input.primary");
  --input-primary-text: v-bind("input.primaryText");
  --input-edge: v-bind("input.edge");
  --input-edge-light: v-bind("input.edgeLight");
  --input-placeholder: v-bind("input.placeholder");
  --input-body: v-bind("input.body");
  --input-body-light: v-bind("input.bodyLight");
  --input-base: v-bind("input.base");
  --input-base-alt: v-bind("input.baseAlt");
  --input-x: 8px;
  --input-y: 4px;
  --input-size: 0.9rem;
  --input-max-width: 300px;
}
</style>
