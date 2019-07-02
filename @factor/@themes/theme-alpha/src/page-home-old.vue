<template>
  <div class="landing">
    <div class="container">
      <section class="intro">
        <div class="intro-inner">
          <h3 class="pre-title">Alpha Theme</h3>
          <h1 class="title">
            Hello, I’m Alpha.
            <br >A minimal, personal or portfolio theme.
          </h1>
          <div
            class="subtitle"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</div>

          <div class="actions">
            <factor-link path="/how-it-works" btn="default" size="large">
              View Work
              <i class="fa fa-angle-right" />
            </factor-link>
          </div>
        </div>
      </section>

      <section class="boxes">
        <div class="title">{{ $setting.get('post.boxesTitle') }}</div>

        <div class="mast boxes-inner">
          <div v-for="(box, i) in $setting.get('post.boxes')" :key="i" class="box">
            <div v-if="box.icon" class="box-icon">
              <!-- <img :src="box.icon[0].url" > -->
            </div>
            <h2 class="box-title">{{ box.heading }}</h2>
            <p class="box-description">{{ box.description }}</p>
          </div>
        </div>
      </section>

      <!-- <section class="feature-boxes">
        <div v-for="(box, i) in post.boxes" :key="i" class="box">
          <div v-if="box.icon" class="box-icon">
            <img :src="box.icon[0].url">
          </div>
          <div class="box-heading">{{ box.heading }}</div>
          <div class="box-description">{{ box.description }}</div>
        </div>
      </section>-->

      <section class="boxes">
        <div class="title">Skills &amp; Expertise</div>

        <div class="mast boxes-inner">
          <div class="box">
            Icon
            <h2>Skill Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
          <div class="box">
            Icon
            <h2>Skill Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
          <div class="box">
            Icon
            <h2>Skill Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
          <div class="box">
            Icon
            <h2>Skill Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.</p>
          </div>
        </div>
      </section>

      <el-cta />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    "el-cta": () => import("./el/cta")
  },
  data() {
    return {
      loading: true
    }
  },
  metatags() {
    return {
      title: this.$setting.get("home.meta.title"),
      description: this.$setting.get("home.meta.description")
    }
  }
}
</script>
<style lang="less">
.container {
  .mast {
    padding: 0 2em;
    line-height: 1.2;
    max-width: 1000px;
    margin: 0 auto;
  }

  // Intro
  .intro {
    background-color: var(--color-primary);
    color: var(--color-white);

    .intro-inner {
      display: flex;
      align-items: center;
      text-align: center;
      flex-direction: column;
      max-width: 650px;
      margin: 0 auto;
      padding: 7em 0;
      @media (max-width: 767px) {
        padding: 4em 0;
      }
      .pre-title {
        position: relative;
        padding-bottom: 2em;
        text-transform: uppercase;
        &:after {
          background-color: var(--color-tertiary);
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 24px;
          height: 7px;
          margin: -3.5px 0 0 -12px;
          transform: skewY(-16deg) scaleX(1);
          transform-origin: 0 100%;
        }
      }
      .title {
        font-weight: 600;
        font-size: 3em;
        letter-spacing: -0.03em;
        margin: 0.5em;
        @media (max-width: 767px) {
          font-size: 2em;
        }
      }
      .subtitle {
        opacity: 0.5;
        font-size: 1.2em;
        font-weight: 500;
        @media (max-width: 767px) {
          font-size: 1.2em;
        }
      }
      .factor-btn.default {
        color: var(--color-primary);
        letter-spacing: -0.03em;
      }
      .actions {
        margin-top: 1.5em;
      }
    }
  }

  //Boxes
  .boxes {
    padding: 2em 0;
    .title {
      font-weight: 600;
      font-size: 2.4em;
      letter-spacing: -0.03em;
      margin-bottom: 0.2em;
      text-align: center;
      @media (max-width: 767px) {
        font-size: 2em;
      }
    }
    .boxes-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 80px;
      align-items: center;

      .box {
        text-align: center;
      }
    }
  }

  .brands {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 80px;
    align-items: center;
    padding: 2em 0;
    width: 80%;
    margin: 0 auto;
    @media (max-width: 767px) {
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 20px;
      justify-content: center;
    }
    .brand {
      text-align: center;
      opacity: 0.3;
      &:hover {
        opacity: 1;
      }
      img {
        max-width: 100px;
        max-height: 40px;
        width: auto;
      }
    }
  }
} // .home-container ends
</style>
