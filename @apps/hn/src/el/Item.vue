<template>
  <li class="news-item">
    <span class="score">{{ item.score }}</span>
    <span class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
        <span class="host text-color-200 ml-1">({{ niceHost(item.url) }})</span>
      </template>
      <template v-else>
        <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
      </template>
    </span>
    <br />
    <span class="meta text-color-200 space-x-2 flex">
      <span v-if="item.type !== 'job'" class="by">
        by
        <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
      </span>
      <span class="time">{{ timeAgo(item.time) }} ago</span>
      <span v-if="item.type !== 'job'" class="comments-link">
        |
        <router-link :to="'/item/' + item.id"
          >{{ item.descendants }} comments</router-link
        >
      </span>
      <span v-if="item.type !== 'story'" class="label px-2">{{
        item.type
      }}</span>
    </span>
  </li>
</template>

<script lang="ts" setup>
import { timeAgo } from "@factor/api"
import { niceHost } from "../api/util"
defineProps({
  item: { type: Object, default: () => {} },
})
</script>

<style lang="less">
.news-item {
  background-color: #fff;
  padding: 20px 30px 20px 80px;
  border-bottom: 1px solid #eee;
  position: relative;
  line-height: 20px;

  .title a {
    font-weight: 600;
    &:hover {
      color: var(--color-primary);
    }
  }

  .score {
    color: #ff6600;
    font-size: 1.1em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 0;
    width: 80px;
    text-align: center;
    margin-top: -10px;
  }

  .meta,
  .host {
    font-size: 0.85em;

    a {
      text-decoration: underline;

      &:hover {
        color: #ff6600;
      }
    }
  }
  .label {
    border-radius: 3px;
    text-transform: capitalize;

    font-size: 0.8em;
    color: #fff;
    background: var(--color-primary);
  }
}
</style>
