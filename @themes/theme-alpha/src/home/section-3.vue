<template>
  <section v-if="section3" :id="section3id" class="section3">
    <div class="mast">
      <div class="title-wrap">
        <div>
          <h3 v-if="section3pretitle" v-formatted-text="section3pretitle" class="pretitle" />
          <h1 v-if="section3title" v-formatted-text="section3title" class="title" />
        </div>
        <div v-if="section3Buttons" class="buttons">
          <template v-for="(button, i) in section3Buttons">
            <factor-link
              v-if="button.link"
              :key="i"
              v-formatted-text="button.text"
              :path="button.link"
              :class="button.classes"
            />
          </template>
        </div>
      </div>
    </div>

    <div class="mast">
      <div class="work-posts-wrap">
        <div v-if="thePosts.length > 0" class="work-posts posts-index">
          <div v-for="post in thePosts" :key="post._id" class="work-post">
            <component
              :is="setting(`work.components.${comp}`)"
              v-for="(comp, i) in setting('work.layout.index')"
              :key="i"
              :post-id="post._id"
              format="index"
            />
          </div>
        </div>
        <div v-else class="posts-not-found">
          <div class="text">
            <div class="font-normal tracking-tight text-2xl">{{ setting("work.notFound.title") }}</div>
            <div class="sub-title">{{ setting("work.notFound.subTitle") }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api"
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink
  },
  props: {
    thePosts: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: true,
      section3: setting("home.section3"),
      section3id: setting("home.section3.id"),
      section3pretitle: setting("home.section3.pretitle"),
      section3title: setting("home.section3.title"),
      section3Buttons: setting("home.section3.buttons")
    }
  },
  methods: {
    setting
  }
})
</script>
<style lang="less">
/**
  * Work section
  */
.section3 {
  padding: 4em 0;
  .title-wrap {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;

    .pretitle {
      color: var(--color-primary);
    }
    .buttons {
      justify-self: flex-end;
    }
    @media (max-width: 900px) {
      grid-gap: 1rem;
      grid-template-columns: 1fr;
      .buttons {
        justify-self: flex-start;
      }
    }
  }
  .work-posts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .work-post {
      .entry-headers {
        margin: -2rem 1rem 0;
        padding: 1rem;
        background: #fff;
        border-radius: 0.5rem;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

        .entry-title {
          font-weight: var(--font-weight-bold);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          a {
            color: inherit;
            &:hover {
              color: var(--color-primary);
            }
          }
        }
        .entry-subtitle {
          line-height: 1.6rem;
        }
      }

      &:hover {
        .entry-headers {
          margin: -3rem 1rem 1rem;
          margin-bottom: 1rem;
          box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.15), 0px 5px 5px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }
}
</style>
