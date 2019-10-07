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
          <span v-if="showAuthor != false" class="author">by {{ post.author }}</span>
          <div v-if="post.categories.length > 0 && showCategories != false" class="categories">
            in
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
    showAuthor: { type: Boolean, default: true },
    showCategories: { type: Boolean, default: true },
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
            }
          ],
          downloads: `1262`,
          text: `Create a sitemap for your factor site.`,
          link: { path: "/factor-sitemap", text: "Details" },
          created_at: "2019-01-26T19:01:12Z",
          updated_at: "2019-01-26T19:14:43Z"
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
          link: { path: "/storage-s3", text: "Details" },
          created_at: "2019-01-26T19:01:12Z",
          updated_at: "2019-01-26T19:14:43Z"
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
          link: { path: "/factor-google-tagmanager", text: "Details" },
          created_at: "2019-01-26T19:01:12Z",
          updated_at: "2019-01-26T19:14:43Z"
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
          link: { path: "/factor-google-analytics", text: "Details" },
          created_at: "2019-01-26T19:01:12Z",
          updated_at: "2019-01-26T19:14:43Z"
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
          link: { path: "/factor-algolia", text: "Details" },
          created_at: "2019-01-26T19:01:12Z",
          updated_at: "2019-01-26T19:14:43Z"
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
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-gap: 2rem;
    align-items: flex-start;
    margin-bottom: 1rem;
    .post-image {
      display: flex;
      justify-content: center;
      height: 130px;
      padding: 4px;
      border-radius: 6px;
      img {
        max-width: 100%;
      }
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
    // h3,
    // p {
    //   margin-bottom: 10px;
    // }
    // p:last-child {
    //   margin-bottom: 0;
    // }
  }
}
</style>
