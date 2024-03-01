<script lang="ts" setup>
import { DraggableList, clean, toLabel, vue, waitFor } from '@factor/api'
import { useKaption } from '../../utils/inject'
import ElButton from '../../ui/ElButton.vue'
import ElOption from '../../ui/ElOption.vue'
import FormBuilderDesign from './FormBuilderDesign.vue'

const { kaptionForms, factorUser, factorMedia } = useKaption()
const service = { factorMedia }
const activeForm = kaptionForms.activeForm
const editMode = kaptionForms.editMode
const draggableMode = vue.ref<-1 | 0 | 1>(-1)

function updateLayout() {
  activeForm.value?.updateFormLayout({
    layoutZoneClass: 'layout-builder',
  })
}

const regions = ['start', 'body', 'end'] as const

function getCards(region: 'start' | 'body' | 'end') {
  return activeForm?.value?.cardRegions.value[region] || []
}

vue.onMounted(async () => {
  await factorUser.pageInitialized()
  await waitFor(300)
  new DraggableList({
    wrapClass: 'drag-card-zone',
    draggableClass: 'drag-card',
    placeholderClass: 'card-placeholder',
    hideOnDragClass: 'card-drawer',
    ghostClasses: ['ring-4', 'ring-sky-300/50', 'ring-offset-2'],
    onUpdate: () => updateLayout(),
  })

  new DraggableList({
    wrapClass: 'drag-input-zone',
    draggableClass: 'drag-input',
    placeholderClass: 'drop-placeholder',
    ghostClasses: ['ring-2', 'ring-sky-300/50', 'ring-offset-2'],
    onUpdate: () => updateLayout(),
  })
})
</script>

