<template>
  <div class="plans">
    <div class="plans-content">
      <plan-table class="plans-table" />
      <plan-guarantee />
      <plan-testimonial />
      <!-- <plan-faq /> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
export default Vue.extend({
  components: {
    planTable: () => import("./el-table.vue"),
    //planFaq: () => import("./el-faq.vue"),
    planTestimonial: () => import("./el-testimonial.vue"),
    planGuarantee: () => import("./el-guarantee.vue"),
  },
})
</script>

<style lang="less">
.plans {
  padding-top: 5rem;
  .plans-content {
    margin: 0 auto;
    max-width: 900px;
  }
}
</style>
