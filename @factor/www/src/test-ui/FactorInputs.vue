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
        input-name="Ranking"
        :input-el="InputRanking"
        :list="['item 1', 'item 2']"
      />
      <TestInput input-name="Media" :input-el="InputMedia" />
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
  InputRanking,
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
  InputMedia,
} = inputs

const themeColor = vue.ref<ThemeColor>("slate")

const selectColor = (c: ThemeColor) => {
  themeColor.value = c
}

const theme = vue.computed(() => {
  const levels = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
  const obj = Object.fromEntries(
    levels.map((level) => [
      level,
      colorStandard({ color: themeColor.value, level }),
    ]),
  ) as Record<typeof levels[number], string>
  return {
    primary: colorStandard({ color: themeColor.value }),
    primaryText: colorStandard({ color: "white" }),
    base: colorStandard({ color: themeColor.value, level: 50 }),
    edge: colorStandard({ color: themeColor.value, level: 300 }),
    edgeLight: colorStandard({ color: themeColor.value, level: 200 }),
    placeholder: colorStandard({ color: themeColor.value, level: 400 }),
    body: colorStandard({ color: themeColor.value, level: 600 }),
    bodyLight: colorStandard({ color: themeColor.value, level: 500 }),
    level0: obj[0],
    level50: obj[50],
    level100: obj[100],
    level200: obj[200],
    level300: obj[300],
    level400: obj[400],
    level500: obj[500],
    level600: obj[600],
    level700: obj[700],
    level800: obj[800],
    level900: obj[900],
    primary0: obj[0],
    primary50: obj[50],
    primary100: obj[100],
    primary200: obj[200],
    primary300: obj[300],
    primary400: obj[400],
    primary500: obj[500],
    primary600: obj[600],
    primary700: obj[700],
    primary800: obj[800],
    primary900: obj[900],
  }
})
</script>
<style>
.input-area {
  --theme-primary: v-bind("theme.primary");
  --theme-primary-text: v-bind("theme.primaryText");
  --theme-base: v-bind("theme.base");
  --theme-0: v-bind("theme.level0");
  --theme-50: v-bind("theme.level50");
  --theme-100: v-bind("theme.level100");
  --theme-200: v-bind("theme.level200");
  --theme-300: v-bind("theme.level300");
  --theme-400: v-bind("theme.level400");
  --theme-500: v-bind("theme.level500");
  --theme-600: v-bind("theme.level600");
  --theme-700: v-bind("theme.level700");
  --theme-800: v-bind("theme.level800");
  --theme-900: v-bind("theme.level900");
  --primary-0: v-bind("theme.primary0");
  --primary-50: v-bind("theme.primary50");
  --primary-100: v-bind("theme.primary100");
  --primary-200: v-bind("theme.primary200");
  --primary-300: v-bind("theme.primary300");
  --primary-400: v-bind("theme.primary400");
  --primary-500: v-bind("theme.primary500");
  --primary-600: v-bind("theme.primary600");
  --primary-700: v-bind("theme.primary700");
  --primary-800: v-bind("theme.primary800");
  --primary-900: v-bind("theme.primary900");
  --theme-edge-light: v-bind("theme.edgeLight");
  --theme-placeholder: v-bind("theme.placeholder");
  --theme-body: v-bind("theme.body");
  --theme-body-light: v-bind("theme.bodyLight");
  --theme-base: v-bind("theme.base");
  --input-x: 8px;
  --input-y: 4px;
  --input-size: 0.9rem;
  --input-max-width: 300px;
}
</style>
