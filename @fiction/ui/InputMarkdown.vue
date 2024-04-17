<script lang="ts" setup>
import { isNode, vue, waitFor } from '@fiction/core'
import { twMerge } from 'tailwind-merge'

import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import JsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

const props = defineProps({
  modelValue: { type: String, default: '' },
  rows: { type: Number, default: 1 },
  inputClass: { type: String, default: '' },
  maxHeight: { type: Number, default: 1000 }, // New prop for max height
})
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const editorEl = vue.ref<HTMLElement | null>(null)

vue.onMounted(async () => {
  if (isNode())
    return

  const monaco = await import('monaco-editor')
  const el = editorEl.value

  if (!el)
    return

  // eslint-disable-next-line no-restricted-globals
  self.MonacoEnvironment = {
    getWorker(workerId, label) {
      switch (label) {
        case 'json':
          return new JsonWorker()
        case 'css':
        case 'scss':
        case 'less':
          return new CssWorker()
        case 'html':
        case 'handlebars':
        case 'razor':
          return new HtmlWorker()
        case 'typescript':
        case 'javascript':
          return new JsWorker()
        default:
          return new EditorWorker()
      }
    },
  }

  let lastQueryTime = 0
  // Define the completion item provider with explicit types
  monaco.languages.registerInlineCompletionsProvider('markdown', {
    async provideInlineCompletions(model, position) {
      const currentTime = Date.now()

      // Check if 5 seconds have passed since the last query:
      if (currentTime - lastQueryTime < 500)
        return null // Suppress completions

      const characterBeforePosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column - 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })

      let modelIsDirty = false
      model.onDidChangeContent(() => (modelIsDirty = true))

      await waitFor(300)

      const hasTriggerChar = [' ', '.'].includes(characterBeforePosition)
      const isNewLine = position.column

      if ((isNewLine || hasTriggerChar) && !modelIsDirty) {
        await new Promise(resolve => setTimeout(resolve, 500))

        console.warn('------query------', characterBeforePosition)

        lastQueryTime = currentTime // Update last query time

        return { items: [{ insertText: '------completion------' }] }
      }
      else {
        return null // Return null to indicate no completions
      }
    },
    freeInlineCompletions() {},
  })

  // const varnameValue = getComputedStyle(el).getPropertyValue('--input-bg')
  // console.log('varnameValue', varnameValue)
  monaco.editor.defineTheme('fictionTheme', {
    base: 'vs',
    inherit: true,
    colors: {
      'editor.background': 'var(--input-bg)',
    },
    rules: [],
  })

  const editor = monaco.editor.create(el, {
    theme: 'vs-dark',
    language: 'markdown',
    lineNumbers: 'off',
    glyphMargin: false, // Disable the glyph margin
    folding: false, // Disable the folding option
    minimap: { enabled: false }, // Disable the minimap
    scrollbar: {
      vertical: 'hidden', // Hide the vertical scrollbar if you want
      horizontal: 'hidden', // Hide the horizontal scrollbar if you want
    },
    wordWrap: 'bounded',
    wrappingIndent: 'same',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    padding: { top: 7, bottom: 7 },
    quickSuggestionsDelay: 200,
    quickSuggestions: {
      other: 'inline',
      comments: true,
      strings: true,
    },
    inlineSuggest: { enabled: true },
    fontFamily: 'var(--font-family-mono)',
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    guides: { indentation: false },
    renderLineHighlight: 'none',
    automaticLayout: true,
  })

  editor.onDidChangeModelContent(() => {
    // editor.layout()
    if (props.modelValue !== editor.getValue())
      emit('update:modelValue', editor.getValue())
  })

  vue.watch(
    () => props.modelValue,
    (v) => {
      if (v !== editor.getValue())
        editor.setValue(v)
    },
    { immediate: true },
  )
})

function _send(el: EventTarget | null): void {
  const elem = el as HTMLInputElement
  const txt = elem.value
  emit('update:modelValue', txt)
}

const cls = vue.computed(() => twMerge(`medit h-[200px] rounded-md border-theme-300 dark:hover:border-theme-500 dark:focus:border-theme-500 dark:border-theme-600 border overflow-hidden bg-theme-100 dark:bg-theme-800 ${props.inputClass}`))
</script>

<template>
  <div ref="editorEl" :class="cls" />
</template>

<style lang="less">
.monaco-editor {
  --input-bg: red;
  --vscode-editor-background: var(--theme-800) !important;
  --vscode-editorGutter-background:  var(--theme-800) !important;
  --vscode-focusBorder: transparent !important;

}
</style>
