<script lang="ts" setup>
import { useService } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'

const { fictionUser } = useService()
</script>

<template>
  <div>
    <template v-if="fictionUser.activeUser.value?.userId === 'anonymous'">
      <div>
        <ElZeroBanner
          title="No Access"
          description="As an anonymous user, You don't have access to this page."
        />
      </div>
    </template>
    <div v-else box-class="p-0">
      <div class="border-theme-200/50 bg-theme-50/50 dark:bg-theme-700 dark:border-theme-700 flex items-center space-x-4 border-b p-8">
        <div>
          <ElAvatar
            :email="fictionUser.activeUser.value?.email"
            class="h-16 w-16 rounded-full"
          />
        </div>
        <div>
          <div class="text-xl font-bold">
            {{ fictionUser.activeUser.value?.fullName }}
          </div>
          <div class="text-theme-500">
            {{ fictionUser.activeUser.value?.email }}
          </div>
        </div>
      </div>
      <div class="py-8">
        <slot />
      </div>
    </div>
  </div>
</template>
