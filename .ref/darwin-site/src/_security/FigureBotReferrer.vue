<template>
  <div class="my-12">
    <div class="figure-stage max-w-screen-lg m-auto relative">
      <img
        class="shadow-xl ring-1 ring-black ring-opacity-10 rounded-md"
        :src="screenBotReferrer"
        alt="Bot Flagging - Referrer"
      />
    </div>
  </div>
</template>

<script lang="ts">
import screenBotReferrer from "./img/screenBotReferrer.webp"
export default {
  setup() {
    return { screenBotReferrer }
  },
}
</script>
<style lang="less" scoped></style>
