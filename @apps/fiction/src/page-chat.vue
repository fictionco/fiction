<template>
  <div class="view-contact">
    <div class="hhh">
      <div class="stripes">
        <div class="wedge" />
      </div>
      <div class="text">
        <h1 class="title">Chat Support</h1>
        <div class="sub-title">Any suggestions, issues or concerns? We're here to help.</div>
      </div>
    </div>
    <div class="contact-wrap">
      <div class="contact-area">
        <div class="grid">
          <div class="widget-wrap">
            <iframe
              src="https://discordapp.com/widget?id=543868838438240278&theme=light"
              width="100%"
              height="500"
              allowtransparency="true"
              frameborder="0"
            />
          </div>
          <div class="aside">
            <div class="title">Join the Discussion</div>
            <div class="sub-tags">
              <span class="tg">Flights</span>
              <span class="tg">Points</span>
              <span class="tg">Cities</span>
              <span class="tg">Events</span>
              <span class="tg">Jobs</span>
              <span class="tg">Housing</span>
              <span class="tg">Meetups</span>
              <span class="tg">Deals</span>
              <span class="tg">Coding</span>
            </div>
            <div class="sub-title">
              Add
              <factor-link path="https://fiction.page.link/discord">Fiction's chat server</factor-link>&nbsp; on Discord
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userInitialized } from "@factor/user"
export default {
  data() {
    return {
      loading: true,
      sending: false,
      form: {},
      sent: false,
      formStatus: "unchecked"
    }
  },
  computed: {},
  mounted() {
    userInitialized(() => {
      this.loading = false
    })

    this.$watch(
      "form",
      function() {
        const v = this.$refs.form.$el.checkValidity()

        this.formStatus = v ? "valid" : "invalid"
      },
      { deep: true }
    )
  },
  metaInfo() {
    return {
      title: "Discord Chat Support",
      description: "Join Fiction's chat group on Discord.",
      image: require("./img/fiction.jpg")
    }
  },
  methods: {}
}
</script>
<style lang="less">
.view-contact {
  margin-top: 3em;
  background-size: cover;
  // background: #f7f9ff;
  //background: linear-gradient(90deg, #0496ff, #68d4f8 200%);

  .hhh {
    text-align: center;
    .text {
      max-width: 580px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }

    padding: 2em 0;
    @media (max-width: 767px) {
      padding: 1em 0;
    }
    line-height: 1.4;
    letter-spacing: -0.03em;
    .title {
      font-size: 3em;
      line-height: 1;
      @media (max-width: 767px) {
        font-size: 2.5em;
      }
    }
    .sub-title {
      font-size: 1.3em;
      font-weight: 500;
      opacity: 0.6;
      @media (max-width: 767px) {
        font-size: 1.2em;
        padding: 0 5%;
      }
    }
    position: relative;
    .stripes {
      pointer-events: none;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -72px;
      top: 50%;
      transform: skewY(-6deg);
      transition: opacity 0.2s ease-out;
      will-change: transform;
      .wedge {
        position: absolute;
        height: 5000px;
        bottom: 0;
        background: #fff;
        left: 0;
        right: 0;
      }
    }
  }
  .contact-wrap {
    padding: 2em 0 4em;
  }
  .contact-area {
    position: relative;
    z-index: 10;
    .grid {
      padding: 0 1em;
      max-width: 960px;
      margin: 0 auto;
      align-items: center;
      display: grid;
      grid-template-columns: 1fr 1fr;
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
      > .widget-wrap {
        border-radius: 5px;
        background: #fff;
        box-shadow: 0 0 0 0.4px rgba(50, 50, 93, 0.05),
          0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3);
      }
    }
    .aside {
      //color: #fff;
      padding: 1.5em;
      font-size: 1.5em;
      line-height: 1.3;
      .title {
        line-height: 1.1;
        font-size: 1.2em;
      }
      .sub-title {
        font-weight: 500;
        opacity: 0.5;
      }
      .sub-tags {
        margin: 0.5em 0;
        .tg {
          display: inline-block;
          background: rgba(50, 50, 93, 0.05);
          font-size: 0.8em;
          padding: 2px 0.5em;
          margin: 0 3px 3px 0;
          color: #99acc7;
          border-radius: 5px;
        }
      }
    }
  }
  .contact-form {
  }
  .confirm {
    padding: 8em 2em;
    text-align: center;
    .title {
      font-size: 1.7em;
    }

    .description {
      opacity: 0.5;
    }
    .actions {
      margin-top: 1em;
    }
  }
  .support {
    text-align: center;
    margin-top: 3em;
    font-weight: 500;
    .name {
    }
    .description {
      font-size: 0.85em;
      opacity: 0.6;
    }
  }
}
</style>