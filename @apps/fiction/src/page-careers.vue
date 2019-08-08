<template>
  <div class="view-careers">
    <div class="intro">
      <h1 class="title">Join The Team</h1>
      <div
        class="sub-title"
      >Fiction works with top talent in all kinds of areas. If you have drive, love travel, and want to do great work, get in touch.</div>
    </div>
    <div class="apply-wrap">
      <div class="pad">
        <div class="apply">
          <div class="apply-content">
            <h2 class="title">Your Teammates</h2>
            <p>Fiction’s secret sauce is our people. We work hard and have passion for great products.</p>
            <h3 class="sub-title">Careers</h3>
            <ul class="apply-list">
              <li>
                <factor-link
                  path="https://angel.co/fictiondotcom/jobs/454044-frontend-javascript-engineer-vue-node"
                  btn="default"
                  size="medium"
                  target="_blank"
                >
                  Full-Stack Developer
                  <factor-icon icon="arrow-right" />
                </factor-link>
              </li>
              <!-- <li>
                <factor-link path="/" btn="default">
                  Product Designer
                  <factor-icon icon="arrow-right" />
                </factor-link>
              </li>
              <li>
                <factor-link path="/" btn="default">
                  Photographer - Miami, FL
                  <factor-icon icon="arrow-right" />
                </factor-link>
              </li>
              <li>
                <factor-link path="/" btn="default">
                  Photographer - NYC
                  <factor-icon icon="arrow-right" />
                </factor-link>
              </li>-->
            </ul>
          </div>
        </div>
        <div class="apply-image">
          <img :src="require(`./img/careers.jpg`)" alt="Careers" />
        </div>
      </div>
    </div>
    <div class="contact-wrap">
      <h2 class="title">Ready to apply?</h2>
      <p>
        Reach us at
        <a href="mailto:letters@fiction.com">letters@fiction.com</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    this.$user.init(() => {
      this.loading = false;
    });
  },
  metatags() {
    return {
      title: "Fiction Careers",
      description: "Let’s Build a World-Class Product Together",
      image: require("./img/fiction.jpg")
    };
  }
};
</script>
<style lang="less">
.view-careers {
  .intro {
    text-align: center;
    max-width: 650px;
    margin: 0 auto;
    padding: 5em 2em;
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-weight: 600;
      font-size: 3em;
      line-height: 1em;
      margin-bottom: 0.5em;
      @media (max-width: 767px) {
        font-size: 2.5em;
      }
    }
    .sub-title {
      font-size: 1.3em;
      font-weight: 500;
      opacity: 0.6;
      margin-bottom: 1em;
      @media (max-width: 767px) {
        font-size: 1.2em;
        padding: 0 5%;
      }
    }
  }
  .apply-wrap {
    line-height: 1.4;
    padding-bottom: 6em;
    .pad {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 0;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
    }
    .apply {
      position: relative;
      z-index: 0;
      // @media (max-width: 767px) {
      //   display: flex;
      //   justify-content: center;
      // }
      &:before {
        z-index: -1;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-transform: skewY(-12deg);
        transform: skewY(-12deg);
        -webkit-transform-origin: 100% 0;
        transform-origin: 100% 0;
        background: #f2f9ff;
        background-size: 25% 200px;
      }
      .apply-content {
        max-width: 478px;
        padding-left: 20px;
        padding-top: 100px;
        margin-top: 30px;
        margin-right: 42px;
        margin-left: auto;
        @media (max-width: 767px) {
          margin: 0;
          padding: 8em 2em 3em;
        }
        .title {
          font-weight: 600;
          font-size: 2em;
        }
        .sub-title {
          padding: 1.5em 0 0.5em;
          font-size: 1.4em;
          line-height: 1.2em;
        }
        p {
          opacity: 0.6;
          font-size: 1.2em;
          font-weight: normal;
        }
        .apply-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px;
          list-style: none;
          margin: 0;
          padding-left: 0;
          @media (max-width: 767px) {
            grid-template-columns: 1fr;
          }
          li {
            margin: 0;
            font-weight: normal;
            button {
              width: 100%;
            }
          }
        }
      }
    }
    .apply-image {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      max-width: 396px;
      @media (max-width: 767px) {
        display: none;
      }
      img {
        max-width: 340px;
        border-radius: 0.5em;
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(0, 0, 0, 0.3);
        @media (max-width: 767px) {
          max-width: 100%;
        }
      }
    }
  }
  .contact-wrap {
    max-width: 960px;
    margin: 0 auto;
    padding: 3em 0;
    text-align: center;
    @media (max-width: 767px) {
      padding: 3em 2em;
    }
    .title {
      font-size: 2em;
    }
    p {
      font-size: 1.7em;
      opacity: 0.6;
      font-weight: normal;
    }
  }
}
</style>