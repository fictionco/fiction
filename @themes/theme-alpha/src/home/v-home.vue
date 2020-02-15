<template>
  <div class="page-home">
    <home-intro v-if="setting(`home.intro.component`)" />

    <section v-if="section2" :id="section2id" class="section2">
      <div class="mast title-wrap text-center">
        <h3 v-formatted-text="section2pretitle" class="pretitle" />
        <h1 v-formatted-text="section2title" class="title" />
      </div>
      <div class="mast section2-inner">
        <div v-for="(item, i) in section2items" :key="i" class="item">
          <div v-if="item.icon" class="item-icon">
            <img :src="item.icon" :alt="item.title" />
          </div>
          <div class="item-content">
            <h2 class="item-title">{{ item.title }}</h2>
            <p class="item-description text-gray-600">{{ item.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="section2" :id="section3id" class="section3">
      <div class="mast">
        <div class="title-wrap">
          <div>
            <h3 v-formatted-text="section3pretitle" class="pretitle" />
            <h1 v-formatted-text="section3title" class="title" />
          </div>
          <div v-if="section3Buttons" class="buttons">
            <template v-for="(button, i) in section3Buttons">
              <factor-link
                :key="i"
                v-formatted-text="button.text"
                :path="button.link"
                :class="button.classes"
              />
            </template>
          </div>
        </div>
      </div>
      <div class="mast">
        <div v-if="workPosts.length > 0" class="work-posts posts-index">
          <div v-for="post in workPosts" :key="post._id" class="work-post">
            <component
              :is="setting(`work.components.${comp}`)"
              v-for="(comp, i) in setting('work.layout.index')"
              :key="i"
              :post-id="post._id"
              format="index"
            />
          </div>
        </div>
      </div>
    </section>

    <section v-if="section4" :id="section4.id" class="section4">
      <div class="mast">
        <h3 v-formatted-text="section4pretitle" class="pretitle" />
        <h1 v-formatted-text="section4title" class="title" />
      </div>
      <div class="mast testimonials section4-inner">
        <div v-for="(item, i) in section4items" :key="i" class="testimonial">
          <div v-if="item.image" class="item-image">
            <img :src="item.image" :alt="item.author" />
          </div>
          <p class="item-content">{{ item.content }}</p>
          <h2 class="item-author">{{ item.author }}</h2>
          <h3 class="item-info">{{ item.info }}</h3>
        </div>
      </div>
    </section>

    <section v-if="section5" :id="section5.id" class="section5">
      <div class="mast">
        <el-clients />
      </div>
    </section>

    <el-cta />
  </div>
</template>

<script lang="ts">
import { setting, stored } from "@factor/api"
import { requestPostIndex } from "@factor/post/request"
import { factorLink } from "@factor/ui"
import Vue from "vue"
export default Vue.extend({
  components: {
    factorLink,
    homeIntro: setting("home.intro.component"),
    "el-clients": () => import("../el/clients.vue"),
    "el-cta": () => import("../el/cta.vue")
  },
  data() {
    return {
      loading: true,
      section2: setting("home.section2"),
      section2id: setting("home.section2.id"),
      section2pretitle: setting("home.section2.pretitle"),
      section2title: setting("home.section2.title"),
      section2items: setting("home.section2.items"),
      section3: setting("home.section3"),
      section3id: setting("home.section3.id"),
      section3pretitle: setting("home.section3.pretitle"),
      section3title: setting("home.section3.title"),
      section3Buttons: setting("home.section3.buttons"),
      section4: setting("home.section4"),
      section4id: setting("home.section4.id"),
      section4pretitle: setting("home.section4.pretitle"),
      section4title: setting("home.section4.title"),
      section4items: setting("home.section4.items"),
      section5: setting("about.clients"),
      section5id: setting("about.clients.id"),
      postType: "work"
    }
  },
  metaInfo() {
    return {
      title: setting("home.metatags.title"),
      description: setting("home.metatags.description"),
      image: setting("home.metatags.image")
    }
  },
  computed: {
    // tag(this: any) {
    //   return this.$route.params.tag || this.$route.query.tag || ""
    // },
    index(this: any) {
      return stored(this.postType) || {}
    },
    workPosts(this: any) {
      const { posts = [] } = this.index
      return posts
    },
    page(this: any) {
      return this.$route.query.page || 1
    }
  },
  watch: {
    $route: {
      handler: function(this: any) {
        this.getPosts()
      }
    }
  },
  mounted() {
    this.getPosts()
  },
  methods: {
    setting,
    async getPosts(this: any) {
      this.loading = true

      await requestPostIndex({
        postType: this.postType,
        //tag: this.tag,
        status: "published",
        sort: "-date",
        page: this.page,
        limit: 4 //setting("work.limit")
      })

      this.loading = false
    }
  },
  serverPrefetch() {
    return this.getPosts()
  }
})
</script>

<style lang="less">
.page-home {
  padding-bottom: 3rem;
  .mast {
    margin: 0 auto;
    max-width: 1000px;
    line-height: 1.2;

    @media (max-width: 900px) {
      padding: 0 2em;
    }
  }
  .title-wrap {
    margin-bottom: 1rem;
  }
  .pretitle {
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .title {
    font-weight: var(--font-weight-bold, 800);
    font-size: 3em;
    letter-spacing: -0.03em;
    color: #110d47;

    @media (max-width: 900px) {
      font-size: 2em;
    }
  }

  .section2,
  .section4,
  .section5 {
    background: var(--color-bg-alt, #f3f5fb);
    .pretitle {
      color: var(--color-primary, #1a49bd);
    }
  }

  .section2,
  .section3,
  .section4,
  .section5 {
    .pretitle {
      color: var(--color-primary, #1a49bd);
    }
  }

  // Services offered
  .section2 {
    padding: 4em 0;

    .title {
      margin-bottom: 2rem;
    }

    .section2-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 2rem;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }

      .item {
        display: grid;
        grid-template-columns: 80px 1fr;
        grid-gap: 2rem;
        padding: 2rem 1rem;
        border-radius: 0.5rem;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

        .item-icon {
          display: flex;
          flex-direction: column;
        }
        .item-content {
          .item-title {
            font-weight: var(--font-weight-bold, 800);
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            @media (max-width: 900px) {
              font-size: 1.2rem;
            }
          }
          .item-description {
            line-height: 1.6rem;
          }
        }

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          grid-gap: 1rem;
          .item-icon {
            flex-direction: row;
          }
        }

        &:hover {
          background: #fff;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06),
          //   0px 3px 30px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }

  // Work showcase
  .section3 {
    padding: 4em 0;
    .title-wrap {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;

      .buttons {
        justify-self: flex-end;
      }

      @media (max-width: 900px) {
        grid-gap: 1rem;
        grid-template-columns: 1fr;
        .buttons {
          justify-self: flex-start;
        }
      }
    }
  }

  .work-posts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .work-post {
      .entry-headers {
        margin: -2rem 1rem 0;
        padding: 1rem;
        background: #fff;
        border-radius: 0.5rem;
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);

        .entry-title {
          font-weight: var(--font-weight-bold, 800);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          a {
            color: inherit;
            &:hover {
              color: var(--color-primary, #1a49bd);
            }
          }
        }
        .entry-subtitle {
          line-height: 1.6rem;
        }
      }

      &:hover {
        .entry-headers {
          margin: -3rem 1rem 1rem;
          margin-bottom: 1rem;
          box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.15), 0px 5px 5px rgba(0, 0, 0, 0.05);
        }
      }
    }
  }

  // Testimonials
  .section4 {
    padding: 4em 0;
    .title-wrap {
      margin-bottom: 2rem;
    }
  }
  .testimonials {
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: 1fr 1fr;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .testimonial {
      border-radius: 0.5rem;
      margin-top: 4rem;
      padding: 2rem;
      line-height: 1.6rem;
      transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
      background: #e5e8f3;
      box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.05);

      .item-image {
        margin: -4rem auto 1rem;
        img {
          width: 100px;
          border-radius: 50%;
          background: var(--color-bg-dark);
          box-shadow: 0px 3px 30px rgba(0, 0, 0, 0.15), 0px 5px 5px rgba(0, 0, 0, 0.05);
        }
      }
      .item-author {
        font-weight: var(--font-weight-bold, 800);
      }
      .item-info,
      .item-content {
        opacity: 0.5;
      }
      .item-info {
        font-size: 0.9rem;
      }
      .item-content {
        font-size: 1.1rem;
        margin-bottom: 2rem;
      }
    }
  }

  .section5 {
    padding: 0 0 8em;
  }
}
</style>
