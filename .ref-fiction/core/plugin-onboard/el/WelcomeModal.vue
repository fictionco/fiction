<script lang="ts" setup>
import type { MenuItem } from '@factor/api'
import { vue } from '@factor/api'
import ElModal from '@factor/ui/ElModal.vue'
import ElButton from '@factor/ui/ElButton.vue'
import EffectGrid from '@factor/ui/EffectGrid.vue'
import Logo from '../../ui/FictionLogo.vue'
import { useFictionApp } from '../../util'

const { factorRouter, factorUser } = useFictionApp()

// localRef({
//   key: 'DisableOnboardModal',
//   def: false,
//   lifecycle: 'local',
// })

const vis = vue.ref(false)

async function welcomeComplete(args: { reason: string }) {
  console.warn('welcomeComplete', args)
  const organizationId = factorUser.activeOrganizationId.value
  if (!organizationId)
    return
  await factorUser.requests.ManageOnboard.projectRequest({
    _action: 'update',
    settings: { welcomed: { [organizationId]: true } },
    mode: 'user',
  })
}

vue.onMounted(() => {
  vue.watch(
    () => factorRouter.query.value.newUser,
    (v) => {
      if (v)
        vis.value = true
    },
  )
})

const fullVisible = vue.computed(() => {
  const user = factorUser.activeUser.value
  const organizationId = factorUser.activeOrganizationId.value
  if (!user || !organizationId)
    return false

  const w = user.onboard?.welcomed
  if (w && Object.keys(w).length > 0)
    return false
  return true
})

interface Step {
  sup: string
  title: string
  description: string
  actions: MenuItem[]
}
const steps: Step[] = [
  {
    sup: 'professional AI media generation tools',
    title: 'Welcome to Fiction',
    description:
      'Watch the video to learn the problem, solution, and how to get started.',
    actions: [
      {
        name: 'Got it. I\'m ready to start using Fiction...',
        btn: 'primary',
        onClick: async () => {
          await welcomeComplete({ reason: 'startUsing' })
        },
      },
    ],
  },
]
</script>

<template>
  <ElModal
    :vis="fullVisible"
    modal-class="max-w-4xl "
    @escape="welcomeComplete({ reason: 'modalClose' })"
  >
    <div
      v-for="(step, i) in steps"
      :key="i"
      class="step flex grid-cols-12 flex-col-reverse"
    >
      <div class="head col-span-12 p-8 md:col-span-8 md:p-12">
        <div class="relative h-0 pb-[56.8%]">
          <iframe
            class="absolute left-0 top-0 h-full w-full"
            src="https://www.youtube.com/embed/_XFEtyo2tz4?rel=0&modestbranding=1&showinfo=0"
            title="Fiction"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>
        <div class="mt-8">
          <div class="text-3xl font-extrabold tracking-tight">
            {{ step.title }}
          </div>
          <div
            class="text-theme-400 my-2 text-xs font-bold uppercase tracking-wider"
          >
            {{ step.sup }}
          </div>
          <div class="text-theme-500 my-5 max-w-md text-xl font-medium">
            {{ step.description }}
          </div>
          <div class="mt-5 space-x-3">
            <ElButton
              v-for="(item, ii) in step.actions"
              :key="ii"
              :href="item.href || item.link?.value"
              :btn="item.btn"
              @click.stop="item.onClick && item.onClick($event)"
            >
              {{ item.name }}
            </ElButton>
          </div>
        </div>
      </div>
      <div
        class="image from-theme-900 relative col-span-12 h-40 overflow-hidden bg-gradient-to-br to-black md:col-span-4 md:h-auto"
      >
        <div class="z-20 p-6 text-white">
          <Logo class="w-24" />
        </div>
        <EffectGrid />
      </div>
    </div>
  </ElModal>
</template>
