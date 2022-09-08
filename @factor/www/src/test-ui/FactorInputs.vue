<template>
  <div class="wrap">
    <div class="space-y-2">
      <div class="flex justify-center space-x-4 text-xs">
        <a
          v-for="(c, i) in colors"
          :key="i"
          class="cursor-pointer hover:opacity-60"
          @click.prevent="selectColor(c)"
          >{{ c }}</a
        >
      </div>

      <div class="flex justify-center space-x-4 text-xs">
        <a
          v-for="(c, i) in inputSizes"
          :key="i"
          class="cursor-pointer hover:opacity-60"
          @click.prevent="selectSize(c)"
          >{{ c }}</a
        >
      </div>
    </div>
    <form class="input-area mx-auto my-12 max-w-[50em] rounded-md">
      <TestInput input-name="Color Scheme" :input-el="InputColorScheme" />
      <TestInput input-name="Font" :input-el="InputFont" />
      <TestInput input-name="Color Picker" :input-el="InputColor" />
      <TestInput input-name="Media Upload" :input-el="InputMediaUpload" />
      <TestInput input-name="Media Library" :input-el="InputMediaLibrary" />
      <TestInput input-name="Date" :input-el="InputDate" />
      <TestInput
        input-name="Yes / No"
        :input-el="InputMultipleChoice"
        :list="['yes', 'no']"
        max-select="1"
        select-letters="yn"
      />
      <TestInput
        input-name="Multiple Choice (Single)"
        :input-el="InputMultipleChoice"
        :list="['item 1', 'item 2', 'item 3']"
        max-select="1"
      />
      <TestInput
        input-name="Multiple Choice (Multiple)"
        :input-el="InputMultipleChoice"
        :list="['item 1', 'item 2', 'item 3']"
        max-select="100"
      />
      <TestInput
        input-name="Opinion Scale"
        :input-el="InputRating"
        :count-start="0"
        :count-end="10"
        :labels="{
          start: 'Not at all likely',
          center: 'Neutral',
          end: 'Very likely',
        }"
      />
      <TestInput
        input-name="NPS"
        :input-el="InputRating"
        :count-start="0"
        :count-end="10"
      />
      <TestInput
        input-name="Rating"
        :input-el="InputRating"
        :count-start="1"
        :count-end="5"
        icon="i-carbon-star"
      />

      <TestInput
        input-name="Ranking"
        :input-el="InputRanking"
        :list="[
          'item 1',
          'item 2',
          'another item',
          'really long item title name, that i think is too long',
          'yet',
          'another',
          'item 10',
        ]"
      />

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
    </form>
  </div>
</template>
<script lang="ts" setup>
import { colorStandard, ThemeColor, colors, vue } from "@factor/api"
import { inputs } from "@factor/ui"
import TestInput from "./TestInput.vue"

const {
  InputColor,
  InputDate,
  InputRating,
  InputRanking,
  InputMultipleChoice,
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
  InputMediaLibrary,
  InputMediaUpload,
  InputFont,
  InputColorScheme,
} = inputs

const inputSizes = ["base", "lg", "xl", "2xl", "3xl"]
const selectSize = (c: typeof inputSizes[number]) => {
  inputSizing.value = c
}

const inputSizing = vue.ref<typeof inputSizes[number]>("base")

const themeColor = vue.ref<ThemeColor>("slate")

const selectColor = (c: ThemeColor) => {
  themeColor.value = c
}

const sizing = vue.computed(() => {
  let out = {
    inputX: "calc(var(--input-size) * .65)",
    inputY: "calc(var(--input-size) * .3)",
    inputSize: ".9rem",
    inputMaxWidth: "25rem",
  }

  if (inputSizing.value == "lg") {
    out = {
      ...out,
      inputSize: "1.2rem",
    }
  }

  if (inputSizing.value == "xl") {
    out = {
      ...out,
      inputSize: "1.5rem",
    }
  }
  if (inputSizing.value == "2xl") {
    out = {
      ...out,
      inputSize: "2rem",
    }
  }
  if (inputSizing.value == "3xl") {
    out = {
      ...out,
      inputSize: "2.5rem",
    }
  }

  return out
})

const theme = vue.computed(() => {
  const levels = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const
  const obj = Object.fromEntries(
    levels.map((level) => [
      level,
      colorStandard({ color: themeColor.value, level }),
    ]),
  ) as Record<typeof levels[number], string>
  return {
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
  }
})
</script>
<style>
.input-area {
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
  --input-x: calc(0.6 * v-bind("sizing.inputSize"));
  --input-y: calc(0.3 * v-bind("sizing.inputSize"));
  --input-size: v-bind("sizing.inputSize");
  --input-max-width: calc(25 * v-bind("sizing.inputSize"));
}
</style>
