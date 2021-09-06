<template>
  <div v-if="item" class="item-view">
    <template v-if="item">
      <div class="item-view-header">
        <a :href="item.url" target="_blank">
          <h1>{{ item.title }}</h1>
        </a>
        <span v-if="item.url" class="host text-color-500"
          >({{ niceHost(item.url) }})</span
        >
        <p class="meta">
          {{ item.score }} points | by
          <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
          {{ timeAgo(item.time) }} ago
        </p>
      </div>
      <div class="item-view-comments">
        <p class="item-view-comments-header">
          {{ item.kids ? item.descendants + " comments" : "No comments yet." }}
          <Spinner :show="loading" />
        </p>

        <ul v-if="!loading" class="comment-children">
          <Comment v-for="id in item.kids" :id="id" :key="id" />
        </ul>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { niceHost } from "../api/util"
import { DataItem } from "../api/types"
import { timeAgo, stored } from "@factor/api"
import Spinner from "./Spinner.vue"
import Comment from "./Comment.vue"
import { ref, computed, onServerPrefetch, onMounted, watch } from "vue"
import { fetchComments, requestItems } from "../api/data"
import { useRoute } from "vue-router"
const loading = ref(true)
const route = useRoute()
const item = computed<DataItem | undefined>(() => {
  return stored<DataItem>(route.params.id as string)
})

const getFetchComments = async () => {
  if (!item.value || !item.value.kids) {
    return
  }

  loading.value = true
  await fetchComments(item.value)
  loading.value = false
}
onMounted(() => {
  getFetchComments()
})
watch(
  () => item.value,
  () => getFetchComments(),
)
onServerPrefetch(() => {
  return requestItems({ ids: [route.params.id as string] })
})
</script>

<style lang="less">
.item-view-header {
  background-color: #fff;
  padding: 1.8em 2em 1em;

  h1 {
    display: inline;
    font-size: 1.5em;
    margin: 0;
    margin-right: 0.5em;
  }

  .host,
  .meta,
  .meta a {
    color: #828282;
  }

  .meta a {
    text-decoration: underline;
  }
}

.item-view-comments {
  background-color: #fff;
  margin-top: 10px;
  padding: 0 2em 0.5em;
}

.item-view-comments-header {
  margin: 0;
  font-size: 1.1em;
  padding: 1em 0;
  position: relative;

  .spinner {
    display: inline-block;
    margin: -15px 0;
  }
}

.comment-children {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

@media (max-width: 600px) {
  .item-view-header {
    h1 {
      font-size: 1.25em;
    }
  }
}
</style>
