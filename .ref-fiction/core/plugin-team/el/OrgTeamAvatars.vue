<script lang="ts" setup>
import ElAvatar from '@factor/ui/ElAvatar.vue'
import type {
  FactorRouter,
  FactorUser,
  Organization,
  vue,
} from '@factor/api'
import {
  useService,
  vueRouter,
} from '@factor/api'

const props = defineProps({
  organization: {
    type: Object as vue.PropType<Organization>,
    default: undefined,
  },
})

const { factorRouter, factorUser } = useService<{
  factorRouter: FactorRouter
  factorUser: FactorUser
}>()

const router = vueRouter.useRouter()

async function editTeam(): Promise<void> {
  await router.push(
    `${factorRouter.to('team', {
      organizationId: props.organization?.organizationId,
    })}`,
  )
}
</script>

<template>
  <div class="group flex overflow-hidden transition-colors">
    <div class="flex cursor-pointer" @click.stop="editTeam()">
      <ElAvatar
        v-for="(member, ii) in organization?.members"
        :key="ii"
        class="inline-block h-6 w-6 rounded-full ring-2 ring-white"
        :email="member.email"
      />
    </div>

    <div
      v-if="factorUser.activeRelation.value?.canAdministrate"
      class="bg-primary-500 hover:bg-primary-700 inline-block h-6 w-6 cursor-pointer rounded-full text-white shadow-sm ring-2 ring-white group-hover:text-white"
      @click.stop=""
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>
