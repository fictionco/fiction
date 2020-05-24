<template>
  <div class="plans">
    <div class="plans-content">
      <plan-table class="plans-table" />

      <section class="plans-quotes">
        <h2 class="title">What users are saying...</h2>
        <plan-quotes />
      </section>

      <!-- <plan-guarantee />
      <plan-testimonial />-->

      <plan-faq />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  components: {
    planTable: () => import("./el-table.vue"),
    planQuotes: () => import("./el-quotes.vue"),
    planFaq: () => import("./el-faq.vue"),
    // planTestimonial: () => import("./el-testimonial.vue"),
    // planGuarantee: () => import("./el-guarantee.vue"),
  },
}
</script>

<style lang="less">
.plans {
  padding: 3rem 1rem 5rem;
  .plans-content {
    margin: 0 auto;
    //max-width: 900px;
    max-width: 1100px;
  }

  .plans-table {
    padding: 1rem 2rem;

    @media (max-width: 900px) {
      padding: 1rem 0;
    }
  }

  .plans-quotes {
    padding: 3rem 0;

    .title {
      text-align: center;
      font-weight: var(--font-weight-bold, 700);
      margin-bottom: 6rem;
      text-transform: uppercase;
      color: var(--color-text-secondary);
    }
  }
}
</style>
