<script lang="ts" setup>
import { useService } from '@fiction/core'
import ElAvatar from '@fiction/ui/ElAvatar.vue'
import ElZeroBanner from '@fiction/ui/ElZeroBanner.vue'

const { factorUser } = useService()
</script>

<template>
  <div>
    <template v-if="factorUser.activeUser.value?.userId === 'anonymous'">
      <div>
        <ElZeroBanner
          title="No Access"
          description="As an anonymous user, You don't have access to this page."
        />
      </div>
    </template>
    <div v-else box-class="p-0">
      <div class="border-theme-200 dark:border-theme-700 flex items-center space-x-4 border-b p-8">
        <div>
          <ElAvatar
            :email="factorUser.activeUser.value?.email"
            class="h-16 w-16 rounded-full"
          />
        </div>
        <div>
          <div class="text-xl font-bold">
            {{ factorUser.activeUser.value?.fullName }}
          </div>
          <div class="text-theme-500">
            {{ factorUser.activeUser.value?.email }}
          </div>
        </div>
      </div>
      <div class="py-8">
        <slot />
      </div>
    </div>
  </div>
</template>
