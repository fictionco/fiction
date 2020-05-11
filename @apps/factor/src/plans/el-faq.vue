<template>
  <div class="faq">
    <div class="faq-header">
      <h2 class="title">Common Questions</h2>
      <div class="sub">Haven't found what you're looking for?</div>
      <factor-link path="/contact">Contact Us &rarr;</factor-link>
    </div>
    <div class="faq-answers">
      <div v-for="(faq, i) in faqs" :key="i" class="answer">
        <div class="answer-title">{{ faq.question }}</div>
        <div class="answer-text">{{ faq.answer }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink },
  data() {
    return {
      faqs: [
        {
          question: "How to X?",
          answer: "I dont know",
        },
        {
          question: "How to X?",
          answer: "I dont know",
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.faq {
  display: grid;
  grid-template-columns: 1fr 1fr;
  .faq-header {
    .title {
      font-size: 2em;
      font-weight: var(--font-weight-bold);
    }
    .sub {
      color: var(--color-text-secondary);
    }
  }
}
</style>
