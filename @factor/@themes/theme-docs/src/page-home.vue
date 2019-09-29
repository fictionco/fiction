<template>
  <div class="home">
    <section class="splash-wrap">
      <div class="splash mast">
        <div class="splash-content">
          <h1 v-formatted-text="$setting.get('home.headline')" class="title" />
          <p class="subtitle">{{ $setting.get('home.subHeadline') }}</p>
          <div class="actions">
            <factor-link
              v-for="(action ,i) in $setting.get('home.actions')"
              :key="i"
              :path="action.path"
              :btn="action.btn"
              size="large"
            >
              <span v-formatted-text="action.text" />
            </factor-link>
          </div>
        </div>
      </div>
      <div class="hhh" />
    </section>
    <section class="boxes-wrap">
      <div class="boxes">
        <div v-for="(box ,i) in $setting.get('home.boxes')" :key="i" class="box">
          <div class="box-media">
            <div class="icon" :style="{'background-image': `url(${box.icon})` }" />
          </div>
          <div class="text">
            <h2>{{ box.title }}</h2>
            <p>{{ box.description }}</p>
          </div>
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

  metaInfo() {
    return {
      title: this.$setting.get("home.meta.title"),
      description: this.$setting.get("home.meta.description")
    }
  }
}
</script>
<style lang="less">
.home {
  padding-top: 45px;
  .splash.mast {
    position: relative;
    line-height: 1.2;
    margin: 0 auto;
    text-align: center;
    max-width: 700px;
  }

  .splash-wrap {
    position: relative;
    padding: 8em 1em;
    background-color: #fff;
    background-repeat: no-repeat;
    background-size: auto 110%;
    background-position: right 0 top 0;
    @media (max-width: 900px) {
      padding: 4em 0 1em;
      background: none !important;
    }
    .hhh {
      pointer-events: none;
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      bottom: 0;
      top: 90%;
      transform: skewY(-3deg);
      height: 250px;
      background: #fff;
      transition: opacity 0.2s ease-out;
      will-change: transform;
    }
    .splash {
      z-index: 2;
      // display: grid;
      // grid-template-columns: repeat(2, 1fr);
      // grid-column-gap: 40px;
      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        padding: 0 1em;
        text-align: left;
      }

      .splash-content {
        .title {
          font-size: 3.5em;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin-bottom: 0.2em;
          @media (max-width: 900px) {
            font-size: 1.8em;
            font-weight: 600;
          }
        }
        .subtitle {
          opacity: 0.7;
          font-size: 1.4em;
          line-height: 1.4em;
          font-weight: 500;
          @media (max-width: 900px) {
            font-size: 1.2em;
          }
        }
        .actions {
          margin-top: 1.5em;
          a {
            margin: 20px;
          }
          @media (max-width: 900px) {
            margin-bottom: 0.5em;
            a {
              display: inline-block;
              margin-left: 0;
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
    padding: 1em;
    position: relative;
    z-index: 2;
    .boxes {
      font-size: 1.23em;
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: 1em;
      @media (max-width: 900px) {
        display: block;
      }
      .box {
        border-radius: 5px;
        background: #fff;
        display: flex;

        .icon {
          margin: 0 1em 0 0;
          height: 60px;
          background-repeat: no-repeat;
          width: 60px;
          background-position: 50% 20%;
          border-radius: 7px;
        }

        @media (max-width: 900px) {
          margin: 1em 0 2em;
          display: block;
          .icon {
            background-position: 0;
          }
        }
        h2 {
          font-size: 1.2em;
          line-height: 1.2em;

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
