<script lang="ts" setup>
import LogoTesla from './LogoTesla.svg'
import ChatScreen from './ChatScreen.svg'
</script>

<template>
  <div
    class="stage max-w-lg mx-auto relative"
    :style="{ perspective: `800px` }"
  >
    <div
      class="absolute -bottom-12 -right-12 z-10"
      :style="{ transform: `rotateY(-13deg) rotateZ(4deg)` }"
    >
      <div
        class="shadow-xl w-48 bg-white text-xs text-left text-slate-800 p-4 rounded-lg ring-1 ring-black ring-opacity-5"
      >
        <img class="w-12 mb-4" :src="LogoTesla">
        <div class="space-y-2">
          <div class="bg-slate-100 p-2 ml-6 rounded-md">
            I have a question...
          </div>
          <div class="bg-green-500 text-white p-2 mr-6 rounded-md">
            We got your message. The team will text you.
          </div>
        </div>
      </div>
    </div>
    <img
      class="shadow-lg w-full md:max-w-2xl ring-black ring-opacity-10 ring-1 rounded-lg"
      :src="ChatScreen"
    >
  </div>
</template>
