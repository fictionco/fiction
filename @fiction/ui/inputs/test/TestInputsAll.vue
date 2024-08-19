<script lang="ts" setup>
import { useService } from '@fiction/core'
import { InputOption, inputs } from '..'
import XButton from '../../buttons/XButton.vue'
import TestInput from './TestInput.vue'

const service = useService()

function toggleDarkMode() {
  const body = document.body
  if (body.classList.contains('dark')) {
    body.classList.remove('dark')
    body.classList.add('light')
  }
  else {
    body.classList.remove('light')
    body.classList.add('dark')
  }
}
</script>

<template>
  <div id="test-inputs" class="wrap py-12 bg-theme-0 dark:bg-theme-950 text-theme-800 dark:text-theme-0">
    <div class="mb-4 sticky top-0 p-4 bg-theme-0 dark:bg-theme-900 z-10 border-b border-theme-200 dark:border-theme-700">
      <div class="max-w-screen-2xl mx-auto flex gap-4">
        <XButton @click="toggleDarkMode">
          Toggle Dark Mode
        </XButton>
      </div>
    </div>

    <form class="input-area mx-auto p-12 rounded-md">
      <TestInput input-name="Text" :input-el="inputs.InputText" />
      <TestInput input-name="Textarea" :input-el="inputs.InputTextarea" />
      <TestInput input-name="Price" :input-el="inputs.InputPrice" />
      <TestInput input-name="URL" :input-el="inputs.InputUrl" />
      <TestInput input-name="Email" :input-el="inputs.InputEmail" />
      <TestInput input-name="Number" :input-el="inputs.InputNumber" />
      <TestInput input-name="One Time Code" :input-el="inputs.InputOneTimeCode" />
      <TestInput input-name="Password" :input-el="inputs.InputPassword" />
      <TestInput input-name="Phone" :input-el="inputs.InputPhone" />
      <TestInput input-name="Font" :input-el="inputs.InputFont" />
      <TestInput input-name="Add Items" :input-el="inputs.InputItems" />
      <TestInput
        input-name="Username"
        :input-el="inputs.InputUsername"
        before-input="https://"
        after-input=".test.com"
        table="fiction_user"
        column="username"
      />

      <TestInput input-name="Media Upload" :input-el="inputs.InputMediaUpload" :service="service" />
      <TestInput input-name="Select" :input-el="inputs.InputSelect" :list="['option 1', 'option 2', 'option 3']" />
      <TestInput input-name="Range" :input-el="inputs.InputRange" />
      <TestInput input-name="Color Scheme" :input-el="inputs.InputColorScheme" />

      <TestInput input-name="Color Picker" :input-el="inputs.InputColor" />
      <TestInput input-name="Date" :input-el="inputs.InputDate" />
      <TestInput
        input-name="Yes / No"
        :input-el="inputs.InputMultipleChoice"
        :list="['yes', 'no']"
        max-select="1"
        select-letters="yn"
      />
      <TestInput input-name="Multiple Choice (Single)" :input-el="inputs.InputMultipleChoice" :list="['item 1', 'item 2', 'item 3']" max-select="1" />
      <TestInput input-name="Multiple Choice (Multiple)" :input-el="inputs.InputMultipleChoice" :list="['item 1', 'item 2', 'item 3']" max-select="100" />
      <TestInput
        input-name="Opinion Scale"
        :input-el="inputs.InputRating"
        :count-start="0"
        :count-end="10"
        :labels="{ low: 'Not at all likely', middle: 'Neutral', high: 'Very likely' }"
      />
      <TestInput input-name="NPS" :input-el="inputs.InputRating" :count-start="0" :count-end="10" />
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
        :list="['item 1', 'item 2', 'another item', 'really long item title name, that i think is too long', 'yet', 'another', 'item 10']"
      />

      <TestInput input-name="Radio" :input-el="inputs.InputRadio" :list="['option 1', 'option 2', 'option 3']" />
      <TestInput input-name="Radio Button" :input-el="inputs.InputRadioButton" :list="['option 1', 'option 2', 'option 3']" />
      <TestInput input-name="Select Custom" :input-el="inputs.InputSelectCustom" :list="['option 1', 'option 2', 'option 3']" />
      <TestInput input-name="Toggle" :input-el="inputs.InputToggle" text-on="Toggle On" text-off="Toggle Off" />
      <TestInput input-name="TimeZone" :input-el="inputs.InputTimezone" />
      <TestInput input-name="Weight" :input-el="inputs.InputWeight" min="0" max="6" />
      <TestInput input-name="Checkbox" :input-el="inputs.InputCheckbox" text="Checkbox Label Text" />
      <TestInput input-name="Checkbox Multi" :input-el="inputs.InputCheckboxMulti" :list="['option 1', 'option 2', 'option 3']" />

      <TestInput input-name="Markdown" :input-el="inputs.InputMarkdown" />
      <TestInput
        input-name="Array List (Media)"
        :input-el="inputs.InputList"
        :service="service"
        :options="[
          new InputOption({ label: 'Text', input: 'InputText', key: 'text' }),
          new InputOption({ label: 'Media Display', input: 'InputMediaDisplay', key: 'media' }),
          new InputOption({ label: 'Overlays', input: 'InputList', key: 'overlays', options: [new InputOption({ label: 'Media Display', input: 'InputMediaDisplay', key: 'media' })] })]"
      />
      <TestInput input-name="Overlay" :input-el="inputs.InputOverlay" />

      <TestInput input-name="Gradient" :input-el="inputs.InputGradient" />
      <TestInput input-name="DropDown" :input-el="inputs.InputDropDown" :list="['apple', 'orange', 'pear']" />
    </form>
  </div>
</template>

<style>

</style>
