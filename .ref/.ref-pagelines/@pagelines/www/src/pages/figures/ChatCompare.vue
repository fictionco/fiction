<script lang="ts" setup>
import LogoTesla from './LogoTesla.svg'
</script>

<template>
  <div
    class="stage relative mx-auto max-w-lg"
    :style="{ perspective: `800px` }"
  >
    <div class="grid grid-cols-2 gap-8">
      <div class="">
        <div class="text-theme-500 mb-2 text-sm font-bold">
          Standard Webchat
        </div>
        <div
          class="text-theme-800 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
        >
          <img class="mb-4 w-12" :src="LogoTesla">
          <div class="space-y-2">
            <div class="bg-theme-100 ml-6 rounded-md p-2">
              I have a question...
            </div>
            <div class="bg-theme-500 mr-6 rounded-md p-2 text-white">
              No one is available to talk right now.
            </div>
            <div class="text-theme-400 mr-6 rounded-md p-2 text-[10px]">
              The customer has disconnected.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="text-theme-500 mb-2 text-sm font-bold">
          Kaption SMS
        </div>
        <div
          class="text-theme-800 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
        >
          <img class="mb-4 w-12" :src="LogoTesla">
          <div class="space-y-2">
            <div class="bg-theme-100 ml-6 rounded-md p-2">
              I have a question...
            </div>
            <div class="mr-6 rounded-md bg-green-500 p-2 text-white">
              We got your message. The team will text you.
            </div>
          </div>
        </div>
        <div class="text-theme-500 mt-8 mb-2 text-sm font-bold">
          Later...
        </div>
        <div
          class="text-theme-800 rounded-lg bg-white p-4 text-left text-xs shadow-xl ring-1 ring-black/5"
        >
          <img class="mb-4 w-12" :src="LogoTesla">
          <div class="space-y-2">
            <div class="mr-6 rounded-md bg-green-500 p-2 text-white">
              Hi Jon, how can we help you..
            </div>
            <div class="bg-theme-100 ml-6 rounded-md p-2">
              I'd like to set an appointment for a test drive..
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
