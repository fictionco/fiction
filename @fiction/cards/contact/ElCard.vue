<script setup lang="ts">
import { vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import { useElementVisible } from '@fiction/ui/anim'
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
    <div>
      <div class="md:flex gap-16 " :class="uc.layout === 'left' ? 'md:flex-row-reverse' : ''">
        <div class="w-full md:w-[50%] px-2">
          <div class="relative border border-theme-200 dark:border-theme-700 rounded-xl h-full bg-theme-50 dark:bg-theme-700/50">
            <div data-tf-live="01J462G1SZ6TQ1HE9210GYRXPD" />
          </div>
        </div>
        <div class="md:w-[50%] mt-6 md:mt-0 flex items-center">
          <div class="p-6 flex flex-col justify-center gap-10 2xl:gap-12 " :class="isVisible ? 'translate-y-0' : 'translate-y-[100px]'">
            <div class="details space-y-4">
              <CardText
                tag="h3"
                :card
                class="text-primary-300 dark:text-primary-400 mb-4 text-sm font-sans font-medium"
                path="superTitle"
                animate="rise"
              />
              <CardText
                tag="h1"
                :card
                class="heading text-4xl font-semibold md:text-5xl x-font-title  lg:leading-[1.1] text-balance"
                path="title"
                animate="rise"
              />
              <CardText
                tag="div"
                :card
                class="sub-heading text-lg dark:text-theme-400"
                path="subTitle"
                :is-markdown="true"
                animate="rise"
              />
            </div>

            <div v-for="(item, i) in items" :key="i" class="list">
              <CardText
                tag="h3"
                :card
                class="sub-heading dark:text-theme-200 x-font-title text-lg md:text-xl font-semibold mb-4"
                :path="`items.${i}.title`"
                placeholder="List Title"
              />
              <div class="flex gap-[10%] gap-y-4 flex-wrap  text-base  ">
                <div v-for="(subItem, ii) in item.items" :key="ii" class="flex gap-4 items-center">
                  <div class="text-4xl" :class="subItem.icon" />
                  <CardText
                    :card
                    tag="a"
                    class="text-lg"
                    :path="`items.${i}.items.${ii}.title`"
                    :href="subItem.href"
                  />
                </div>
              </div>
            </div>

            <CardSocials :card :socials="uc.socials || []" class="flex gap-2 text-2xl justify-center md:justify-start" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
