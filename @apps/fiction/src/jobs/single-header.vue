<template>
  <div class="entry-header">
    <div class="splash">
      <factor-link class="back label label-primary" :path="setting('jobs.indexRoute')">
        <factor-icon icon="arrow-left" />
        <span>{{ returnLinkText }}</span>
      </factor-link>

      <div class="entry-meta">
        <span v-if="post.jobLocation" class="location">{{ post.jobLocation }}</span>
        <span v-if="post.jobType" class="type">{{ post.jobType }}</span>

        <factor-link
          v-if="post.jobCompanyName && post.jobCompanyWebsite"
          :path="post.jobCompanyWebsite"
          target="_blank"
          class="company"
        >{{ post.jobCompanyName }}</factor-link>
        <span v-else-if="post.jobCompanyName" class="company">{{ post.jobCompanyName }}</span>
      </div>

      <h1 class="entry-title">
        <factor-link :path="postLink(post._id)">{{ post.title }}</factor-link>
      </h1>

      <h3 class="entry-sub-title">{{ post.subTitle }}</h3>

      <!-- <factor-post-edit :post-id="post._id" /> -->
    </div>
  </div>
</template>
<script lang="ts">
import { factorPostEdit } from "@factor/post"
import { factorLink, factorIcon } from "@factor/ui"
import { setting, stored, postLink } from "@factor/api"
import Vue from "vue"

export default Vue.extend({
  components: { factorLink, factorIcon, factorPostEdit },
  props: {
    postId: { type: String, default: "" }
  },
  computed: {
    post(this: any) {
      return stored(this.postId) || {}
    },
    returnLinkText(this: any) {
      return setting("jobs.returnLinkText") || "All Jobs"
    }
  },
  methods: { postLink, setting }
})
</script>
<style lang="less">
.careers {
  .single-entry {
    .entry-header {
      margin: 0;
      padding: 0 2em;
      background: #1b223c url(./img/rectangles-pink.svg) no-repeat center center;
      background-size: 80%;

      @media (max-width: 767px) {
        background-size: 100%;
        padding: 0 1em;
      }

      .label {
        text-transform: uppercase;
        letter-spacing: 0.1em;
        &.label-primary {
          color: var(--color-primary);
          &:hover {
            color: var(--color-secondary);
          }
        }
      }

      .splash {
        display: grid;
        grid-template-columns: 1fr;
        grid-column-gap: 60px;
        align-items: center;
        text-align: left;
        max-width: 50rem;
        margin: 0 auto;
        padding: 6em 0 8em;
        @media (max-width: 767px) {
          padding: 6em 0 7em;
        }

        .entry-title {
          font-weight: var(--font-weight-bold, 800);
          font-size: 3em;
          letter-spacing: -0.03em;
          line-height: 1.4em;
          color: #f9f9f9;
          a:hover {
            color: inherit;
            opacity: 0.5;
          }
          @media (max-width: 767px) {
            font-size: 2em;
          }
        }
        // .entry-meta {
        //   margin-bottom: 0.5rem;
        // }
        .entry-meta {
          display: flex;
          align-items: flex-start;
          flex-wrap: wrap;
          padding: 0.5rem 0 0;
          margin-top: 2em;
          margin-bottom: 0.5rem;

          .factor-link:hover {
            opacity: 1;
          }

          .company,
          .location,
          .date,
          .type {
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            opacity: 0.4;
            margin-right: 0.5em;

            &:first-child:before {
              margin-right: 0;
              border-left: none;
            }
            &:before {
              margin-right: 0.5em;
              border-left: 1px solid rgba(217, 217, 217, 0.3);
              content: "";
            }

            @media (max-width: 767px) {
              display: block;
            }
          }
        }

        .entry-sub-title {
          opacity: 0.7;
          font-size: 1.4em;
          font-weight: 400;
          color: #d9d9d9;

          @media (max-width: 767px) {
            font-size: 1.2em;
          }
        }
        .edit {
          display: block;
          font-size: 1rem;
          letter-spacing: initial;
          margin: 0.5em 0;
          @media (max-width: 767px) {
            display: none;
          }
        }
      }

      .entry-title {
        font-weight: var(--font-weight-bold, 800);
        font-size: 2.5em;
        line-height: 1.1;

        @media (max-width: 767px) {
          font-size: 2em;
        }
        a {
          color: inherit;
          &:hover {
            color: var(--color-primary, #0496ff);
          }
          &:active {
            opacity: 0.7;
          }
        }
      }
      .entry-sub-title {
        font-size: 1.4em;
        opacity: 0.7;
      }
    }
  }
}
</style>
