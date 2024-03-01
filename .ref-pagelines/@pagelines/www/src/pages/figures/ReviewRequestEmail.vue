<script lang="ts" setup>
import FigurePhone from './FigurePhone.vue'
import EmailVector from './EmailVector.svg'
</script>

<template>
  <FigurePhone class="shadow-xl" layout="email">
    <img class="w-full" :src="EmailVector">
  </FigurePhone>
</template>
