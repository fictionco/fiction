<script lang="ts" setup>
import ElPanel from '@factor/ui/ElPanel.vue'
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type { FactorUser } from '@factor/api'
import { useService } from '@factor/api'
import ElZeroBanner from '@factor/ui/ElZeroBanner.vue'
import AdminPageSettings from './AdminPageSettings.vue'

const { factorUser } = useService<{
  factorUser: FactorUser
}>()
</script>

<template>
  <AdminPageSettings>
    <template v-if="factorUser.activeUser.value?.userId === 'anonymous'">
      <ElPanel>
        <ElZeroBanner
          title="No Access"
          description="As an anonymous user, You don't have access to this page."
        />
      </ElPanel>
    </template>
    <ElPanel v-else box-class="p-0">
      <div class="border-theme-200 flex items-center space-x-4 border-b p-8">
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
      <div class="p-8">
        <slot />
      </div>
    </ElPanel>
  </AdminPageSettings>
</template>
