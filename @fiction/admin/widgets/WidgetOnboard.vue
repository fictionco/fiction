<script lang="ts" setup>
import type { Widget } from '@fiction/admin/dashboard/widget'
import type { OnboardingItem, ProgressStatus } from '@fiction/core'
import type { Card } from '@fiction/site'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { useService, vue } from '@fiction/core'

const { widget, card } = defineProps<{
  widget: Widget
  card: Card
}>()

// Access organization data
const { fictionUser } = useService()

interface OnboardStep {
  id: string
  title: string
  actionLabel: string
  actionHref: string
  current?: boolean
  isCompleted?: boolean
}

// Static step definitions
const stepDefinitions: OnboardStep[] = [
  {
    id: 'profile',
    title: 'Add your name and profile details',
    actionLabel: 'Edit profile',
    actionHref: card.link('/settings/profile'),
    isCompleted: true, // Demo first step as completed
  },
  {
    id: 'headshot',
    title: 'Create a professional headshot',
    actionLabel: 'Do it now',
    actionHref: card.link('/profile/headshot'),
  },
  {
    id: 'post',
    title: 'Publish your first post',
    actionLabel: 'Start writing',
    actionHref: card.link('/posts/new'),
  },
  {
    id: 'social',
    title: 'Connect your social accounts',
    actionLabel: 'Connect',
    actionHref: card.link('/settings/social'),
  },
  {
    id: 'share',
    title: 'Share your site with your network',
    actionLabel: 'Share',
    actionHref: card.link('/share'),
  },
]

// Get organizational onboarding data
const orgOnboardSettings = vue.computed(() => {
  return fictionUser?.activeOrganization?.value?.onboard || {}
})

// Get completion status from org's onboarding data
const onboardTasks = vue.computed(() => {
  return orgOnboardSettings.value.tasks || {}
})

// Create reactive step data with completion status
const steps = vue.computed(() => {
  // Find first incomplete step to mark as current
  let foundCurrent = false

  return stepDefinitions.map((step) => {
    // Check if task exists in org onboarding data
    const taskData = onboardTasks.value[step.id] as OnboardingItem | undefined
    const isCompleted = step.isCompleted || (taskData?.status === 'ready')

    // First non-completed step becomes current
    const isCurrent = !isCompleted && !foundCurrent
    if (isCurrent)
      foundCurrent = true

    return {
      ...step,
      isCompleted,
      current: isCurrent,
    }
  })
})

// Calculate progress
const completedSteps = vue.computed(() => steps.value.filter(step => step.isCompleted).length)
const totalSteps = vue.computed(() => steps.value.length)
const progress = vue.computed(() => `${completedSteps.value} of ${totalSteps.value} complete`)

// Track completion of a step
async function markStepComplete(stepId: string) {
  // Skip if already completed
  if (steps.value.find(s => s.id === stepId)?.isCompleted)
    return

  try {
    // Create new onboarding task data
    const newTask: OnboardingItem = {
      key: stepId,
      status: 'ready' as ProgressStatus,
      completedAt: new Date().toISOString(),
      responses: [],
    }

    // Get existing tasks
    const existingTasks = { ...onboardTasks.value }

    const orgId = fictionUser.activeOrganization.value?.orgId
    if (!orgId)
      throw new Error('Organization ID not found')

    // Update tasks with new completion
    await fictionUser.requests.ManageOrganization.request({
      _action: 'update',
      where: { orgId },
      fields: {
        onboard: {
          ...orgOnboardSettings.value,
          tasks: {
            ...existingTasks,
            [stepId]: newTask,
          },
          lastUpdated: new Date().toISOString(),
        },
      },
    })
  }
  catch (error) {
    console.error('Failed to update onboarding progress', error)
  }
}
</script>

<template>
  <WidgetWrap :widget>
    <!-- Header with progress -->
    <template #action>
      <div class="flex gap-3 items-center">
        <span class="text-theme-600 text-xs dark:text-theme-400">{{ progress }}</span>
        <div class="w-32">
          <div class="h-1.5 bg-theme-200 dark:bg-theme-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 dark:bg-primary-600 rounded-full"
              :style="{ width: `${(completedSteps / totalSteps) * 100}%` }"
            />
          </div>
        </div>
      </div>
    </template>

    <div class="flex flex-col">
      <!-- Steps list -->
      <div class="space-y-2">
        <div
          v-for="step in steps"
          :key="step.id"
          class="p-4 transition-all duration-150"
          :class="[
            step.current ? 'bg-theme-50 dark:bg-theme-700/70 rounded-lg' : '',
          ]"
        >
          <div class="flex items-center gap-4">
            <!-- Status icon -->
            <div class="flex-shrink-0">
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center"
                :class="step.isCompleted
                  ? 'bg-primary-400 dark:bg-primary-800'
                  : step.current
                    ? 'border-2 border-theme-500 dark:border-white'
                    : 'border border-gray-300 dark:border-gray-600'"
              >
                <i
                  v-if="step.isCompleted"
                  class="i-tabler-check text-white text-lg"
                />
              </div>
            </div>

            <!-- Step title -->
            <div class="flex-grow">
              <span
                :class="step.isCompleted
                  ? 'text-theme-400 dark:text-theme-600'
                  : 'font-medium'"
              >
                {{ step.title }}
              </span>
            </div>

            <!-- Action button -->
            <div class="flex-shrink-0">
              <a
                :href="step.actionHref"
                class="font-medium text-sm transition-colors"
                :class="step.current
                  ? 'text-black dark:text-white'
                  : step.isCompleted
                    ? 'text-theme-500 dark:text-theme-400'
                    : 'text-theme-600 dark:text-theme-500'"
                @click="!step.isCompleted && markStepComplete(step.id)"
              >
                {{ step.actionLabel }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </WidgetWrap>
</template>
