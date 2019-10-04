<template>
  <div class="section-plugins">
    <section
      v-for="(post, index) in posts"
      :id="post.id"
      :key="index"
      class="post"
      :class="post.class"
    >
      <div class="post-image">
        <home-icon icon="dashboard" />
      </div>
      <div class="post-content">
        <h3 class="title">{{ post.title }} Google Analytics</h3>
        <div class="meta">
          <span class="author">by Factor</span> in
          <span class="category">Search</span>
          <span class="download-count">1,262 downloads</span>
        </div>
        <p class="text">{{ post.text }} Easily add Google Analytics to your Factor site.</p>
      </div>
    </section>

    <!-- <section
      v-for="(feature, index) in features"
      :id="feature.id"
      :key="index"
      class="features content"
      :class="[index == features.length - 1 ? 'last' : '']"
    >
      <div class="split-feature" :class="[index % 2 == 0 ? 'even' : 'odd']">
        <div class="feature-content-container">
          <div class="feature-content">
            <home-icon v-if="feature.icon" class="feature-icon" :icon="feature.icon" />
            <h2 class="title">{{ feature.title }}</h2>
            <div class="text">{{ feature.text }}</div>
            <div v-if="feature.link" class="action">
              <factor-link :path="feature.link.path">{{ feature.link.text }} &rarr;</factor-link>
            </div>
          </div>
        </div>
        <div class="feature-figure-container">
          <div v-if="feature.figure" class="figure-container">
            <component :is="feature.figure" />
          </div>
        </div>
      </div>
    </section>-->

    <!-- <div class="interstitial-cta">
      <div class="text">
        <h2 class="title">Create and Submit Your Plugin</h2>
        <h2
          class="title-sub"
        >Learn about extension development and how to submit your extension to the Factor library.</h2>
      </div>

      <div class="buttons">
        <factor-link btn="primary" path="/guide/">Submit a Plugin &rarr;</factor-link>
        <factor-link btn="default" path="/guide/create-plugins">Create a Plugin &rarr;</factor-link>
      </div>
    </div>-->
  </div>
</template>

<script>
export default {
  components: {
    "home-icon": () => import("./icon.vue")
  },
  data() {
    return {
      posts: [
        {
          icon: "powered",
          title: "Powered by VueJS and MongoDB",
          text: `When you use Factor you'll be using best-of-class open source software under the hood. 
            Stop worrying about lock-in and immature tech. No more endlessly comparing new tools and techniques. 
            Just trust Factor and get started building your app.`,
          //figure: () => import("./figure-powered-by.vue"),
          link: { path: "/guide/quickstart", text: "View Quickstart" }
        },
        {
          icon: "ssr",
          title: "Dynamic Beats Static",
          text: `Factor is a universal Javascript framework which means you can dynamically make changes
              to your content and see them reflected immediately (without a build step). 
              This also enables custom endpoints and server-side rendering (SSR) important for SEO, 
              social, and performance reasons.`,
          link: { path: "/guide", text: "Try Factor" }
        },
        {
          icon: "dashboard2",
          title: "Dashboard Included",
          text: `Factor comes with a professional dashboard and post management system.
            This tool was carefully crafted to give you maximum powerful but with minimum bloat. 
            It is simple by default but can be extended to handle even the most complext tasks.`,
          link: { path: "/guide", text: "Learn More" }
        },
        {
          id: "plugins-feature",
          //icon: "plugins",
          title: `Plugins that just work`,
          text: `Most Javascript frameworks make you do way too much coding and customization 
              to make plugins work. That's why Factor makes plugins dead simple with intelligent 
              defaults and no mandatory customization.`,
          link: { path: "/plugins", text: "View Plugins" }
        },
        {
          //icon: "brush",
          title: "Theming for the 21st Century",
          text: `Ever seen a theming system for Javascript apps that you could work with? We hadn't either. 
              Factor was developed from the start with customizeable theming and rapid app development in mind.`,
          link: { path: "/themes", text: "View Themes" }
        }
      ]
    }
  },
  methods: {}
}
</script>
<style lang="less">
.section-plugins {
  .post {
    padding: 1rem;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 2rem;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #e8ebed;
    transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    &:hover {
      box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.07), 0px 18px 26px rgba(80, 102, 119, 0.16);
      transform: translateY(-0.4rem);
    }
    .title {
      font-weight: 500;
      font-size: 1.2em;
      line-height: 1.5em;
    }
    .text {
      font-size: 0.94em;
      line-height: 1.7em;
      opacity: 0.85;
    }
    h3,
    p {
      margin-bottom: 10px;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }

  // .interstitial-cta {
  //   display: grid;
  //   grid-template-columns: 1fr auto;
  //   align-items: center;
  //   border-top: 2px solid #f6f9fc;
  //   margin: 60px -20px 0;
  //   padding: 60px 20px 0;
  //   @media (max-width: 767px) {
  //     grid-template-columns: 1fr;
  //   }
  //   .text h2 {
  //     &.title {
  //       color: var(--color-primary);
  //     }
  //     font-size: 1.5em;
  //   }
  //   .buttons {
  //     margin: 0 0 0 20px;
  //     @media (max-width: 767px) {
  //       margin: 20px 0 0 0;
  //     }
  //   }
  // }
}
</style>