<template>
  <div v-if="activeForm">
    <div class="flex items-end justify-between py-4">
      <h3 class="text-sm font-bold">
        {{ toLabel(editMode) }}
      </h3>

      <div v-if="activeForm" class="relative">
        <ElButton
          v-if="editMode === 'create'"
          btn="default"
          size="xs"
          @click.stop="activeForm ? (editMode = 'design') : ''"
        >
          <div class="i-carbon-paint-brush mr-1 text-sm opacity-80" />
          Design
        </ElButton>
        <ElButton
          v-else-if="editMode === 'design'"
          btn="default"
          size="xs"
          @click.stop="activeForm ? (editMode = 'create') : ''"
        >
          <div class="i-carbon-license-draft mr-1 text-sm text-theme-400" />
          Manage
        </ElButton>
      </div>
    </div>
    <div class="list relative">
      <FormBuilderDesign v-if="editMode === 'design'" />

      <template v-else>
        <div class="layout-builder">
          <template v-for="region in regions" :key="region">
            <div class="relative my-1">
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-slate-200" />
              </div>
              <div class="relative flex justify-start">
                <span
                  class="bg-white pr-2 text-[10px] uppercase text-theme-300"
                >{{ region }}</span>
              </div>
            </div>
            <div class="drag-card-zone space-y-3">
              <div
                v-for="card in getCards(region)"
                :key="card.cardId"
                class="drag-card overflow-hidden"
                :data-card-id="card.cardId"
                data-card-depth="0"
                :draggable="draggableMode === 0"
                :class="
                  card.cardId === activeForm?.activeId.value
                    ? 'border-slate-300'
                    : 'border-slate-300'
                "
              >
                <div
                  class="card flex bg-theme-50 text-theme-500 hover:bg-theme-100"
                  @mouseover="draggableMode = 0"
                  @mouseleave="draggableMode = -1"
                >
                  <div
                    class="flex items-center justify-center rounded-tl-md border px-2"
                    :class="[
                      card.cardType.value.iconStyle?.border
                        ?? 'border-slate-300',
                      card.cardType.value.iconStyle?.bg ?? 'bg-theme-100',
                      card.cardType.value.iconStyle?.text,
                    ]"
                  >
                    <div
                      :class="
                        card.cardType.value.iconStyle?.icon
                          ?? 'i-carbon-blockchain'
                      "
                    />
                    <span
                      v-if="card.cardNumber"
                      class="ml-1 text-[10px] font-bold"
                    >{{ card.cardNumber }}</span>
                  </div>
                  <div
                    class="flex grow rounded-tr-md border-y border-r border-slate-300"
                  >
                    <div
                      class="flex grow cursor-pointer items-center px-2 hover:bg-theme-50"
                      @click="
                        activeForm?.setActiveId({
                          cardId: card.cardId,
                          drawer: 'toggle',
                        })
                      "
                    >
                      <div class="py-1 text-[10px] uppercase">
                        {{ card.cardType.value.name || "Card" }}
                      </div>
                    </div>

                    <div
                      class="flex cursor-move items-center p-1 hover:bg-theme-200"
                    >
                      <div
                        class="i-carbon-draggable text-sm"
                        :class="
                          card.cardId === activeForm?.activeId.value
                            ? 'rotate-180'
                            : ''
                        "
                      />
                    </div>
                    <div
                      class="flex cursor-pointer items-center p-1 hover:bg-theme-200"
                    >
                      <div
                        class="i-carbon-settings text-sm"
                        @click="
                          activeForm?.setActiveDrawer({ cardId: card.cardId })
                        "
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="card-drawer rounded-b-md border-x border-b border-slate-300 p-3"
                >
                  <div v-if="card.cardType.value.hasNested">
                    <!-- <div
                      class="flex items-center justify-between space-x-4 pb-2"
                    >
                      <div class="text-[10px] uppercase text-theme-400">
                        {{ card.cardsFull.value.length }} Inputs / Elements
                      </div>
                    </div> -->
                    <div class="drag-input-zone min-h-[1em] space-y-2">
                      <div
                        v-if="card.cardsFull.value.length === 0"
                        class="drop-placeholder pointer-events-none p-4 text-center text-[10px] uppercase text-theme-300"
                      >
                        Drop inputs here
                      </div>
                      <div
                        v-for="subCard in card.cardsFull.value"
                        :key="subCard.cardId"
                        class="drag-input"
                        :class="[
                          subCard.cardId === activeForm?.activeId.value
                            ? ' '
                            : ' ',
                          card.cardsFull.value.length === 0 ? 'py-4' : '0',
                        ]"
                        :data-card-id="subCard.cardId"
                        data-card-depth="1"
                        :draggable="draggableMode === 1"
                      >
                        <div
                          class="flex"
                          @mouseover="draggableMode = 1"
                          @mouseleave="draggableMode = -1"
                        >
                          <div
                            class="flex w-12 cursor-pointer items-center justify-center rounded-l-md border p-2 hover:opacity-80"
                            :class="[
                              subCard.cardType.value.iconStyle?.bg,
                              subCard.cardType.value.iconStyle?.text,
                              subCard.cardType.value.iconStyle?.border,
                            ]"
                            @click.stop="
                              activeForm?.setActiveId({
                                cardId: subCard.cardId,
                                drawer: 'closeAll',
                              })
                            "
                          >
                            <div
                              class="text-sm"
                              :class="[subCard.cardType.value.iconStyle?.icon]"
                            />
                            <span
                              v-if="subCard.cardNumber"
                              class="ml-2 text-[10px] font-bold"
                            >{{ subCard.cardNumber }}</span>
                          </div>
                          <div
                            class="flex min-w-0 flex-1 grow items-center rounded-r-md border-y border-r border-slate-300"
                          >
                            <div
                              class="min-w-0 grow cursor-pointer p-2 hover:bg-theme-50"
                              @click.stop="
                                activeForm?.setActiveId({
                                  cardId: subCard.cardId,
                                  drawer: 'toggle',
                                })
                              "
                            >
                              <h3
                                class="min-w-0 break-words text-xs font-semibold"
                                v-html="
                                  clean(
                                    subCard.userConfig.value.heading
                                      || subCard.cardType.value.name,
                                  )
                                "
                              />
                              <p
                                v-if="subCard.userConfig.value.heading"
                                class="text-[10px] text-theme-500"
                              >
                                {{ subCard.cardType.value.name }}
                              </p>
                            </div>
                            <div
                              class="cursor-move rounded-[3px] p-0.5 text-theme-400 hover:bg-theme-100"
                            >
                              <div class="i-carbon-draggable text-sm" />
                            </div>
                            <div
                              class="mr-1 cursor-pointer rounded-[3px] p-0.5 text-theme-400 hover:bg-theme-50"
                            >
                              <div
                                class="i-carbon-settings text-sm"
                                @click="
                                  activeForm?.setActiveId({
                                    cardId: subCard.cardId,
                                    drawer: 'toggle',
                                  })
                                "
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="
                            activeForm?.activeDrawer.value === subCard.cardId
                          "
                          class="drawer mt-2 space-y-3 bg-theme-50 p-4"
                        >
                          <div class="mb-4">
                            <div
                              class="flex items-center justify-between space-x-4"
                            >
                              <div class="text-[10px] uppercase text-theme-500">
                                Settings
                              </div>
                              <span
                                class="inline-flex cursor-pointer items-center rounded bg-theme-200 px-2 py-0.5 font-medium text-theme-800 hover:bg-rose-500 hover:text-white"
                                @click.stop="
                                  activeForm?.deleteById([subCard.cardId])
                                "
                              >
                                <div class="text-xs">Delete</div>
                              </span>
                            </div>
                          </div>
                          <template
                            v-for="(opt, ii) in subCard.el.value?.options"
                            :key="ii"
                          >
                            <ElOption
                              v-bind="opt.props.value"
                              v-model="subCard.conf.value[opt.optionKey]"
                              :option="opt"
                              :card="subCard"
                              :service="service"
                              class="form-settings-input"
                            />
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- <div>
                    <div class="flex items-center justify-between space-x-4">
                      <div
                        class="inline-flex cursor-pointer items-center space-x-2 rounded-md bg-theme-100 px-2 py-0.5 text-xs font-semibold text-theme-400 hover:text-theme-500"
                        @click.stop="
                          activeForm?.setActiveId({
                            cardId: card.cardId,
                            drawer: 'toggle',
                          })
                        "
                      >
                        <div>Settings</div>
                        <div
                          class="i-carbon-chevron-down"
                          :class="
                            card.cardId === activeForm?.activeDrawer.value
                              ? 'rotate-180'
                              : ''
                          "
                        />
                      </div>
                    </div>
                  </div> -->
                  <div
                    v-if="card.cardId === activeForm?.activeDrawer.value"
                    class="space-y-3 py-4"
                  >
                    <template
                      v-for="(opt, ii) in card.el.value?.options"
                      :key="ii"
                    >
                      <ElOption
                        v-bind="opt.props.value"
                        v-model="card.userConfig.value[opt.optionKey]"
                        class="form-settings-input"
                        :option="opt"
                        :card="card"
                        :service="service"
                        :class="opt.isVisible.value ? '' : 'hidden'"
                      />
                    </template>
                    <div>
                      <span
                        class="inline-flex cursor-pointer items-center rounded bg-theme-200 px-2 py-0.5 font-medium text-theme-800 hover:bg-rose-500 hover:text-white"
                        @click.stop="activeForm?.deleteById([card.cardId])"
                      >
                        <div class="text-xs">Delete</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
.form-setting-input {
  --input-size: 12px;
  --input-label-size: 11px;
  --input-bg: #ffffff;
}
</style>
