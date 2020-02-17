<template>
  <div class="page-home">
    <home-intro v-if="setting(`home.intro.component`)" />

    <section v-if="section2" :id="section2id" class="section2">
      <div class="mast title-wrap text-center">
        <h3 v-if="section2pretitle" v-formatted-text="section2pretitle" class="pretitle" />
        <h1 v-if="section2title" v-formatted-text="section2title" class="title" />
      </div>
      <div class="mast section2-inner">
        <div v-for="(item, i) in section2items" :key="i" class="item">
          <div class="item-icon">
            <img v-if="item.icon" :src="item.icon" :alt="item.title" />
          </div>
          <div class="item-content">
            <h2 v-if="item.title" class="item-title">{{ item.title }}</h2>
            <p v-if="item.content" class="item-description text-gray-600">{{ item.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="section3" :id="section3id" class="section3">
      <div class="mast">
        <div class="title-wrap">
          <div>
            <h3 v-if="section3pretitle" v-formatted-text="section3pretitle" class="pretitle" />
            <h1 v-if="section3title" v-formatted-text="section3title" class="title" />
          </div>
          <div v-if="section3Buttons" class="buttons">
            <template v-for="(button, i) in section3Buttons">
              <factor-link
                v-if="button.link"
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
        <h3 v-if="section4pretitle" v-formatted-text="section4pretitle" class="pretitle" />
        <h1 v-if="section4title" v-formatted-text="section4title" class="title" />
      </div>
      <div class="mast testimonials section4-inner">
        <div v-for="(item, i) in section4items" :key="i" class="testimonial">
          <div v-if="item.image" class="item-image">
            <img :src="item.image" :alt="item.author" />
          </div>
          <p v-if="item.content" v-formatted-text="item.content" class="item-content" />
          <h2 v-if="item.author" v-formatted-text="item.author" class="item-author" />
          <h3 v-if="item.info" v-formatted-text="item.info" class="item-info" />
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
        limit: setting("home.section3.limit")
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
    font-weight: var(--font-weight-bold);
    font-size: 3em;
    letter-spacing: -0.03em;
    color: var(--color-text);

    @media (max-width: 900px) {
      font-size: 2em;
    }
  }

  /**
  * Services section
  */
  .section2 {
    padding: 4em 0;
    background: var(--color-bg-alt);

    .pretitle {
      color: var(--color-primary);
    }
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
            font-weight: var(--font-weight-bold);
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
        }
      }
    }
  }

  /**
  * Work section
  */
  .section3 {
    padding: 4em 0;
    .title-wrap {
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-gap: 2rem;
      align-items: center;
      margin-bottom: 2rem;

      .pretitle {
        color: var(--color-primary);
      }
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
          font-weight: var(--font-weight-bold);
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          a {
            color: inherit;
            &:hover {
              color: var(--color-primary);
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

  /**
  * Testimonials section
  */
  .section4 {
    padding: 4em 0;
    background: var(--color-bg-alt);

    .title-wrap {
      margin-bottom: 2rem;
      .pretitle {
        color: var(--color-primary);
      }
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

      &:hover {
        background: none;
        box-shadow: none;
        padding: 1.5rem 2rem 2rem;
      }

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
        font-weight: var(--font-weight-bold);
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

  /**
  * Clients section
  */
  .section5 {
    padding: 0 0 8em;
    background: var(--color-bg-alt);

    .pretitle {
      color: var(--color-primary);
    }
  }
}
</style>
