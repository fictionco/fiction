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
      <TestInput input-name="Overlay" :input-el="inputs.InputOverlay" />
      <TestInput input-name="Gradient" :input-el="inputs.InputGradient" />
      <TestInput
        input-name="Media Upload"
        :input-el="inputs.InputMediaUpload"
        :service="service"
      />
      <TestInput
        input-name="Media Library"
        :input-el="inputs.InputMediaLibrary"
        :service="service"
      />
      <TestInput
        input-name="Media Edit"
        :input-el="inputs.InputMediaEdit"
        :model-value="[
          {
            url: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
          },
          {
            url: 'https://images.unsplash.com/flagged/photo-1579268351234-073f85929562?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
          },
        ]"
      />
      <TestInput
        input-name="DropDown"
        :input-el="inputs.InputDropDown"
        :list="['apple', 'orange', 'pear']"
      />
      <TestInput input-name="Range" :input-el="inputs.InputRange" />
      <TestInput
        input-name="Color Scheme"
        :input-el="inputs.InputColorScheme"
      />
      <TestInput input-name="Font" :input-el="inputs.InputFont" />
      <TestInput input-name="Color Picker" :input-el="inputs.InputColor" />

      <TestInput input-name="Date" :input-el="inputs.InputDate" />
      <TestInput
        input-name="Yes / No"
        :input-el="inputs.InputMultipleChoice"
        :list="['yes', 'no']"
        max-select="1"
        select-letters="yn"
      />
      <TestInput
        input-name="Multiple Choice (Single)"
        :input-el="inputs.InputMultipleChoice"
        :list="['item 1', 'item 2', 'item 3']"
        max-select="1"
      />
      <TestInput
        input-name="Multiple Choice (Multiple)"
        :input-el="inputs.InputMultipleChoice"
        :list="['item 1', 'item 2', 'item 3']"
        max-select="100"
      />
      <TestInput
        input-name="Opinion Scale"
        :input-el="inputs.InputRating"
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
        :input-el="inputs.InputRating"
        :count-start="0"
        :count-end="10"
      />
      <TestInput
        input-name="Rating"
        :input-el="inputs.InputRating"
        :count-start="1"
        :count-end="5"
        icon="i-carbon-star"
      />

      <TestInput
        input-name="Ranking"
        :input-el="inputs.InputRanking"
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
        :input-el="inputs.InputRadio"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Radio Button"
        :input-el="inputs.InputRadioButton"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Select Multi"
        :input-el="inputs.InputSelectMulti"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Select Custom"
        :input-el="inputs.InputSelectCustom"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Select"
        :input-el="inputs.InputSelect"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Toggle"
        :input-el="inputs.InputToggle"
        text-on="Toggle On"
        text-off="Toggle Off"
      />
      <TestInput input-name="TimeZone" :input-el="inputs.InputTimezone" />
      <TestInput input-name="Price" :input-el="inputs.InputPrice" />
      <TestInput input-name="URL" :input-el="inputs.InputUrl" />
      <TestInput input-name="Email" :input-el="inputs.InputEmail" />
      <TestInput input-name="Number" :input-el="inputs.InputNumber" />
      <TestInput
        input-name="One Time Code"
        :input-el="inputs.InputOneTimeCode"
      />
      <TestInput input-name="Password" :input-el="inputs.InputPassword" />
      <TestInput input-name="Phone" :input-el="inputs.InputPhone" />
      <TestInput
        input-name="Checkbox"
        :input-el="inputs.InputCheckbox"
        text="Checkbox Label Text"
      />
      <TestInput
        input-name="Checkbox Multi"
        :input-el="inputs.InputCheckboxMulti"
        :list="['option 1', 'option 2', 'option 3']"
      />
      <TestInput
        input-name="Weight"
        :input-el="inputs.InputWeight"
        min="0"
        max="6"
      />
      <TestInput input-name="Text" :input-el="inputs.InputText" />
      <TestInput input-name="Textarea" :input-el="inputs.InputTextarea" />
    </form>
  </div>
</template>
<script lang="ts" setup>
import { colorStandard, ThemeColor, colors, vue } from "@factor/api"
import { inputs } from "@factor/ui"
import { useFactorService } from "../inject"
import TestInput from "./TestInput.vue"
const service = useFactorService()
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
