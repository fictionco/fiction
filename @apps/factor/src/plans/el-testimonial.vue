<template>
  <div class="testimonial">
    <div class="header">
      <h2 class="title">What customers are saying...</h2>
      <div class="sub">Professional and businesses love using Factor.</div>
    </div>
    <div class="figure">
      <div v-for="(item, i) in testimonials" :key="i" class="single">
        <div class="text">{{ item.text }}</div>
        <div class="citation">
          <factor-avatar email="justin@elasticbyte.net" />
          <div class="name">
            <div class="name">{{ item.name }}</div>
            <div class="link">
              <factor-link :path="item.link">{{ item.linkText }}</factor-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorLink, factorAvatar } from "@factor/ui"
export default Vue.extend({
  components: { factorLink, factorAvatar },
  data() {
    return {
      testimonials: [
        {
          text:
            "When I moved from a static site to Factor, traffic blew up. Once you see what Factor can do for you, Pro is a given.",
          name: "Justin Keller",
          link: "https://elasticbyte.net",
          linkText: "Elastic Byte",
        },
      ],
    }
  },
})
</script>

<style lang="less" scoped>
.testimonial {
  margin: 8rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 3rem;
  .title {
    font-size: 2em;
    font-weight: var(--font-weight-bold);
    line-height: 1.1;
    margin-bottom: 1rem;
  }
  .sub {
    color: var(--color-text-secondary);
  }
  .figure {
    justify-self: center;
    .text {
      font-size: 1.3em;
      margin-bottom: 1rem;
      font-style: italic;
      color: var(--color-text-secondary);
    }
    .citation {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .factor-avatar {
        margin-right: 1rem;
      }
      .name {
        font-weight: var(--font-weight-bold);
        line-height: 1.5;
      }
    }
  }
  @media (max-width: 900px) {
    margin: 4rem 0;
    grid-template-columns: 1fr;
    .title {
      font-size: 1.5em;
    }
  }
}
</style>
