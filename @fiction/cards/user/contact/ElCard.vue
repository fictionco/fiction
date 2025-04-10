<script setup lang="ts">
import type { Card } from '@fiction/site'
import type { UserConfig } from './config'
import { vue } from '@fiction/core'
import CardForm from '@fiction/forms/deck/CardForm.vue'
import { animateItemEnter, useElementVisible } from '@fiction/ui/anim'
import XIcon from '@fiction/ui/media/XIcon.vue'
import CardText from '../CardText.vue'
import CardActionArea from '../el/CardActionArea.vue'

const { card } = defineProps<{
  card: Card<UserConfig>
}>()

const uc = vue.computed(() => card.userConfig.value || {})
const items = vue.computed(() => uc.value.groups || [])
const isVisible = vue.ref(false)
const contactSection = vue.ref<HTMLElement>()

vue.onMounted(async () => {
  await useElementVisible({
    selector: `.contact-form`,
    onVisible: async () => {
      isVisible.value = true
      await animateItemEnter({
        targets: '.contact-item',
        themeId: 'fade',
        config: {
          overallDelay: 200,
          stagger: 100,
        },
      })
    },
    caller: 'contact',
  })
})

const layoutClasses = vue.computed(() => {
  const layout = uc.value.layout || 'right'

  const modes = {
    stacked: {
      wrapper: 'flex-col max-w-3xl mx-auto',
      form: 'w-full mt-12 md:mt-0',
      details: '',
    },
    left: {
      wrapper: 'md:flex-row-reverse',
      form: 'w-full md:w-[45%] xl:w-[50%]',
      details: 'md:w-[50%] mt-12 md:mt-0 ',
    },
    right: {
      wrapper: 'md:flex-row',
      form: 'w-full md:w-[45%] xl:w-[50%]',
      details: 'md:w-[50%] mt-12 md:mt-0 ',
    },
  }

  return modes[layout]
})

const hoverClasses = 'group-hover/item:text-primary-600 dark:group-hover/item:text-primary-400 transition-colors'

const formUserConfig = vue.computed(() => {
  const userConfig = { ...uc.value.form }
  return { formTemplateId: 'contact', userConfig,
  }
})
</script>

<template>
  <div ref="contactSection" :class="card.classes.value.contentWidth" class="contact-form">
    <div class="text-center">
      <!-- Main Content -->
      <div
        class="md:flex gap-8 lg:gap-16 xl:gap-28 justify-between gap"
        :class="layoutClasses.wrapper"
      >
        <!-- Form Section -->
        <div :class="layoutClasses.form">
          <div
            v-if="card.site"
            class="h-full overflow-hidden relative rounded-2xl bg-white dark:bg-theme-700/20 border border-theme-300/70 dark:border-theme-700"
          >
            <CardForm
              :site="card.site"
              :form-config="formUserConfig"
              class="w-full h-full"
            />
          </div>
        </div>

        <!-- Contact Details Section -->
        <div class="text-left" :class="layoutClasses.details">
          <div
            class="flex flex-col gap-8 xl:gap-10"
            :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[40px] opacity-0'"
            style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
          >
            <!-- Contact Groups -->
            <div
              v-for="(group, i) in items"
              :key="i"
              class="contact-group"
            >
              <div class="flex gap-3 items-center mb-4">
                <CardText
                  tag="h3"
                  :card
                  class="text-theme-600 dark:text-theme-300 x-font-title text-lg"
                  :path="`groups.${i}.title`"
                  placeholder="Contact Group"
                />
                <div class="grow">
                  <hr class="border-t border-dashed border-theme-200 dark:border-theme-700">
                </div>
              </div>

              <!-- Contact Items Grid -->
              <div
                class="grid gap-4"
                :class="group.items && group.items.length > 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'"
              >
                <a
                  v-for="(item, ii) in group.items"
                  :key="ii"
                  :href="item.href"
                  :class="item.href ? 'hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors duration-300' : ''"
                  class="contact-item group/item flex items-center justify-between gap-6 px-6 py-4 rounded-xl dark:bg-theme-700/30 border border-theme-300/70 dark:border-theme-600/50 "
                >
                  <div class="flex gap-6 items-center">
                    <div
                      class="flex-shrink-0 text-primary-500 dark:text-primary-400  "
                      :class="item.href ? hoverClasses : ''"
                    >
                      <XIcon
                        v-if="item.icon"
                        class="size-8"
                        :media="item.icon"
                      />
                    </div>
                    <div class="min-w-0 flex-1">
                      <CardText
                        :card
                        tag="span"
                        :class="item.href ? hoverClasses : ''"
                        class="block x-font-title font-medium text-theme-900 dark:text-theme-100"
                        :path="`groups.${i}.items.${ii}.label`"
                      />
                      <CardText
                        v-if="item.value"
                        :card
                        tag="span"
                        :class="item.href ? hoverClasses : ''"
                        class="block  mt-0.5 font-sans text-theme-600 dark:text-theme-400"
                        :path="`groups.${i}.items.${ii}.value`"
                      />
                    </div>
                  </div>
                  <XIcon
                    v-if="item.href"
                    class="size-8 text-theme-300/70 dark:text-theme-600 -mr-3 gr"
                    :class="item.href ? hoverClasses : ''"
                    :media="{ class: 'i-tabler-chevron-right' }"
                  />
                </a>
              </div>
            </div>

            <CardActionArea :card class="" :classes="{ buttons: 'flex gap-4' }" base-path="action" size="lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
