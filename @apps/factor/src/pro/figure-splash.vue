<template>
  <figure ref="wrapper" class="figure-splash">
    <div class="stage-wrap">
      <div class="stage">
        <div v-for="(card, i) in cards" :key="i" class="card">
          <div class="icon" :style="{backgroundImage: `url(${card.image})`}" />
          <div class="text">{{ card.text }}</div>
        </div>
      </div>
    </div>
  </figure>
</template>

<script lang="ts">
export default {
  data() {
    return {
      cards: [
        { text: "Forum", image: require("./img/icon-forum.svg") },
        { text: "Analytics", image: require("./img/icon-analytics.svg") },
     //   { text: "Chat", image: require("./img/icon-chat.svg") },
        { text: "SEO", image: require("./img/icon-seo.svg") },
        { text: "Themes", image: require("./img/icon-themes.svg") },
        { text: "Gallery", image: require("./img/icon-gallery.svg") },
        { text: "Forms", image: require("./img/icon-forms.svg") },
        { text: "Support", image: require("./img/icon-support.svg") },
        { text: "Socialize", image: require("./img/icon-socialize.svg") },
        // { text: "Subscriptions", image: require("./img/icon-subscriptions.svg") },
        // { text: "Feed", image: require("./img/icon-feed.svg") },
        // { text: "Job Lister", image: require("./img/icon-jobs.svg") },
      ],
    }
  },
}
</script>

<style lang="less">
figure.figure-splash {
  max-width: 100%;
  @media (max-width: 900px) {
    margin: 1rem auto 4rem;
    width: 450px;
  }

  .stage-wrap {
    transform-origin: center left;
    perspective: 800px;
    transform-style: preserve-3d;
  }
  .stage {
    width: 100%;
    position: relative;
    transform: scale(1);

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 2rem;
    @media (max-width: 900px) {
      transform: scale(1) translate(-0, -0px);
    }
    transform: rotateY(-12deg) rotateX(5deg);
    .card {
      //border-radius: 10px;
      background: #fff;
      //box-shadow: 0px 2px 2px rgba(50, 50, 93, 0.3), 0px 3px 10px rgba(0, 0, 0, 0.07);
      display: grid;
      grid-template-columns: 1fr;

      align-items: center;
      overflow: hidden;
      .icon {
        background-size: cover;
        background-position: 50%;
        border-radius: 10px;
        box-shadow: 0 2px 3px rgba(50, 50, 93, 0.13), 0 2px 5px rgba(50, 50, 93, 0.11),
          0 5px 15px rgba(0, 0, 0, 0.07);
        height: 7rem;
        @media (max-width: 900px) {
          height: 8rem;
        }
        img {
          max-width: 100%;
          display: block;
        }
      }
      .text {
        display: grid;
        padding: 0.4rem 1rem;
        font-size: 1.2em;
        line-height: 1.2;
        font-weight: 700;
        text-align: center;
      }
    }
    // .screenshot {
    //   top: 35px;
    //   background: #fff;
    //   display: inline-block;
    //   &.card-settings {
    //     position: absolute;
    //     top: -30px;
    //     right: 110px;
    //     transform: scale(1) rotateY(-6deg) rotateX(2deg) rotate(2deg);
    //     background: #ffffff;
    //     box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
    //       0px 15px 35px rgba(50, 50, 93, 0.11), 0px 5px 15px rgba(0, 0, 0, 0.07);
    //     overflow: hidden;
    //     border-radius: 4px;
    //   }
    //   &.card-support {
    //     position: absolute;
    //     top: 20px;
    //     left: 70px;
    //     z-index: 0;
    //     transform: scale(1) perspective(1040px) rotateY(-6deg) rotateX(2deg) rotate(2deg)
    //       translateZ(-40px);
    //     box-shadow: 0px 20px 90px rgba(50, 50, 93, 0.13),
    //       0 15px 35px rgba(50, 50, 93, 0.11), 0 5px 15px rgba(0, 0, 0, 0.07);
    //     overflow: hidden;
    //     border-radius: 4px;
    //   }
    //   &.card-extensions {
    //     position: absolute;
    //     top: 270px;
    //     left: 0;
    //     transform: translateZ(-8px) scale(1) perspective(1050px);
    //     background: #ffffff;
    //     box-shadow: 0px 0px 3px rgba(50, 50, 93, 0.2), 0px 14px 32px rgba(50, 50, 93, 0.1);
    //     overflow: hidden;
    //     border-radius: 4px;
    //   }
    // }
  }
}
</style>
