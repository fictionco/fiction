<template>
  <div class="entry-header">
    <div class="splash">
      <factor-link class="back label label-primary" :path="setting('jobs.indexRoute')">
        <factor-icon icon="fas fa-arrow-left" />
        {{ returnLinkText }}
      </factor-link>

      <div class="entry-meta">
        <div v-if="post.jobLocation" class="location">{{ post.jobLocation }}</div>
        <div v-if="post.jobType" class="type">{{ post.jobType }}</div>

        <div>
          <factor-link
            v-if="post.jobCompanyName && post.jobCompanyWebsite"
            :path="post.jobCompanyWebsite"
            target="_blank"
            class="company"
          >{{ post.jobCompanyName }}</factor-link>
          <div v-else-if="post.jobCompanyName" class="company">{{ post.jobCompanyName }}</div>
        </div>
      </div>

      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>

      <h3 class="entry-synopsis">{{ post.synopsis }}</h3>

      <factor-post-edit :post-id="post._id" />
    </div>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink, factorIcon } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"

export default {
  components: { factorLink, factorIcon, factorPostEdit },
  props: {
    postId: { type: String, default: "" },
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    returnLinkText(this: any) {
      return setting("jobs.returnLinkText") || "All Jobs"
    },
  },
  methods: { postLink, setting },
}
</script>
<style lang="less">
.careers {
  .single-entry {
    .entry-header {
      margin: 0;

      @media (max-width: 767px) {
        padding: 0 1em;
      }

      .label {
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--color-text-secondary);
      }

      .splash {
        display: grid;
        grid-template-columns: 1fr;
        grid-column-gap: 60px;
        align-items: center;
        text-align: left;
        max-width: 50rem;
        margin: 0 auto;
        padding: 6em 0 2em;
        @media (max-width: 767px) {
          padding: 6em 0 7em;
        }

        .entry-title {
          font-size: 4em;
          letter-spacing: -0.025em;
          line-height: 1.1;
          font-weight: 700;
          margin-bottom: 1rem;

          a {
            color: inherit;
          }

          @media (max-width: 767px) {
            font-size: 2em;
          }
        }

        .entry-synopsis {
          font-size: 1.75em;
          font-weight: 400;
          color: var(--color-text-secondary);
          letter-spacing: -0.025em;
        }

        .entry-meta {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          margin-top: 2em;
          margin-bottom: 1rem;

          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--color-text-secondary);

          div:not(:first-child) {
            margin-left: 2rem;
          }

          .factor-link:hover {
            opacity: 1;
          }

          .company,
          .location,
          .date,
          .type {
            @media (max-width: 767px) {
              display: block;
            }
          }
        }

        .edit {
          display: block;
          font-size: 1rem;
          letter-spacing: initial;
          margin: 0.5em 0;
        }
      }
    }
  }
}
</style>
