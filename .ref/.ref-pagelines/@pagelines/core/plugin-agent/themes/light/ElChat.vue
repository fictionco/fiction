<script lang="ts" setup>
import { onEvent, vue, waitFor } from '@factor/api'
import ElForm from '@factor/ui/ElForm.vue'
import ElMenu from '@factor/ui/ElMenu.vue'
import ElIcon from '../../../ui/ElIcon.vue'
import type { ChatAgent } from '../../obj'
import type { IconKeys } from '../../../ui/StandardIcon.vue'
import StandardIcon from '../../../ui/StandardIcon.vue'
import ElChatBubble from './ElChatBubble.vue'

const props = defineProps({
  agent: {
    type: Object as vue.PropType<ChatAgent>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const userInput = vue.ref('')
const chatList = vue.ref<HTMLElement>()
const isMounted = vue.ref(false)
const hasUserMessages = vue.computed(() => {
  return props.agent.messages.value.some(m => m.role.value === 'user')
})
function smoothScrollToBottom(duration: number) {
  const li = chatList.value
  if (!li)
    return

  const start = li.scrollTop
  const end = li.scrollHeight - li.clientHeight
  const change = end - start
  let startTime: number | null = null

  function animateScroll(currentTime: number) {
    if (startTime === null)
      startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    if (li)
      li.scrollTop = start + change * progress

    if (progress < 1)
      window.requestAnimationFrame(animateScroll)
  }

  window.requestAnimationFrame(animateScroll)
}
onEvent('chat:scrollBottom', async () => {
  await waitFor(30)
  smoothScrollToBottom(250)
})
vue.onMounted(async () => {
  setTimeout(() => {
    isMounted.value = true
  }, 300)

  vue.watch(
    () => props.agent.messages.value,
    async () => {
      await waitFor(30)
      smoothScrollToBottom(250)
    },
    { immediate: true },
  )

  await props.agent.initializeMessages()
})

async function sendMessage() {
  const content = userInput.value
  userInput.value = ''
  await props.agent.userMessage({ content })
}
</script>

<template>
  <div class="text-theme-800 flex h-full w-full flex-col">
    <div
      class="action-theme transition-all duration-500"
      :class="!isMounted ? 'opacity-0' : 'opacity-100'"
    >
      <div class="head bg-action-main text-action-contrast">
        <div
          class="mx-auto flex max-w-screen-md items-center justify-between px-6 py-3"
        >
          <div class="flex items-center space-x-2">
            <div
              class="flex items-center justify-center rounded-lg p-1 text-center transition-all"
              :class="hasUserMessages ? 'p-1' : 'py-6 px-1'"
            >
              <StandardIcon
                :icon-key="agent.options.value.iconButton as IconKeys"
                :class="hasUserMessages ? 'h-6 w-6' : 'h-8 w-8'"
              />
            </div>
            <div
              class="font-bold"
              :class="hasUserMessages ? 'text-sm' : 'text-2xl'"
            >
              {{ agent.options.value.displayName || "AI Assistant" }}
            </div>
          </div>
          <div class="">
            <ElMenu
              :list="[
                {
                  value: 'close',
                  name: 'Reset Conversation',
                  callback: () => agent.reset(),
                },
                {
                  value: 'close',
                  name: 'Close',
                  callback: () => agent.close(),
                },
              ]"
              direction="left"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      id="chatList"
      ref="chatList"
      class="grow overflow-scroll"
    >
      <div class="mx-auto max-w-screen-md p-6">
        <ElChatBubble
          v-for="(message, i) in agent.messages.value"
          :key="i"
          :message="message"
        />
      </div>
    </div>
    <div class="py-1">
      <div class="mx-auto max-w-screen-md px-6 py-1">
        <div
          v-if="agent.messagesSuggested.value.length > 0"
          class="no-scrollbar mb-2 flex flex-nowrap space-x-2 overflow-scroll"
        >
          <div
            v-for="(txt, i) in agent.messagesSuggested.value"
            :key="i"
            class="text-theme-600 border-theme-300 bg-theme-100 hover:border-theme-400 my-1 cursor-pointer whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium opacity-60 shadow-sm hover:opacity-100"
            @click.stop="agent.userMessage({ content: txt })"
          >
            {{ txt }}
          </div>
        </div>
        <ElForm
          class="border-theme-300 bg-theme-100 focus-within:border-theme-400 flex rounded-md border p-1 pl-3 shadow-sm focus-within:shadow"
          @submit="sendMessage()"
        >
          <input
            v-model="userInput"
            type="text"
            aria-label="chat input"
            required
            maxlength="750"
            class="text-theme-900 min-w-0 flex-auto appearance-none rounded-md border-none bg-transparent outline-none ring-0 focus:outline-none focus:ring-0 sm:text-sm"
            spellcheck="false"
          >
          <button
            type="submit"
            class="text-theme-400 hover:text-action-main flex-none p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              class="h-6 w-6 origin-center"
            >
              <path
                d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
              />
            </svg>
          </button>
        </ElForm>
      </div>
      <div class="py-1 text-center text-xs">
        <a
          class="text-theme-400 hover:text-action-main my-2 inline-flex items-center justify-center space-x-1 text-center tracking-tight"
          href="https://www.pagelines.com"
          target="_blank"
        >
          <ElIcon class="t inline-block w-4" />
          <span class="">Powered by PageLines</span>
        </a>
      </div>
    </div>
  </div>
</template>
