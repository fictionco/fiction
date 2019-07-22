<template>
  <div class="home">
    <section
      class="splash-wrap"
      :style="{'background-image': `url(`+ $setting.get('home.graphic') + `)` }"
    >
      <div class="splash mast">
        <div class="splash-content">
          <h1 class="title">{{ $setting.get('home.headline') }}</h1>
          <p class="subtitle">{{ $setting.get('home.subHeadline') }}</p>
          <div class="actions">
            <app-link
              v-for="(action ,i) in $setting.get('home.actions')"
              :key="i"
              :path="action.path"
              :btn="action.btn"
              size="large"
            >{{ action.text }}</app-link>
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>
    <section class="boxes-wrap">
      <div class="boxes">
        <div v-for="(box ,i) in $setting.get('home.boxes')" :key="i" class="box">
          <img class="icon" :src="require(`./img/` + box.icon)" :alt="box.title" >
          <h2>{{ box.title }}</h2>
          <p>{{ box.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
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
.home {
  .mast {
    position: relative;
    line-height: 1.2;
    margin: 0 auto;
    max-width: 1000px;
  }

  .splash-wrap {
    padding: 7em 0;
    background-repeat: no-repeat;
    background-size: auto 100%;
    background-position: right 0 top 0;
    @media (max-width: 767px) {
      padding: 4em 0 1em;
      background: none !important;
    }
    .hhh {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 67%;
      transform: skewY(-6deg);
      background: #f5f8fc;
      transition: opacity 0.2s ease-out;
      will-change: transform;
    }
    .splash {
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-column-gap: 40px;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        padding: 0 1em;
      }

      .splash-content {
        .title {
          font-weight: 800;
          font-size: 3em;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 0.2em;
          @media (max-width: 767px) {
            font-size: 2.2em;
          }
        }
        .subtitle {
          opacity: 0.5;
          font-size: 1.6em;
          line-height: 1.4em;
          font-weight: 500;
          @media (max-width: 767px) {
            font-size: 1em;
          }
        }
        .actions {
          margin-top: 1.5em;
          @media (max-width: 767px) {
            margin-bottom: 1.5em;
            a {
              display: inline-block;
              margin-bottom: 10px;
            }
          }
        }
      }

      .splash-graphic img {
        width: 100%;
      }
    }
  }

  .boxes-wrap {
    padding: 2em 1em 4em;
    position: relative;
    z-index: 1;
    background: #f5f8fc;
    .boxes {
      max-width: 1000px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 1em;
      @media (max-width: 767px) {
        display: block;
      }
      .box {
        padding: 2em;
        border-radius: 5px;
        background: #fff;
        border: 1px solid rgba(80, 102, 119, 0.1);
        margin: 2em 0;

        @media (max-width: 767px) {
          margin: 1em 0 2em;
        }
        .icon {
          margin-bottom: 0.5em;
        }
        h2 {
          font-size: 1.2em;
          line-height: 1.2em;
          font-weight: 800;
          margin: 0;
        }
        p {
          font-weight: 500;
          line-height: 1.4em;
          margin-top: 0.5em;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
