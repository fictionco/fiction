<script lang="ts" setup>
import type { ColorThemeBright, ColorThemeUser, NavListItem } from '@fiction/core'
import { getCardDemoListing } from '@fiction/cards'
import { vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import { getColorThemeStyles } from '@fiction/ui/utils'

// Store the categories and their items
const categories = vue.ref<NavListItem[]>([])
const isLoading = vue.ref(true)

// Function to get an icon for a category
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Marketing Essentials': 'i-tabler-presentation',
    'Social Proof': 'i-tabler-rocket',
    'Content and Posts': 'i-tabler-article',
    'Media Gallery': 'i-tabler-photo',
    'Conversion': 'i-tabler-target',
    'Nav & Structure': 'i-tabler-layout-2',
    'Sliders & Carousels': 'i-tabler-slideshow',
    'Effects & Utility': 'i-tabler-sparkles',
    'UI Libraries': 'i-tabler-components',
  }

  return iconMap[category] || 'components'
}

// Function to get a color for a category
function getCategoryColor(category: string) {
  const colorMap: Record<string, ColorThemeBright> = {
    'Marketing Essentials': 'blue',
    'Social Proof': 'emerald',
    'Content and Posts': 'indigo',
    'Media Gallery': 'cyan',
    'Conversion': 'rose',
    'Nav & Structure': 'violet',
    'Sliders & Carousels': 'amber',
    'Effects & Utility': 'fuchsia',
    'UI Libraries': 'blue',
  }

  return colorMap[category] || 'primary'
}

const themeStyles = (theme?: ColorThemeUser) => getColorThemeStyles(theme)

// Load all demo categories and their items
vue.onMounted(async () => {
  try {
    const demoComponents = await getCardDemoListing()

    // Transform the data structure for easier rendering
    const c = demoComponents
      .map(category => ({
        label: category.label || '',
        theme: getCategoryColor(category.label || ''),
        icon: { class: getCategoryIcon(category.label || '') },
        list: { items: category.list?.items || [] },
      }))
      .filter(group => group.list.items.length > 0)

    categories.value = c

    isLoading.value = false
  }
  catch (error) {
    console.error('Error loading demo components:', error)
    isLoading.value = false
  }
})
</script>

<template>
  <div class="demo-grid">
    <!-- Loading state -->
    <div v-if="isLoading" class="py-12 text-center">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
      <p class="mt-4 text-theme-600 dark:text-theme-400">
        Loading components...
      </p>
    </div>

    <!-- Main content -->
    <div v-else class="py-12">
      <div v-for="(category, i) in categories" :key="`cat-${i}`" class="mb-16">
        <!-- Category header -->
        <div class="mb-8">
          <div class="flex items-center gap-5">
            <div
              class="size-12 rounded-lg flex items-center justify-center"
              :class="[themeStyles(category.theme)?.bg, themeStyles(category.theme)?.text]"
            >
              <div :class="`${category.icon} size-6`" />
            </div>
            <div>
              <h2 class="text-2xl font-bold x-font-title">
                {{ category.label }}
              </h2>
              <p class="text-theme-500 dark:text-theme-400 font-sans">
                {{ category.list?.items?.length }} component{{ category.list?.items?.length !== 1 ? 's' : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Component grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(item, j) in category.list?.items"
            :key="`item-${i}-${j}`"
            class="border border-theme-200 dark:border-theme-800 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <h3 class="font-medium text-lg mb-3 x-font-title">
              {{ item.label }}
            </h3>
            <p class="text-theme-500 dark:text-theme-400 mb-4 text-sm">
              View a live interactive demo of the {{ item.label?.toLowerCase() }} component.
            </p>

            <XButton
              :href="item.href"
              :theme="category.theme || 'primary'"
              design="outline"
              icon-after="i-tabler-arrow-right"
              size="sm"
            >
              View Demo
            </XButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
</style>
