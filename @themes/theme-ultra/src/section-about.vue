<template>
  <section id="about" class="page-container about-container">
    <div class="about-content">
      <div class="content-photo">
        <div class="content-wrap">
          <h2 class="pretitle">{{ setting('about.pretitle') }}</h2>
          <h1 class="title">{{ setting('about.title') }}</h1>
          <p class="text">{{ setting('about.content') }}</p>
        </div>
        <div class="photo-wrap">
          <div class="photo">
            <img :src="setting('about.picture')" :alt="setting('about.title')" />
          </div>
        </div>
      </div>
      <div class="counter">
        <div v-for="(item, i) in setting('about.counter')" :key="i" class="item">
          <div class="item-number">{{ item.number }}</div>
          <div class="item-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { setting } from "@factor/tools"
export default { methods: { setting } }
</script>

<style lang="less">
.about-container {
  background: var(--color-bg-alt);
  padding: 4em 8em;
  align-items: center;

  @media (max-width: 900px) {
    padding: 3em 2em;
  }

  .content-photo {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 2rem;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      .content-wrap {
        order: 2;
      }
      .photo-wrap {
        order: 1;
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
    .text {
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
          border-radius: 4px;
        }
        &:before,
        &:after {
          content: "";
          width: 100%;
          position: absolute;
          border-radius: 4px;
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
    margin-top: 1rem;
    text-align: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr 1fr;
    }

    .item-number {
      font-size: 4em;
      font-weight: var(--font-weight-bold);
    }
    .item-text {
      color: var(--color-primary);
    }
  }
}
</style>