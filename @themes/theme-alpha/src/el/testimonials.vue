<template>
  <div v-if="items" class="testimonials">
    <div v-for="(item, i) in items" :key="i" class="testimonial">
      <div v-if="item.image" class="item-image">
        <img :src="item.image" :alt="item.author" />
      </div>
      <p v-if="item.content" v-formatted-text="item.content" class="item-content" />
      <h2 v-if="item.author" v-formatted-text="item.author" class="item-author" />
      <h3 v-if="item.info" v-formatted-text="item.info" class="item-info" />
    </div>
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api"

export default {
  props: {
    items: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      loading: true,
    }
  },
  methods: { setting },
}
</script>

<style lang="less">
.testimonials {
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .testimonial {
    border-radius: 0.5rem;
    margin-top: 4rem;
    padding: 2rem;
    line-height: 1.6rem;
    transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    background: #e5e8f3;
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.05);

    &:hover {
      background: none;
      box-shadow: none;
      padding: 1.5rem 2rem 2rem;
    }

    .item-image {
      margin: -4rem auto 1rem;
      img {
        width: 100px;
        border-radius: 50%;
        background: var(--color-bg-dark);
        box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.15), 0px 5px 5px rgba(0, 0, 0, 0.05);
      }
    }
    .item-author {
      font-weight: var(--font-weight-bold);
    }
    .item-info,
    .item-content {
      opacity: 0.5;
    }
    .item-info {
      font-size: 0.9rem;
    }
    .item-content {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
  }
}
</style>
