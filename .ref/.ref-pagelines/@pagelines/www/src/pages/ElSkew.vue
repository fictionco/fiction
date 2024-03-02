<script setup lang="ts">
defineProps({
  bgClass: { type: String, required: true },
})
</script>

<template>
  <div class="skew-wrap relative">
    <div class="skew-content text-theme-800 relative z-10">
      <slot />
    </div>
    <div
      class="skew-bg bg-theme-50 absolute z-0 ml-[-5%] w-[110%] -skew-x-2 -skew-y-2"
      :class="bgClass"
    />
  </div>
</template>

<style lang="less"></style>
