<script lang="ts" setup>
import type { Organization } from '@fiction/core'
import type { Card, Site } from '@fiction/site'
import type { WidgetConfig } from '..'
import CardLink from '@fiction/cards/el/CardLink.vue'
import { vue } from '@fiction/core'
import ElSitePreviewFrame from '@fiction/site/admin/ElSitePreviewFrame.vue'
import { siteLink } from '@fiction/site/utils/manage'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XDropDown from '@fiction/ui/common/XDropDown.vue'
import WidgetWrap from '../WidgetWrap.vue'
import Tasks from './Tasks.vue'

const props = defineProps<{
  widget: WidgetConfig
  card: Card
  primarySite?: Site
  org: Organization
}>()

const createSiteLink = vue.computed(() => siteLink({ site: props.card.site, location: { path: '/sites' } }))
const siteEditLink = vue.computed(() => siteLink({ site: props.card.site, location: { path: '/edit-site', query: { siteId: props.primarySite?.siteId } } }))

const liveSiteUrl = vue.computed(() => props.primarySite?.url.value || '')
</script>

<template>
  <WidgetWrap>
    <div class="flex flex-col lg:flex-row gap-12 h-full">
      <!-- Organization info and tasks -->
      <div class="flex flex-col w-full lg:w-3/5 space-y-12 min-h-[40vh]">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:text-left text-center gap-4 justify-between items-center">
          <div>
            <h2 class="text-2xl font-semibold x-font-title">
              {{ org?.name }}
            </h2>
            <a
              :href="liveSiteUrl"
              target="_blank"
              class="text-sm text-theme-500 hover:text-theme-700 dark:text-theme-400 dark:hover:text-theme-300 flex items-center gap-1"
            >
              {{ org?.handle }}.fiction.com
              <i class="i-tabler-external-link text-xs" />
            </a>
          </div>
          <div>
            <XDropDown
              mode="click"
              :items="[
                { key: 'edit', label: 'Edit Site', href: siteEditLink },
                { key: 'settings', label: 'Settings', href: props.card.link('/settings') },
              ]"
              dropdown-alignment="end"
            >
              <XButton
                size="sm"
                design="outline"
                theme="primary"
                icon-after="i-tabler-chevron-down"
              >
                Quick Actions
              </XButton>
            </XDropDown>
          </div>
        </div>

        <!-- Tasks component -->
        <div class="border-t border-theme-200 dark:border-theme-700 pt-12">
          <Tasks :card="card" />
        </div>
      </div>

      <!-- Site preview with hover overlay -->
      <div class="w-full lg:w-2/5 flex flex-col">
        <CardLink
          v-if="primarySite"
          :card
          class="relative h-full border border-theme-200 dark:border-theme-700 rounded-md overflow-hidden group"
          :href="siteEditLink"
        >
          <!-- Site preview iframe -->
          <ElSitePreviewFrame
            :url="primarySite?.frame.framePageUrl()"
            class="w-full h-full aspect-[11/16] md:aspect-[3/4]"
          />

          <!-- Hover overlay -->
          <div class="absolute text-sm font-semibold inset-0 bg-theme-900/80 backdrop-blur-xs rounded-md flex flex-col items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span class="rounded-full ring-1 ring-white px-4 py-1">Edit Site</span>
          </div>
        </CardLink>

        <div
          v-else
          class="p-6 w-full h-full flex items-center justify-center border border-theme-200 dark:border-theme-700 rounded-md bg-theme-50 dark:bg-theme-900"
        >
          <span class="text-theme-400">No site added. <a :href="createSiteLink" class="text-primary-400">Create one</a>.</span>
        </div>
      </div>
    </div>
  </WidgetWrap>
</template>
