<template>
  <section class="faq">
    <div class="faq-header">
      <h2 class="title">Common Questions</h2>
      <div class="sub">
        Have a question?
        <factor-link path="/contact">Contact Us &rarr;</factor-link>
      </div>
    </div>
    <div class="faq-answers">
      <div v-for="(faq, i) in faqs" :key="i" class="answer">
        <div class="icon">
          <plan-icon icon="question" />
        </div>
        <div>
          <div class="answer-title">{{ faq.question }}</div>
          <div v-formatted-text="faq.answer" class="answer-text" />
          <factor-link v-if="faq.more" :path="faq.more">More &rarr;</factor-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { factorLink } from "@factor/ui"
export default {
  components: { factorLink, planIcon: () => import("./icons.vue") },
  data() {
    return {
      faqs: [
        {
          question: "Can I use Factor for client projects?",
          answer: `You can use Factor Pro / Business on unlimited sites you own or manage. You should purchase additional licenses with your client accounts which we'll provide a discounted rate.`,
        },
        {
          question: "How do I get started?",
          answer: `Once you purchase a premium suite, all that you need to do is add your Factor API key to your apps environmental variables.`,
          more: "https://factor.dev/docs/pro-suite",
        },
        {
          question: "Can I buy a lower suite and upgrade later?",
          answer: `Yes, satisfaction is our priority so feel free to buy whatever package you're comfortable with. You can upgrade or downgrade at any time.`,
        },
        {
          question: "What if I don't like it?",
          answer: `Factor offers a 30-day no questions asked money back guarantee.`,
        },
        {
          question: "What happens to my site when I cancel?",
          answer: `Pro features are carefully selected. They are meant to be additive and subtle so if you cancel your site will look and feel the same.`,
        },
      ],
    }
  },
}
</script>

<style lang="less" scoped>
.faq {
  padding: 4rem 0;

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

    .answer {
      display: grid;
      grid-template-columns: 2.6rem 1fr;

      .icon {
        opacity: 0.5;
      }
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
