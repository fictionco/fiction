<template>
  <section class="faq">
    <div class="faq-header">
      <h2 class="title">Common Questions</h2>
      <div class="sub">Haven't found what you're looking for?</div>
      <factor-link path="/contact">Contact Us &rarr;</factor-link>
    </div>
    <div class="faq-answers">
      <div v-for="(faq, i) in faqs" :key="i" class="answer">
        <div class="answer-title">{{ faq.question }}</div>
        <div v-formatted-text="faq.answer" class="answer-text" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink },
  data() {
    return {
      faqs: [
        {
          question: "Can I use Factor for client projects?",
          answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/docs">Read more →</a>`,
        },
        {
          question: "How do I get started?",
          answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/install">Read more →</a>`,
        },
        {
          question: "Can I buy a lower suite and upgrade later?",
          answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/docs">Read more →</a>`,
        },
        {
          question: "What if I don't like it?",
          answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/docs">Read more →</a>`,
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <a href="/docs">Read more →</a>`,
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.faq {
  padding: 3rem 0;

  .faq-header {
    padding-bottom: 3rem;
    .title {
      font-size: 2em;
      font-weight: var(--font-weight-bold);
    }
    .sub {
      color: var(--color-text-secondary);
    }
  }
  .faq-answers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3rem 4rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .answer-title {
      font-weight: 700;
      font-size: 1.2em;
      line-height: 1.5em;
    }
    .answer-text {
      line-height: 1.7em;
      opacity: 0.85;
      margin-top: 0.5rem;
    }
  }
}
</style>
