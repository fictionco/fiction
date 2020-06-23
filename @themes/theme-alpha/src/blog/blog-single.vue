<template>
  <div class="single-entry">
    <div v-if="!isEmpty(post)">
      <component
        :is="setting(`blog.components.${comp}`)"
        v-for="(comp, i) in setting('blog.layout.single')"
        :key="i"
        :post-id="post._id"
      />
    </div>
    <factor-error-404 v-else />
  </div>
</template>
<script lang="ts">
import { factorError404 } from "@factor/ui"
import {
  isEmpty,
  setting,
  stored,
  titleTag,
  descriptionTag,
  shareImage,
} from "@factor/api"

export default {
  components: { factorError404 },
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
  computed: {
    post() {
      return stored("post") || {}
    },
  },

  methods: { isEmpty, setting },
}
</script>

<style lang="less">
.alpha-content {
  .plugin-blog {
    .single-entry {
      max-width: 100%;
      padding: 0;

      .entry-header-inner,
      .entry-meta,
      .author-card {
        max-width: 800px;
        margin: 0 auto;
        padding: 3rem 3rem 1rem;
        @media (max-width: 900px) {
          padding: 1.5rem 1rem 0;
          margin: 3rem 1rem 3rem;
        }
      }

      .post-entry,
      .social-share {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 3rem 1rem;
        @media (max-width: 900px) {
          padding: 0 1rem 1rem;
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
          @media (max-width: 900px) {
            padding: 0 1em;
          }
        }
        table {
          display: table;
          margin: 0.5em 0 1.4em;
          width: auto;
          border: 1px solid #e7ebed;

          tr:nth-child(even) {
            background: #f3f5fa;
          }

          th {
            text-align: left;
            font-weight: 600;
            border-bottom: 1px solid #e7ebed;
          }

          th,
          td {
            padding: 0.5em;
          }
        }
        img {
          max-height: inherit;
        }
      }
      .social-share {
        justify-content: center;
      }
      .author-bio {
        position: relative;
        margin-top: 2rem;
        padding: 3em;
        background: var(--color-bg-alt);
        @media (max-width: 900px) {
          padding: 1.5em 1em;
        }

        .author-card {
          position: relative;
          padding: 3em;
          border-radius: 8px;
          background: #fff;
          transition: 0.29s cubic-bezier(0.52, 0.01, 0.16, 1);
          .avatar,
          .text {
            position: relative;
            z-index: 1;
          }
          &:hover {
            transform: translateY(-0.5rem);
            box-shadow: 0 3px 30px rgba(0, 0, 0, 0.15);
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
}
</style>
