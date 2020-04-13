<template>
  <section v-if="section4" :id="section4.id" class="section4">
    <div class="mast">
      <h3 v-if="section4pretitle" v-formatted-text="section4pretitle" class="pretitle" />
      <h1 v-if="section4title" v-formatted-text="section4title" class="title" />
    </div>
    <el-testimonials :items="section4items" class="mast section4-inner" />
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  components: {
    "el-testimonials": () => import("../el/testimonials.vue"),
  },
  data() {
    return {
      loading: true,
      section4: setting("home.section4"),
      section4id: setting("home.section4.id"),
      section4pretitle: setting("home.section4.pretitle"),
      section4title: setting("home.section4.title"),
      section4items: setting("home.section4.items"),
    }
  },
  methods: {
    setting,
  },
})
</script>
<style lang="less">
/**
  * Testimonials section
  */
.section4 {
  padding: 4em 0;
  background: var(--color-bg-alt);

  .title-wrap {
    margin-bottom: 2rem;
    .pretitle {
      color: var(--color-primary);
    }
  }
}
</style>
