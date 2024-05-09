<script lang="ts" setup>
import type { Card } from '@fiction/site/card'
import type { vue } from '@fiction/core'
import { timeAgo, useService } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'

defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionUser } = useService()
</script>

<template>
  <ul role="list" class="space-y-4">
    <li v-for="(org, i) in fictionUser.activeOrganizations.value" :key="i">
      <a :href="card.link(`/?orgId=${org.orgId}`)" class="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 sm:flex-nowrap hover:bg-theme-50 dark:hover:bg-theme-700 px-6 border border-theme-300/60 dark:border-theme-600 rounded-xl">
        <div>
          <p class="text-lg font-semibold leading-6 ">
            <a href="#" class="hover:underline">{{ org.orgName }}</a>
          </p>
          <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
            <p>
              <a href="#" class="hover:underline">{{ org.orgEmail }}</a>
            </p>
          </div>
        </div>
        <dl class="flex w-full flex-none justify-between gap-x-8 sm:w-auto items-center">
          <div class="flex -space-x-0.5">
            <dt class="sr-only">
              Team Members
            </dt>
            <dd v-for="(member, ii) in org.members" :key="ii">
              <ElAvatar class="h-6 w-6 rounded-full bg-gray-50 ring-2 ring-white" :email="member.email" />
            </dd>
          </div>
          <div class="hidden sm:flex sm:flex-col sm:items-end">
            <p class="text-sm leading-6  ">
              Organization {{ fictionUser.activeOrgId.value === org.orgId ? '(Active)' : '' }}
            </p>
            <p class="mt-1 text-xs leading-5 text-theme-500">
              Created <time datetime="2023-01-23T22:34Z">{{ timeAgo(org.createdAt) }}</time>
            </p>
          </div>
          <svg class="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
          </svg>
        </dl>
      </a>
    </li>
  </ul>
</template>
