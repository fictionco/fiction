<script lang="ts" setup>
import ElTable from '@fiction/ui/ElTable.vue'
import type { FactorApp } from '@fiction/core'
import { getCrossVar, toLabel, useService } from '@fiction/core'

const { factorApp } = useService<{ factorApp: FactorApp }>()

const list = [
  {
    id: 'widget-port',
    value: getCrossVar('WIDGET_PORT'),
  },
  {
    id: 'server-port',
    value: getCrossVar('SERVER_PORT'),
  },
  {
    id: 'is-test',
    title: 'IS_TEST',
    value: getCrossVar('IS_TEST'),
  },
  {
    id: 'node-env',
    title: 'NODE_ENV',
    value: getCrossVar('NODE_ENV'),
  },
  { id: 'mode', title: 'MODE', value: getCrossVar('MODE') },
  {
    id: 'is-vite',
    title: 'IS_VITE',
    value: getCrossVar('IS_VITE'),
  },
  {
    id: 'app-name',
    value: factorApp.appName,
  },
  {
    id: 'app-email',
    value: factorApp.appEmail,
  },
  {
    id: 'app-url',
    value: factorApp.appUrl,
  },
]

const table = [
  ['---', 'Heading', 'Test', 'Foo', 'Bar'],
  ['123', 'Heading', 'Test', 'Foo', 'Bar'],
  ['223', 'Heading', 'Test', 'Foo', 'Bar'],
  [
    '223',
    'Heading',
    'Test',
    'Foo',
    'A bunch of text goes in this column. Looking pretty good.',
  ],
  [
    '223',
    'Heading',
    'Test',
    'A bunch of text goes in this column. Looking pretty good.',
    'Bar',
  ],
  [
    '223',
    'Heading',
    'A bunch of text goes in this column. Looking pretty good.',
    'Foo',
    'Bar',
  ],
  [
    '111',
    'A bunch of text goes in this column. Looking pretty good.',
    'Test',
    'Foo',
    'Bar',
  ],
]

function rowClick(id: string) {
  alert(id)
}
</script>

<template>
  <div class="space-y-6 p-12 text-center">
    <div
      v-for="(item, i) in list"
      :key="i"
      class="my-6"
    >
      <div class="text-theme-500 text-xs font-bold uppercase tracking-wider">
        {{ item.title || toLabel(item.id) }}
      </div>
      <div :id="item.id" class="text-sm font-bold">
        <span v-if="item.value" class="text-theme-800">{{ item.value }}</span>
        <span v-else class="text-red-500">[not set]</span>
      </div>
    </div>

    <div class="ui">
      <div class="m-auto max-w-3xl">
        <div class="my-12">
          <div
            class="text-theme-500 mb-4 text-xs font-bold uppercase tracking-wider"
          >
            Table
          </div>
          <div class="rounded-md p-4 ring-1 ring-slate-500/10">
            <ElTable
              :table="table"
              :total="33"
              :empty="{ title: 'test', description: '' }"
              :on-row-click="rowClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
