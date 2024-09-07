<script setup lang="ts">
import { vue } from '@fiction/core'
import CardForm from '@fiction/forms/deck/CardForm.vue'
import { useElementVisible } from '@fiction/ui/anim'
import type { Card } from '@fiction/site'
import CardText from '../CardText.vue'
import CardSocials from '../el/CardSocials.vue'
import type { UserConfig } from '.'

const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const uc = vue.computed(() => {
  return props.card.userConfig.value || {}
})

const items = vue.computed(() => uc.value.items)

const isVisible = vue.ref(false)
vue.onMounted(async () => {
  await useElementVisible({ selector: `.minimal-profile`, onVisible: () => isVisible.value = true })
})

vue.onMounted(() => {
  // Load the Typeform embed script
  const script = document.createElement('script')
  script.src = '//embed.typeform.com/next/embed.js'
  script.async = true
  document.body.appendChild(script)
})
</script>

<template>
  <div class="minimal-profile" :class="card.classes.value.contentWidth">
    <div class="text-center">
      <div class="md:inline-flex gap-6 lg:gap-16 justify-center" :class="uc.layout === 'left' ? 'md:flex-row-reverse' : ''">
        <div class="w-full md:w-[40vw] px-2">
          <div class="overflow-hidden relative border border-theme-200 dark:border-theme-700 rounded-xl h-full bg-theme-50 dark:bg-theme-800/50">
            <CardForm :card form-template-id="contact" class="h-full w-full" />
          </div>
        </div>
        <div class="md:w-[50%] mt-6 md:mt-0 flex items-center text-left">
          <div class="p-6 flex flex-col justify-center gap-10 2xl:gap-12 " :class="isVisible ? 'translate-y-0' : 'translate-y-[100px]'">
            <div v-for="(item, i) in items" :key="i" class="list">
              <CardText
                tag="h3"
                :card
                class="sub-heading text-theme-400 dark:text-theme-500 x-font-title text-lg font-medium mb-4"
                :path="`items.${i}.title`"
                placeholder="List Title"
              />
              <div class="flex gap-[10%] gap-y-4 flex-wrap  text-base  ">
                <a v-for="(subItem, ii) in item.items" :key="ii" :href="subItem.href" class="flex gap-4 items-center hover:text-primary-500 dark:hover:text-primary-400">
                  <div class="text-3xl" :class="subItem.icon" />
                  <CardText
                    :card
                    tag="span"
                    class="text-base font-sans"
                    :path="`items.${i}.items.${ii}.title`"
                  />
                </a>
              </div>
            </div>

            <CardSocials :card :socials="uc.socials || []" class="flex gap-2 text-2xl justify-center md:justify-start" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
