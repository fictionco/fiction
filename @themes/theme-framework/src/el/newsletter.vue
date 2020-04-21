<template>
  <section class="newsletter">
    <h2 v-formatted-text="newsletterTitle" class="title" />
    <div v-formatted-text="newsletterContent" class="text" />
    <factor-email-list list-id="emailList" class="action" />
  </section>
</template>

<script lang="ts">
import { setting } from "@factor/api"
import { factorEmailList } from "@factor/plugin-email-list"
export default {
  components: { factorEmailList },
  data() {
    return {
      newsletterTitle: setting("site.newsletter.title"),
      newsletterContent: setting("site.newsletter.content"),
    }
  },
}
</script>

<style lang="less">
.newsletter {
  margin: 0 auto;
  max-width: 600px;
  padding: 6rem 2rem;
  text-align: center;

  .title {
    font-size: 3em;
  }
  .text {
    font-size: 1.3em;
    margin-bottom: 2rem;
  }
  // @media (max-width: 900px) {
  //   text-align: left;
  //   padding: 7rem 0;
  //   .title {
  //     font-size: 2em;
  //   }
  // }
}
</style>
