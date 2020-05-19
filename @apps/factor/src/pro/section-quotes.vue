<template>
  <div class="factor-pro-quotes" @click="nextSlide()">
    <article
      v-for="(quote, index) in quotes"
      :id="`quote`+(index+1)"
      :key="index"
      itemprop="review"
      itemscope
      itemtype="http://schema.org/Review"
      :class="{ 'active': active === index }"
    >
      <blockquote itemprop="reviewRating" itemscope itemtype="http://schema.org/Review">
        <p class="quote-body" itemprop="reviewBody">"{{ quote.text }}"</p>
        <footer>
          <div class="quote-media">
            <a class="quote-image" :href="quote.link">
              <img :src="quote.img" alt="quote" />
            </a>
          </div>
          <a
            :href="quote.link"
            target="_blank"
            itemprop="author"
            itemscope
            itemtype="https://schema.org/Person"
          >{{ quote.attribution }}</a>
        </footer>
      </blockquote>
    </article>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      active: 0,
      timer: null,
      animationInterval: 8000,
      quotes: [
        {
          text: `Factor gives me the right technology and a robust set of extensions. Factor Pro helps me build and get paid faster.`,
          attribution: "Patrick Abner , Full-stack Developer",
          img: require("./img/patrick.jpg"),
        },
        {
          text: `What I like about Factor pro is the extensions that just keep on coming, they save time and are easy to customize.`,
          attribution: "Melissa Flick, Developer",
          img: require("./img/melissa.jpg"),
        },
        {
          text: `Creating powerful apps takes minutes, I spend less time integrating and customizing is quite simple.`,
          attribution: "Joshua Carter, Front-end Developer",
          img: require("./img/joshua.jpg"),
        },
        {
          text: `Great documentation and support. The advanced features and settings with Factor pro make it easy.`,
          attribution: "Daniel Turner, Software Developer",
          img: require("./img/daniel.jpg"),
        },
      ],
    }
  },
  computed: {
    currentQuote: function (this: any) {
      return this.quotes[Math.abs(this.active) % this.quotes.length]
    },
    activeSlide(this: any) {
      return this.quotes[this.active]
    },
  },
  methods: {
    nextSlide(this: any) {
      if (this.active == this.quotes.length - 1) {
        this.active = 0
      } else {
        this.active++
      }

      this.runTimer()
    },
    runTimer(this: any) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.nextSlide(), this.animationInterval)
    },
  },
}
</script>
<style lang="less">
.factor-pro-quotes {
  display: grid;
  grid-template-columns: 1fr;
  perspective: 1000px;
  transform-style: preserve-3d;

  article {
    margin: 0 auto;
    grid-row-start: 1;
    grid-column-start: 1;
    cursor: pointer;
    background: #fff;
    border-radius: 8px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);

    blockquote {
      width: 100%;
      max-width: 550px;
      padding: 3rem 4rem;
      font-size: 1.3em;
      line-height: 1.8;
      @media (max-width: 900px) {
        padding: 3rem;
      }

      .quote-media {
        display: block;
        text-align: center;
        a {
          display: block;
          width: 40px;
          img {
            display: block;
            width: 100%;
            border-radius: 50%;
          }
        }
      }
      footer {
        display: grid;
        grid-template-columns: 1fr 6fr;
        grid-gap: 1rem;
        align-items: center;
        margin-top: 1rem;
        font-size: 0.8em;
        font-weight: 500;
        a {
          color: inherit;
          &:hover {
            color: inherit;
          }
        }
      }
    }

    &.active {
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.13),
        0px 15px 35px rgba(50, 50, 93, 0.11), 0px -5px 15px rgba(0, 0, 0, 0.07);
      transform: scale(1.1) translateY(-30px);
      @media (max-width: 900px) {
        transform: scale(1) translateY(-30px);
      }
    }
    &:not(.active) {
      //filter: blur(2px);
      box-shadow: 0px 50px 100px rgba(50, 50, 93, 0.05);
      @media (max-width: 900px) {
        box-shadow: 0 0px 26px rgba(50, 50, 93, 0.05);
      }
    }
  }

  #quote1:not(.active),
  #quote3:not(.active) {
    transform: scale(0.9) translate3d(-400px, 100px, -250px);
    @media (max-width: 900px) {
      transform: translate3d(0, 100px, -250px);
    }
  }
  #quote2:not(.active),
  #quote4:not(.active) {
    transform: scale(0.9) translate3d(400px, 100px, -250px);
    @media (max-width: 900px) {
      transform: translate3d(0, 100px, -250px);
    }
  }
}
</style>
