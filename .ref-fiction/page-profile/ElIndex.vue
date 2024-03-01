<script setup lang="ts">
import type { EndpointResponse, User } from '@factor/api'
import { useMeta, useService, vue } from '@factor/api'
import AppWrap from '../el/AppWrap.vue'
import cover from './cover.jpg'
import avatar from './avatar.png'

const { factorUser, factorRouter } = useService()

const profileData = vue.ref<EndpointResponse<User>>()
const profile = vue.computed(() => profileData.value?.data)

useMeta({
  title: 'AI Photo and Avatar Generator | Fiction',
  meta: [
    {
      name: `description`,
      content: `Fiction helps you create custom AI avatars, mockups, and more. Upload your photos and get started.`,
    },
  ],
})

async function setPublicUser() {
  const username = factorRouter.current.value.params.username as
    | string
    | undefined

  if (!username) {
    profileData.value = { status: 'error', message: 'no username provided' }
    return
  }
  const result = await factorUser.requests.ManageUser.request({
    _action: 'getPublic',
    username,
  })
  profileData.value = result
}

vue.onServerPrefetch(async () => {
  await setPublicUser()
})

vue.onMounted(async () => {
  if (!profileData.value)
    await setPublicUser()
})
</script>

<template>
  <AppWrap
    class="homepage text-theme-800 from-theme-100 to-theme-50 bg-gradient-to-br"
  >
    <div class=" ">
      <div
        :style="{ backgroundImage: `url(${cover})` }"
        class="h-[33vh] bg-cover"
      />
      <div class="mx-auto max-w-screen-lg">
        <div class="flex space-x-6 px-12 py-4">
          <div class="relative h-48 w-48">
            <img
              :src="avatar"
              class="absolute bottom-[80%] rounded-md border-2 border-white shadow-md"
            >
          </div>
          <div class="grow text-2xl font-extrabold tracking-tight lg:text-3xl">
            {{ profile?.fullName }}
          </div>
          <div
            class="sub text-theme-500 my-2 max-w-2xl text-lg font-normal lg:text-xl"
          >
            @{{ profile?.username }}
          </div>
        </div>
      </div>
    </div>
  </AppWrap>
</template>

<style lang="less"></style>
