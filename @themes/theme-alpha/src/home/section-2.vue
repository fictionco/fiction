<template>
  <section v-if="section2" :id="section2id" class="section2">
    <div class="mast title-wrap text-center">
      <h3 v-if="section2pretitle" v-formatted-text="section2pretitle" class="pretitle" />
      <h1 v-if="section2title" v-formatted-text="section2title" class="title" />
    </div>
    <div class="mast section2-inner">
      <div v-for="(item, i) in section2items" :key="i" class="item">
        <div class="item-icon">
          <img v-if="item.icon" :src="item.icon" :alt="item.title" />
        </div>
        <div class="item-content">
          <h2 v-if="item.title" class="item-title">{{ item.title }}</h2>
          <p v-if="item.content" class="item-description text-gray-600">{{ item.content }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      loading: true,
      section2: setting("home.section2"),
      section2id: setting("home.section2.id"),
      section2pretitle: setting("home.section2.pretitle"),
      section2title: setting("home.section2.title"),
      section2items: setting("home.section2.items")
    }
  },
  methods: {
    setting
  }
})
</script>
<style lang="less">
.section2 {
  padding: 4em 0;
  background: var(--color-bg-alt);

  .pretitle {
    color: var(--color-primary);
  }
  .title {
    margin-bottom: 2rem;
  }

  .section2-inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .item {
      display: grid;
      grid-template-columns: 80px 1fr;
      grid-gap: 2rem;
      padding: 2rem 1rem;
      border-radius: 0.5rem;
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

      .item-icon {
        display: flex;
        flex-direction: column;
      }
      .item-content {
        .item-title {
          font-weight: var(--font-weight-bold);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          @media (max-width: 900px) {
            font-size: 1.2rem;
          }
        }
        .item-description {
          line-height: 1.6rem;
        }
      }

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: 1rem;
        .item-icon {
          flex-direction: row;
        }
      }

      &:hover {
        background: #fff;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
    }
  }
}
</style>
