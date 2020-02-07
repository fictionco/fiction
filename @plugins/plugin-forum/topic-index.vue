<template>
  <div class="thread-index">
    <div class="thread-index-controls">
      <div class="filters">
        <factor-input-select placeholder="Sort" :list="['latest', 'popular']" :value="filterValue" />
      </div>
      <div class="discovery">
        <factor-input-text placeholder="Search" :list="[]" />
      </div>
    </div>
    <div class="thead-list-item">
      <div v-for="(item, index) in items" :key="index" class="list-item-wrap">
        <div class="list-item">
          <factor-link class="item-avatar" :path="getThreadPath(item)">
            <factor-avatar :url="item.avatarUrl" />
          </factor-link>
          <div class="item-text">
            <h2 class="title">
              <factor-link :path="getThreadPath(item)">{{ item.text }}</factor-link>
            </h2>
            <div class="meta">
              <component :is="setting('forum.components.topicAuthor')" class="meta-item" />
              <component :is="setting('forum.components.topicTimeAgo')" class="meta-item" />
            </div>
            <div class="synopsis">{{ item.synopsis }}</div>
          </div>
          <div class="item-details">
            <component :is="setting('forum.components.topicNumberPosts')" />
            <component :is="setting('forum.components.topicTags')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setting } from "@factor/api/settings"
import { FactorPost } from "@factor/post/types"
import {
  factorIcon,
  factorLink,
  factorAvatar,
  factorInputSelect,
  factorInputText
} from "@factor/ui"
import Vue from "vue"

export default Vue.extend({
  components: {
    factorLink,
    factorAvatar,
    factorIcon,
    factorInputSelect,
    factorInputText
  },
  data() {
    return {
      filterValue: "latest",
      items: [
        {
          text: "Some text this is a topic",
          synopsis: "some more text",
          avatarUrl: require("./img/avatar.jpg")
        },
        {
          text:
            "another post yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd ",
          synopsis:
            "yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd ",
          avatarUrl: require("./img/avatar.jpg")
        },
        {
          text: "another post yadda ydadd yadda ydadd yadda ydadd ",
          synopsis:
            "yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd yadda ydadd ",
          avatarUrl: require("./img/avatar.jpg")
        }
      ]
    }
  },
  methods: {
    setting,
    getThreadPath(this: any, post: FactorPost) {
      const entry = setting("forum.postRoute")
      return `${entry}/${post.permalink}`
    }
  }
})
</script>

<style lang="less">
.thread-index {
  .thread-index-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
  .list-item-wrap {
    margin-bottom: 2rem;
  }
  .list-item {
    display: grid;
    grid-template-columns: 3rem minmax(400px, 600px) minmax(100px, 150px);
    grid-gap: 1.5rem;
    .item-avatar {
      padding-top: 0.1rem;
      .avatar {
        width: 3rem;
      }
    }
    .item-text {
      .title {
        font-size: 1.35em;
        line-height: 1.2;
        font-weight: var(--font-weight-bold, 700);
        margin-bottom: 0.25rem;
        letter-spacing: -0.02em;
        a {
          color: inherit;
          &:hover {
            color: var(--color-primary);
          }
        }
      }
      .synopsis {
        font-size: 1.1em;
        opacity: 0.7;
        margin-top: 0.5rem;
      }
      .meta {
        display: flex;
        .meta-item {
          margin-right: 1rem;

          .factor-icon {
            font-size: 0.9em;
            margin-right: 0.5rem;
            opacity: 0.9;
          }
        }
      }
    }
    .item-details {
      text-align: right;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 0.5rem;
      grid-auto-rows: min-content;
      // .tags {
      //   .tag {
      //     border-radius: 5px;
      //     padding: 0 0.5rem;
      //     display: inline-block;
      //     margin: 0 1rem 0.5rem 0;
      //     background: var(--color-bg-contrast);
      //   }
      // }
      // .number-comments {
      //   .factor-icon {
      //     margin-right: 0.5rem;
      //   }
      // }
    }
  }
}
</style>
