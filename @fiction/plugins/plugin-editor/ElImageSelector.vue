<script lang="ts" setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

function increase() {

    }
</script>

<template>
  <NodeViewWrapper class="vue-component">
    <div class="bg-theme-50 border border-theme-200 dark:bg-theme-800 dark:border-theme-700 rounded-lg">
      <span class="label">Vue Component</span>

      <div class="content">
        <button @click="increase">
          This button has been clicked  times.
        </button>
      </div>
    </div>
  </NodeViewWrapper>
</template>
