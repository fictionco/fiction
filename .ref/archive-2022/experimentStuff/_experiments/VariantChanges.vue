<script lang="ts">
import type { PropType } from 'vue'
import { ref, watch } from 'vue'
import type { ChangeRecord, FrameChangeElement } from '@kaption/types'

export default {
  components: {},
  props: {
    list: { type: Array as PropType<ChangeRecord[]>, default: () => {} },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const editIndex = ref(-1)
    const editChange = (item: ChangeRecord, ind: number) => {
      editIndex.value = ind === editIndex.value ? -1 : ind
    }
    watch(
      () => props.list,
      () => (editIndex.value = -1),
    )

    const addAttr = (item: FrameChangeElement): void => {
      if (!item.attrs)
        item.attrs = []
      item.attrs?.push({ name: '', value: '' })
    }

    const removeAttr = (item: FrameChangeElement, ii: number): void => {
      item.attrs?.splice(ii, 1)
      emit('update')
    }
    return { editChange, editIndex, addAttr, removeAttr }
  },
}
</script>

<template>
  <div class="">
    <div
      v-if="list.length === 0"
      class="py-12 px-7 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide text-opacity-40 bg-slate-50 rounded-md"
    >
      No edits made
    </div>
    <div v-else>
      <ul class="divide-y divide-slate-200 rounded-md overflow-hidden">
        <li v-for="(item, i) in list" :key="i">
          <div>
            <div
              class="flex justify-between px-6 py-4 group cursor-pointer hover:bg-gray-50"
              :class="editIndex === i ? 'bg-gray-50' : ''"
              @click="editChange(item, i)"
            >
              <div>
                <div
                  class="text-sm font-medium text-gray-500 group-hover:text-primary-500"
                  :class="
                    editIndex === i ? 'text-primary-500' : 'text-slate-700'
                  "
                >
                  {{ item.html }}
                </div>
                <div class="text-xs text-slate-300 mt-2 font-semibold">
                  {{ item.pathname }} > {{ item.selector }}
                </div>
              </div>
              <div class="ml-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 cursor-pointer hover:bg-slate-200"
                >
                  Edit
                </span>
              </div>
            </div>
            <div
              v-if="editIndex === i"
              class="grid grid-cols-12 gap-2 justify-between text-xs px-6 pt-2 pb-8 bg-slate-50 3xl:gap-4"
            >
              <span
                class="col-span-12 3xl:col-span-2 3xl:text-right text-slate-500 text-xs"
              >Change</span>
              <textarea
                v-model="item.html"
                class="col-span-12 3xl:col-span-10 h-20 italic resize-none w-full appearance-none text-xs border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900"
              />

              <span
                class="col-span-12 3xl:col-span-2 3xl:text-right opacity-50 mr-1 text-slate-500"
              >Path:</span>

              <input
                v-model="item.pathname"
                type="text"
                class="col-span-12 3xl:col-span-10 w-full appearance-none text-xs px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900"
              >

              <span
                class="col-span-12 3xl:col-span-2 3xl:text-right opacity-50 mr-1 text-slate-500"
              >Selector:</span>

              <input
                v-model="item.selector"
                type="text"
                class="col-span-12 3xl:col-span-10 w-full appearance-none text-xs px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900"
              >

              <span
                class="col-span-12 3xl:col-span-2 3xl:text-right opacity-50 mr-1 text-slate-500"
              >Attrs:</span>

              <div class="col-span-12 3xl:col-span-10">
                <div
                  v-for="(attr, ii) in item.attrs"
                  :key="ii"
                  class="grid grid-cols-12 gap-2 mb-2"
                >
                  <input
                    v-model="item.attrs[ii].name"
                    type="text"
                    class="col-span-12 3xl:col-span-3 w-full appearance-none text-xs px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900 placeholder-slate-400"
                    placeholder="style"
                    @blur="$emit(`update`)"
                  >
                  <div class="col-span-12 3xl:col-span-9 flex items-center">
                    <input
                      v-model="item.attrs[ii].value"
                      type="text"
                      class="flex-1 mr-2 w-full appearance-none text-xs px-2 py-1 border border-slate-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900 placeholder-slate-400"
                      placeholder="font-weight: bold;"
                      @blur="$emit(`update`)"
                    >
                    <span
                      class="whitespace-nowrap p-2 rounded text-xs font-medium bg-slate-200 text-slate-800 opacity-60 hover:opacity-100 cursor-pointer"
                      @click="removeAttr(item, ii)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    class="whitespace-nowrap px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800 opacity-60 hover:opacity-100 cursor-pointer"
                    @click="addAttr(item)"
                  >
                    Add Attribute
                  </span>
                </div>
              </div>

              <span
                class="col-span-12 3xl:col-span-2 3xl:text-right opacity-50 mr-1 text-slate-500"
              >More</span>
              <div class="col-span-10">
                <span
                  class="whitespace-nowrap px-2 py-0.5 rounded text-xs font-medium bg-slate-200 text-slate-800 opacity-60 hover:opacity-100 cursor-pointer"
                  @click="$emit(`update`, { hash: item.hash, edit: 'remove' })"
                >
                  Revert Changes
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
