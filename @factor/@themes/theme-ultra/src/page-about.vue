<template>
  <section id="aboutContainerID" class="page-container about-container">
    <div class="about-content">
      <div class="content-photo">
        <div>
          <h2 class="pretitle">{{ $setting.get('about.pretitle') }}</h2>
          <h1 class="title">{{ $setting.get('about.title') }}</h1>
          <p class="text">{{ $setting.get('about.content') }}</p>
        </div>
        <div class="photo-wrap">
          <div class="photo">
            <img :src="$setting.get('about.picture')" :alt="$setting.get('about.title')" >
          </div>
        </div>
      </div>
      <div class="counter">
        <div v-for="(item, i) in $setting.get('about.counter')" :key="i" class="item">
          <div class="item-number">{{ item.number }}</div>
          <div class="item-text">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

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
    }

    .pretitle {
      color: var(--color-primary);
      font-size: 1.4em;
    }
    .title {
      font-size: 3.2em;
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.03em;
      line-height: 1.1;
      color: var(--color-text-dark);
      margin-bottom: 1rem;
    }
    .text {
      color: var(--color-text-dark);
      font-size: 1.2rem;
    }
    .photo-wrap {
      .photo {
        position: relative;
        img {
          width: 100%;
          position: relative;
          z-index: 1;
        }
        &:before {
          content: "";
          width: 100%;
          position: absolute;
          top: -10px;
          bottom: 16px;
          left: 12px;
          right: -10px;
          border: 4px solid var(--color-primary);
        }
        &:after {
          content: "";
          position: absolute;
          top: -20px;
          bottom: 28px;
          left: 26px;
          right: -22px;
          border: 4px solid var(--color-primary);
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
      color: var(--color-text-dark);
    }
    .item-text {
      color: var(--color-primary);
    }
  }
}
</style>