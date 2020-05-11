<template>
  <div class="single-entry">
    <component
      :is="setting(`blog.components.${comp}`)"
      v-for="(comp, i) in setting('blog.layout.single')"
      :key="i"
      :post-id="post._id"
    />
  </div>
</template>
<script lang="ts">
import { setting, stored, titleTag, descriptionTag, shareImage } from "@factor/api"

export default {
  data() {
    return {}
  },
  metaInfo() {
    return {
      title: titleTag(this.post._id),
      description: descriptionTag(this.post._id),
      image: shareImage(this.post._id),
    }
  },
  routeClass() {
    return "nav-white"
  },
  computed: {
    post() {
      return stored("post") || {}
    },
  },
  methods: {
    setting,
    getPost(_id: any) {
      return stored(_id) || {}
    },
    tagLink(_id: any) {
      return setting("blog.indexRoute") + "?tag=" + _id
    },
  },
}
</script>

<style lang="less">
.plugin-blog {
  .single-entry {
    background: var(--color-bg-alt);
    @media (max-width: 900px) {
      padding: 3em 0;
    }

    .entry-header-inner,
    .entry-meta,
    .post-entry,
    .author-card {
      max-width: 800px;
      margin: 0 auto;
    }

    .entry-meta {
      padding: 1em 3em;
      align-items: center;
      @media (max-width: 900px) {
        padding: 1em 2em 3em;
      }
    }

    //padding: 1em 3em;
    // @media (max-width: 900px) {
    //   padding: 1.5em 1em;
    //   margin: 3em 1em 3em;
    // }

    .post-entry {
      padding: 0 3rem 1rem;
      @media (max-width: 900px) {
        padding: 3em 2em 2em;
      }
    }

    .entry-title a {
      color: inherit;
    }

    .return-link a,
    .edit {
      color: var(--color-primary);
    }

    .entry-tags a {
      color: #fff;
      background-color: var(--color-primary);
      border-radius: 9999px;

      &:hover {
        color: #fff;
        background-color: var(--color-primary-dark);
      }
    }
    .post-entry {
      font-size: initial;
      .highlight-code-wrap {
        font-size: 1.2em;
        line-height: 1.7em;
      }
      a {
        color: var(--color-primary);
      }
    }
    .social-share {
      justify-content: center;
    }
    .author-bio {
      position: relative;
      margin-top: 2rem;
      padding: 3em;
      @media (max-width: 900px) {
        padding: 1.5em 1em;
      }

      .author-card {
        position: relative;
        padding: 3em;
        border-radius: 8px;
        border: 1px solid rgba(17, 16, 16, 0.1);
        transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
        .avatar,
        .text {
          position: relative;
          z-index: 1;
        }
        &:hover {
          background: #fff;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
        }

        @media (max-width: 900px) {
          flex-direction: column;
          padding: 2em;
          .avatar {
            margin-bottom: 1.5em;
          }
        }
      }
    }
  }
}
</style>
