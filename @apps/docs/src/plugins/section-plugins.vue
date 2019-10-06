<template>
  <div class="section-plugins">
    <section
      v-for="(post, index) in filteredPosts"
      :id="post.id"
      :key="index"
      class="post"
      :class="post.class"
    >
      <div class="post-image">
        <img src="./img/icon-aws.svg" />
      </div>
      <div class="post-content">
        <h3 class="title">
          <factor-link :path="post.link.path">{{ post.title }}</factor-link>
        </h3>
        <div class="meta">
          <span class="author">by {{ post.author }}</span> in
          <div v-if="post.categories.length > 0" class="categories">
            <span
              v-for="(cat, ci) in filterCategories(post.categories)"
              :key="ci"
              class="category"
            >{{ cat.name }}</span>
          </div>
          <div
            v-if="post.downloads && post.downloads > 0"
            class="downloads"
          >{{ post.downloads }} downloads</div>
        </div>
        <p v-if="text != false" class="text">{{ post.text }}</p>
        <factor-link :path="post.link.path">{{ post.link.text }} &rarr;</factor-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    category: { type: String, default: "" },
    text: { type: Boolean, default: true }
  },
  data() {
    return {
      posts: [
        {
          title: "Factor Sitemap",
          author: "Factor",
          categories: [
            {
              id: 1,
              name: "SEO",
              slug: "seo"
            },
            {
              id: 2,
              name: "Featured",
              slug: "featured"
            },
            {
              id: 7,
              name: "Raymond",
              slug: "raymond"
            },
            {
              id: 8,
              name: "Why not",
              slug: "whynot"
            }
          ],
          downloads: `1262`,
          text: `Create a sitemap for your factor site.`,
          link: { path: "/factor-sitemap", text: "Details" }
        },
        {
          title: "Storage S3",
          author: "Factor",
          categories: [
            {
              id: 3,
              name: "Utilities",
              slug: "utilities"
            }
          ],
          downloads: `962`,
          text: `Enables you to deploy your Factor site to an S3 bucket. Requires very little configuration, while optimizing your site as much as possible.`,
          link: { path: "/storage-s3", text: "Details" }
        },
        {
          title: "Google Tag Manager",
          author: "Factor",
          categories: [
            {
              id: 3,
              name: "Utilities",
              slug: "utilities"
            }
          ],
          downloads: `878`,
          text: `Easily add Google Tag Manager to your Factor site.`,
          link: { path: "/factor-google-tagmanager", text: "Details" }
        },
        {
          title: `Factor Google Analytics`,
          author: "Factor",
          categories: [
            {
              id: 2,
              name: "Featured",
              slug: "featured"
            },
            {
              id: 3,
              name: "Utilities",
              slug: "utilities"
            }
          ],
          downloads: `894`,
          text: `Easily add Google Analytics to your Factor site.`,
          link: { path: "/factor-google-analytics", text: "Details" }
        },
        {
          title: "Factor Algolia",
          author: "Factor",
          categories: [
            {
              id: 4,
              name: "Search",
              slug: "search"
            },
            {
              id: 2,
              name: "Featured",
              slug: "featured"
            }
          ],
          downloads: `767`,
          text: `A Factor plugin to push to Algolia based on a certain query.`,
          link: { path: "/factor-algolia", text: "Details" }
        }
      ]
    }
  },
  computed: {
    filteredPosts() {
      let posts = this.posts

      // Post Category
      if (this.category && this.category !== "") {
        posts = posts.filter(post => {
          let foundCategory = post.categories.findIndex(c => {
            return c.slug === this.category
          })
          return foundCategory !== -1
        })
      }

      // Post Count
      //let postCount = this.count
      // if (postCount != -1) {
      //   return this.posts.slice(0, +postCount)
      //   // Do it through filter
      //   // posts = posts.filter(post => {
      //   // ugh
      //   // })
      // } else {
      //   return this.posts
      // }

      return posts
    }
  },
  methods: {
    filterCategories: function(items) {
      return items.filter(function(item) {
        // Remove featured category
        return item.slug != "featured"
      })
    }
  }
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
    border: 1px solid var(--color-bg-contrast-more);
    transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
    &:hover {
      box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.07), 0px 18px 26px rgba(80, 102, 119, 0.16);
      transform: translateY(-0.4rem);
    }
    .post-image {
      display: flex;
      justify-content: center;
      height: 130px;
      border: 1px solid var(--color-bg-contrast-more);
      border-radius: 6px;
      background: var(--color-bg-contrast);
    }
    .title {
      font-weight: 500;
      font-size: 1.6em;
      line-height: 1.2em;
      a {
        color: var(--color-text);
        &:hover {
          color: var(--color-primary);
        }
      }
    }
    .meta {
      color: rgba(var(--color-text-rgb), 0.6);
      .categories {
        display: inline;
        .category {
          &:after {
            content: ", ";
          }
          &:last-of-type {
            &:after {
              content: initial;
            }
          }
        }
      }
    }
    .text {
      //font-size: 0.94em;
      line-height: 1.7em;
      margin-top: 1rem;
    }
    h3,
    p {
      margin-bottom: 10px;
    }
    p:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
