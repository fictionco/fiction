<template>
  <div class="view-hosting">
    <div class="intro">
      <h1 class="title">Rent Out Your Place</h1>
      <div class="sub-title">Fiction makes it easy to find and rent monthly to people you can trust.</div>
      <app-btn v-if="$userId" path="/dashboard/hosting" btn="primary" size="large">
        List Your Home
        <factor-icon icon="arrow-right" />
      </app-btn>
      <app-btn v-if="!$userId" :loading="loading" action="signinModal" btn="primary" size="large">
        List Your Home
        <factor-icon icon="arrow-right" />
      </app-btn>
      <!-- <p class="text-mini">(Currently U.S. only)</p> -->
    </div>
    <div class="how-wrap">
      <div class="pad">
        <div class="how">
          <div class="how-content">
            <h2 class="title">How it Works...</h2>
            <ol class="how-list">
              <li>
                <h3>Listing Your Place</h3>
                <span>Start by creating a basic property description and availability listing.</span>
              </li>
              <li>
                <h3>The Virtual Showing</h3>
                <span>Fiction will send a photographer to visit your home and take professional photos, as well as write an objective review of your place.</span>
              </li>
              <li>
                <h3>Book A Guest</h3>
                <span>Fiction will advertise and market to other qualified travelers and monthly tenants. Simply communicate with them and accept a booking request when you’re ready.</span>
              </li>
            </ol>
          </div>
        </div>
        <div class="how-image">
          <img :src="require(`./img/hosting.jpg`)" alt="Hosting" >
        </div>
      </div>
    </div>
    <div class="why-wrap">
      <h2 class="title">Why You’ll Love Listing on Fiction</h2>
      <div class="why">
        <div class="why-item">
          <h3>Hassle Free Income</h3>
          <p>No visits for property showings, everything is done online. We provide an HD video tour and professional photos at no cost.</p>
        </div>
        <div class="why-item">
          <h3>Operate Ahead of Schedule</h3>
          <p>High-quality tenant requests months ahead of time. After you receive a request you have 12 hours to accept or reject a renter.</p>
        </div>
        <div class="why-item">
          <h3>Less Work, Better Results</h3>
          <p>No inconvenient phone calls and viewings. Increase occupancy rates and earn more per month.</p>
        </div>
      </div>
    </div>
    <div class="bottom-cta">
      <app-btn v-if="$userId" path="/dashboard/hosting" btn="primary" size="large">
        List Your Home
        <factor-icon icon="arrow-right" />
      </app-btn>
      <app-btn v-if="!$userId" :loading="loading" action="signinModal" btn="primary" size="large">
        List Your Home
        <factor-icon icon="arrow-right" />
      </app-btn>
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
.view-hosting {
  .intro {
    text-align: center;
    max-width: 650px;
    margin: 0 auto;
    padding: 5em 0;
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-size: 3em;
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
    .text-mini {
      opacity: 0.6;
      margin-top: 0.5em;
      font-size: 0.8em;
      font-weight: normal;
    }
  }
  .how-wrap {
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
    .how {
      position: relative;
      z-index: 0;
      @media (max-width: 767px) {
        display: flex;
        justify-content: center;
      }
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
      .how-content {
        max-width: 478px;
        padding-left: 20px;
        padding-top: 100px;
        margin-top: 30px;
        margin-right: 42px;
        margin-left: auto;
        @media (max-width: 767px) {
          margin: 0;
          padding: 140px 2em 0;
        }
        .title {
          font-size: 2em;
        }
        .how-list {
          list-style: none;
          margin: 0;
          padding-left: 35px;
          li {
            padding: 1em 0;
            font-weight: normal;
            counter-increment: fiction-counter;
            position: relative;
            &:before {
              content: counter(fiction-counter);
              font-size: 0.8rem;
              font-weight: bold;
              position: absolute;
              --size: 22px;
              line-height: var(--size);
              width: var(--size);
              height: var(--size);
              top: 20px;
              left: calc(-1 * var(--size) - 15px);
              color: #fff;
              background: #0496ff;
              border-radius: 50%;
              text-align: center;
            }
            h3 {
              font-size: 1.4em;
              font-weight: 600;
            }
            span {
              opacity: 0.6;
              font-size: 1.2em;
            }
          }
        }
      }
    }
    .how-image {
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
  .why-wrap {
    max-width: 960px;
    margin: 0 auto;
    padding-top: 3em;
    .title {
      font-size: 2em;
      text-align: center;
    }
    .why {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 30px;
      padding-top: 3em;
      line-height: 1.4;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
        padding-left: 2em;
        padding-right: 2em;
      }
      h3 {
        font-size: 1.4em;
      }
      p {
        opacity: 0.6;
        font-size: 1.2em;
        font-weight: normal;
      }
    }
  }
  .bottom-cta {
    padding: 3em 2em;
    line-height: 1.4;
    max-width: 960px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
}
</style>