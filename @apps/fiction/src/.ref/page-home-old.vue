
<template>
  <div class="page-home">
    <div class="intro">
      <factor-link path="https://factor.dev/" target="_blank">
        <img :src="require(`./img/factor.svg`)" alt="Factor Framework">
      </factor-link>
      <p class="sub-title">The Vuejs App Framework.</p>
      <factor-link btn="primary" size="large" path="https://factor.dev/" target="_blank">
        Get Started
        <factor-icon icon="arrow-right" />
      </factor-link>
    </div>
    <div class="angle-wrap">
      <div class="angle">
        <div class="angle-content">
          <factor-link path="https://factor.dev/" target="_blank">
            <svg width="144" height="66" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity=".63" fill="#506677">
                <path
                  d="M22.723 62.408c0-.702-.27-1.202-.567-1.566-.31-.364-.877-.675-1.053-.756l-1.715-.715c-.567-.23-1.201-.554-1.201-1.418 0-.864.702-1.296 1.62-1.296.918 0 1.593.513 2.052.999l.688-.891c-.256-.27-1.147-1.202-2.672-1.202-.905 0-1.634.257-2.147.689-.5.418-.85 1.04-.85 1.795 0 .757.27 1.27.607 1.62a3 3 0 0 0 .931.662c.351.175 1 .432 1.485.621.473.189 1.512.567 1.512 1.539 0 .986-.81 1.566-1.822 1.566-1.013 0-1.89-.702-2.363-1.337l-.769.878c.445.513 1.377 1.566 3.01 1.566.932 0 1.701-.257 2.282-.729.607-.5.972-1.215.972-2.025zM29.8 63.893h-4.253v-3.24h3.915V59.56h-3.915v-2.782h4.144v-1.093h-5.454V65H29.8v-1.107zM35.068 60.855c.985-.188 2.12-.917 2.12-2.551 0-.85-.352-1.526-.905-1.971-.554-.432-1.31-.648-2.241-.648h-2.633V65h1.31v-4.01h.999l2.43 4.01h1.58l-2.66-4.145zm.77-2.524c0 .567-.176.945-.595 1.255-.418.297-.918.325-1.566.325h-.958v-3.16h.958c.648 0 1.148.028 1.566.338.419.297.594.689.594 1.242zM44.066 55.685l-2.62 7.425-2.618-7.425h-1.404l3.429 9.328h1.16l3.43-9.328h-1.377zM52.04 63.893h-4.252v-3.24h3.915V59.56h-3.915v-2.782h4.144v-1.093h-5.454V65h5.562v-1.107zM57.309 60.855c.985-.188 2.119-.917 2.119-2.551 0-.85-.351-1.526-.904-1.971-.554-.432-1.31-.648-2.242-.648H53.65V65h1.31v-4.01h.998l2.43 4.01h1.58l-2.66-4.145zm.769-2.524c0 .567-.175.945-.594 1.255-.419.297-.918.325-1.566.325h-.959v-3.16h.959c.648 0 1.148.028 1.566.338.419.297.594.689.594 1.242zM65.53 63.88h-3.28v-8.195h-1.31V65h4.59v-1.12zM72.25 63.893h-4.252v-3.24h3.915V59.56h-3.915v-2.782h4.145v-1.093h-5.454V65h5.562v-1.107zM79.558 62.408c0-.702-.27-1.202-.568-1.566-.31-.364-.877-.675-1.052-.756l-1.715-.715c-.567-.23-1.201-.554-1.201-1.418 0-.864.701-1.296 1.62-1.296.918 0 1.593.513 2.052.999l.688-.891c-.257-.27-1.148-1.202-2.673-1.202-.904 0-1.633.257-2.147.689-.499.418-.85 1.04-.85 1.795 0 .757.27 1.27.608 1.62a3 3 0 0 0 .931.662c.351.175.999.432 1.485.621.472.189 1.512.567 1.512 1.539 0 .986-.81 1.566-1.823 1.566-1.012 0-1.89-.702-2.362-1.337l-.77.878c.446.513 1.377 1.566 3.011 1.566.931 0 1.701-.257 2.281-.729.608-.5.973-1.215.973-2.025zM86.637 62.408c0-.702-.27-1.202-.567-1.566-.31-.364-.877-.675-1.053-.756l-1.715-.715c-.567-.23-1.201-.554-1.201-1.418 0-.864.702-1.296 1.62-1.296.918 0 1.593.513 2.052.999l.689-.891c-.257-.27-1.148-1.202-2.674-1.202-.904 0-1.633.257-2.146.689-.5.418-.85 1.04-.85 1.795 0 .757.27 1.27.607 1.62a3 3 0 0 0 .931.662c.352.175 1 .432 1.486.621.472.189 1.511.567 1.511 1.539 0 .986-.81 1.566-1.822 1.566s-1.89-.702-2.362-1.337l-.77.878c.445.513 1.377 1.566 3.01 1.566.932 0 1.702-.257 2.282-.729.607-.5.972-1.215.972-2.025zM97.915 62.827c-.608.661-1.553 1.134-2.781 1.134-1.998 0-3.47-1.445-3.47-3.632 0-2.187 1.458-3.632 3.47-3.632 1.296 0 2.335.675 2.7 1.134l.553-1.053c-.513-.499-1.566-1.228-3.307-1.228-2.673 0-4.766 1.904-4.766 4.806s2.052 4.806 4.766 4.806c1.768 0 2.821-.729 3.402-1.377l-.567-.958zM108.864 55.685h-1.607l-2.686 7.195h-.027l-2.687-7.195h-1.62L99.4 65h1.296l.594-7.358h.041l2.848 7.439h.743l2.848-7.439h.041l.607 7.358h1.296l-.85-9.315zM117.038 62.408c0-.702-.27-1.202-.567-1.566-.31-.364-.877-.675-1.053-.756l-1.714-.715c-.567-.23-1.202-.554-1.202-1.418 0-.864.702-1.296 1.62-1.296.918 0 1.593.513 2.052.999l.689-.891c-.257-.27-1.148-1.202-2.673-1.202-.905 0-1.634.257-2.147.689a2.319 2.319 0 0 0-.85 1.795c0 .757.27 1.27.607 1.62a3 3 0 0 0 .932.662c.351.175.999.432 1.485.621.472.189 1.512.567 1.512 1.539 0 .986-.81 1.566-1.823 1.566-1.012 0-1.89-.702-2.362-1.337l-.77.878c.446.513 1.377 1.566 3.011 1.566.931 0 1.701-.257 2.281-.729.608-.5.972-1.215.972-2.025z"
                />
              </g>
              <path
                d="M.236 20.315h3.59L.295 42.36h9.182l3.526-22.044h4.616l1.397-7.325-4.894.052c.472-2.777.81-4.428 4.177-5.495 1.27-.403 2.236-.93 3.295-.582l1.53-6.395c-1.883-.59-4.108-.66-6.06-.49C8.447.83 6.12 5.722 4.943 13.048H1.355L.236 20.315z"
                fill="#506677"
              />
              <path
                d="M39.541 13.046h9.178L44.777 37.93a16.373 16.373 0 0 0-.176 2.188c-.012.693.047 1.386.176 2.067h-8.531s-.232-.708-.232-2.068c0-.473 0-1.063.06-1.713h-.06c-2.47 2.836-6.119 4.432-9.884 4.432-7.109-.61-10.158-5.665-10.158-12.579 0-8.981 4.921-17.516 14.924-17.516 3.06 0 6.59.844 8.178 3.68.114-1.128.29-2.247.467-3.374zm-7.792 6.977c-4.825 0-7.767 4.61-7.767 9.1 0 3.372 1.942 5.851 5.413 5.851 4.825 0 7.767-4.609 7.767-9.1 0-3.372-1.942-5.854-5.413-5.854v.003zM71.189 22.915c-1.47-1.95-4.118-2.836-6.472-2.836-4.825 0-8.18 4.314-8.18 8.983 0 3.72 2.414 5.909 6.062 5.909 2.53 0 5.589-1.064 7.59-2.66l.824 7.21c-2.825 2.305-7.65 3.31-11.115 3.31-7.356 0-12.65-4.907-12.65-12.352 0-9.928 7.472-17.964 17.533-17.964 2.883 0 5.81.271 7.928 2.516l-1.52 7.884zM87.436 13.046h6.237l-1.235 7.27H86.26c-.647 3.958-1.825 8.332-1.825 12.35 0 1.713.825 2.246 2.413 2.246.966 0 1.924-.18 2.824-.533l-.706 7.505c-2.177.532-4.354.946-6.648.946-4.649 0-7.41-2.128-7.41-6.977 0-5.141 1.411-10.58 2.176-15.541h-3.936l1.176-7.269h3.942l.589-3.663c.093-.784.132-1.574.115-2.364a12.329 12.329 0 0 0-.115-1.832h9.12s.177.65.177 1.95c-.005.891-.082 1.78-.232 2.659l-.484 3.254z"
                fill="#506677"
              />
              <path
                d="M103.743 42.83c-7.532 0-13.357-4.314-13.357-12.292 0-10.282 7.708-18.023 18.122-18.023 7.591 0 13.357 4.373 13.357 12.35.003 10.283-7.649 17.965-18.122 17.965zm3.589-22.75c-4.826 0-7.59 4.726-7.59 9.1 0 3.308 1.765 5.791 5.236 5.791 4.825 0 7.591-4.728 7.591-9.101 0-3.31-1.766-5.79-5.237-5.79zM142.141 21.793h-.474c-.941-.532-2.118-.71-3.177-.71-4.471 0-6.237 4.432-6.766 8.155l-2.06 12.941h-9.179l3.883-24.819c.112-.822.171-1.65.177-2.48a12.342 12.342 0 0 0-.115-1.834h9.12s.177.65.177 1.95a9.867 9.867 0 0 1-.232 2.188c1.707-2.719 4.355-4.669 7.708-4.669.824 0 2.059.116 2.766.531l-1.828 8.747z"
                fill="#506677"
              />
            </svg>
          </factor-link>
          <p>A serverless Framework designed to help you start a fully functional website, blog or progressive web app within 5 minutes.</p>
          <factor-link btn="primary" size="large" path="https://factor.dev/" target="_blank">
            Learn More
            <factor-icon icon="arrow-right" />
          </factor-link>
        </div>
      </div>
      <div class="angle-graphics bg-rect-right">
        <pre><code class="hljs language-bash">$ yarn factor start</code></pre>
        <div class="switcher">
          <factor-link path="https://factor.dev/" target="_blank">
            <img :src="require(`./img/placeholder.png`)" alt="Factor Framework">
            <img :src="require(`./img/placeholder.png`)" alt="Factor Framework">
          </factor-link>
        </div>
      </div>
    </div>

    <div class="cta">
      <h2 class="title">
        We're happy to answer
        <br>your questions.
      </h2>
      <factor-link btn="primary" size="large" path="/contact">
        Contact Us
        <factor-icon icon="arrow-right" />
      </factor-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.$user.init(() => {
      this.loading = false
    })
  },
  metatags() {
    return {
      title: "Fiction Hosting",
      description: "Rent your place out monthly.",
      image: require("./img/fiction.jpg")
    }
  }
}
</script>
<style lang="less">
.page-home {
  .intro {
    text-align: center;
    max-width: 650px;
    margin: 0 auto;
    padding: 5em 0;
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-size: 3em;
      font-weight: 600;
      @media (max-width: 767px) {
        font-size: 2.5em;
      }
    }
    .sub-title {
      font-size: 1.7em;
      font-weight: 500;
      opacity: 0.6;
      margin-bottom: 1em;
      @media (max-width: 767px) {
        font-size: 1.2em;
        padding: 0 5%;
      }
    }
  }
  .angle-wrap {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0;
    align-items: center;
    padding-bottom: 6em;
    @media (max-width: 767px) {
      grid-template-columns: 1fr;
      padding-bottom: 2em;
    }
    .angle {
      position: relative;
      z-index: 0;
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
        padding: 0 2em;
      }
      &:before {
        z-index: -1;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        transform: skewY(-12deg);
        transform-origin: 100% 0;
        background: #f2f9ff;
        background-size: 25% 200px;
        @media (max-width: 767px) {
          transform: skewY(0deg);
        }
      }
      .angle-content {
        max-width: 478px;
        padding: 140px 20px 20px;
        margin-top: 30px;
        margin-right: 42px;
        margin-left: auto;
        @media (max-width: 767px) {
          margin: 0;
          padding: 2em 0;
        }
        p {
          font-size: 1.4em;
          line-height: 1.4;
          opacity: 0.6;
          margin-top: 0.5em;
        }
        .factor-link {
          display: inline-block;
          margin-top: 1em;
        }
      }
    }
    .angle-graphics {
      display: grid;
      grid-gap: 20px;
      align-items: center;
      padding: 0 60px;
      @media (max-width: 767px) {
        margin: 2em 0;
        padding: 0 2em;
      }
      pre {
        background: #506677;
        border-radius: 4px;
        padding: 10px;
        color: #fff;
      }
      .switcher {
        height: 100%;
        position: relative;
        img {
          max-width: calc(100% - 30px);
          transition: all 0.2s ease-in-out;
          &:nth-child(1) {
            position: relative;
            z-index: 1;
          }
          &:nth-child(2) {
            position: absolute;
            z-index: 0;
            top: 40px;
            left: 40px;
          }
        }
        &:hover img:nth-child(2) {
          z-index: 2;
          transform: translate(0, -40px);
        }
      }
      img {
        border-radius: 4px;
        box-shadow: 0 30px 60px -12px rgba(50, 50, 93, 0.25),
          0 18px 36px -18px rgba(82, 102, 18, 0.3);
        // @media (max-width: 767px) {
        //   max-width: 100%;
        //   margin: 0;
        // }
      }
    }
  }
  .cta {
    max-width: 960px;
    margin: 0 auto;
    padding: 7em 0 3em;
    text-align: center;
    line-height: 1.4;
    @media (max-width: 767px) {
      padding: 3em 0;
    }
    .title {
      font-size: 2em;
      font-weight: 600;
    }
    .content {
      font-size: 1.7em;
      opacity: 0.6;
    }
    .factor-link {
      display: inline-block;
      margin-top: 1em;
    }
  }
  .bg-rect-right {
    background: url(./img/bg-rectangles-right.svg) no-repeat center center;
    background-size: 100% 100%;
  }
}
</style>