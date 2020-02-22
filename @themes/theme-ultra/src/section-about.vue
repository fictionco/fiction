<template>
  <section id="about" class="page-container about-container">
    <div class="about-inner">
      <div class="content-photo">
        <div class="content-wrap">
          <h2 v-if="aboutPretitle" v-formatted-text="aboutPretitle" class="pretitle" />
          <h1 v-if="aboutTitle" v-formatted-text="aboutTitle" class="title" />
          <p v-if="aboutContent" v-formatted-text="aboutContent" class="content text-gray-700" />
        </div>
        <div class="photo-wrap">
          <div class="photo">
            <img :src="aboutPhoto" :alt="aboutTitle" class="rounded-lg" />
          </div>
        </div>
      </div>
      <div class="career">
        <h4 v-if="aboutCareerTitle" v-formatted-text="aboutCareerTitle" class="title" />
        <ul class="career-list text-gray-700 rounded-lg">
          <li v-for="(item, index) in aboutCareerItems" :key="index" class="career-item rounded-lg">
            <span v-if="item.left" v-formatted-text="item.left" class="item-left" />
            <span v-if="item.middle" v-formatted-text="item.middle" class="item-middle" />
            <span v-if="item.right" v-formatted-text="item.right" class="item-right" />
          </li>
        </ul>
      </div>
      <div class="counter">
        <div v-for="(item, i) in aboutCounter" :key="i" class="item text-gray-700">
          <div class="item-number">{{ item.number }}</div>
          <div class="item-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { setting } from "@factor/api/settings"
import Vue from "vue"
export default Vue.extend({
  data() {
    return {
      aboutPretitle: setting("about.pretitle"),
      aboutTitle: setting("about.title"),
      aboutContent: setting("about.content"),
      aboutPhoto: setting("about.photo"),
      aboutCounter: setting("about.counter"),
      aboutCareerTitle: setting("about.career.title"),
      aboutCareerItems: setting("about.career.items")
    }
  },
  methods: { setting }
})
</script>

<style lang="less">
.about-container {
  background: var(--color-bg-alt);
  padding: 4em 8em;
  align-items: center;

  .content-photo {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      .photo-wrap {
        justify-self: center;
      }
    }

    .pretitle {
      color: var(--color-primary);
      font-size: 1.4em;
      @media (max-width: 900px) {
        font-size: 1.2rem;
      }
    }
    .title {
      font-size: 3.2em;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 1rem;
      @media (max-width: 900px) {
        font-size: 2.2rem;
      }
    }
    .content {
      font-size: 1.2rem;
    }
    .photo-wrap {
      .photo {
        position: relative;
        transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

        @media (max-width: 900px) {
          max-width: 400px;
        }
        img {
          width: 100%;
          position: relative;
          z-index: 1;
        }
        &:before,
        &:after {
          content: "";
          width: 100%;
          position: absolute;
          border-radius: 0.5em;
          border: 4px solid var(--color-primary);
        }
        &:before {
          top: -10px;
          bottom: 16px;
          left: 12px;
          right: -10px;
        }
        &:after {
          top: 0;
          right: 0;
          bottom: 8px;
          left: 0;
          transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        &:hover {
          transform: rotate3d(1, 1, 1, 2deg);
          &:after {
            top: -20px;
            bottom: 28px;
            left: 26px;
            right: -22px;
          }
        }
      }
    }
  }

  .counter {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-content: space-around;
    margin: 2rem auto;
    text-align: center;

    .item-number {
      font-size: 4em;
      font-weight: var(--font-weight-bold);
    }
    .item-text {
      font-weight: var(--font-weight-semibold);
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .career {
    margin: 2rem auto 0;

    .title {
      font-size: 2rem;
      font-weight: var(--font-weight-semibold);
      letter-spacing: -0.03em;
      margin-bottom: 1.5rem;
    }

    .career-list {
      display: grid;
      grid-gap: 1em;
      padding: 1.5em 0;
      background: rgba(0, 0, 0, 0.03);
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.05);
      list-style: none;
      transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

      &:hover {
        background: none;
        box-shadow: none;
      }
      .career-item {
        display: grid;
        grid-template-columns: 2fr 3fr 1fr;
        grid-gap: 1em;
        align-items: center;
        padding: 0.5em 2em;
        letter-spacing: -0.03em;
        transition: 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

        &:hover {
          background: rgba(0, 0, 0, 0.03);
          box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.05);
        }
        .item-left,
        .item-middle {
          font-weight: 600;
        }
        .item-middle {
          font-size: 1.2em;
        }
        .item-right {
          text-align: right;
          opacity: 0.5;
        }

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          grid-gap: 0;

          .item-left,
          .item-right {
            font-size: 0.9em;
          }
          .item-right {
            text-align: left;
          }
        }
      }
    }
  }

  @media (max-width: 900px) {
    padding: 6em 2em 3em;
  }
}
</style>
