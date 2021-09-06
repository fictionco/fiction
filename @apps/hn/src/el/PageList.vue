<template>
  <div :key="view" class="news-view">
    <div class="news-list-nav">
      <ElemButton
        btn="primary"
        size="sm"
        :to="`/v/${view}/${page - 1}`"
        :disabled="page <= 1"
        >&larr; Previous</ElemButton
      >

      <span class="font-semibold">Page {{ page }} of {{ maxPage }}</span>
      <ElemButton
        btn="primary"
        size="sm"
        :to="`/v/${view}/${page + 1}`"
        :disabled="!hasMore"
        >more &rarr;</ElemButton
      >
    </div>

    <transition :name="transition">
      <div v-if="displayedPage > 0" :key="displayedPage" class="news-list">
        <transition-group tag="ul" name="item">
          <Item v-for="item in displayedItems" :key="item.id" :item="item" />
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useMeta, stored, toLabel } from "@factor/api"
import { watchList } from "../api"
import ElemButton from "@factor/ui/ElemButton.vue"
import {
  computed,
  ref,
  onServerPrefetch,
  watch,
  onBeforeUnmount,
  onMounted,
} from "vue"
import {
  getActiveItems,
  setList,
  ensureActiveItems,
  requestListData,
  itemsPerPage,
} from "../api/data"
import { ListTypes, DataItem } from "../api/types"
import Item from "./Item.vue"
import { useRoute, useRouter } from "vue-router"

const router = useRouter()
const route = useRoute()
const transition = ref("slide-right")
const displayedPage = ref(Number(route.params.page) || 1)
const displayedItems = ref(getActiveItems())
const unwatchList = ref()

const view = computed<ListTypes>(
  () => (route.params.view as ListTypes) || ListTypes.TOP,
)
const page = computed<number>(() => Number(route.params.page) || 1)
const maxPage = computed(() => {
  const list = stored<DataItem[]>(view.value) || []
  return Math.ceil(list.length / itemsPerPage)
})
const hasMore = computed(() => {
  return page.value < maxPage.value
})

const loadItems = async (to = page.value, from = -1) => {
  await requestListData({
    type: view.value,
  })

  if (page.value < 0 || page.value > maxPage.value) {
    router.replace(`/${view.value}/1`)
    return
  }
  const transitionName = to > from ? "slide-left" : "slide-right"
  transition.value = from === -1 ? "" : transitionName
  displayedPage.value = to
  displayedItems.value = getActiveItems()
}

watch(
  () => page.value,
  (to, from) => {
    loadItems(to, from)
  },
)

watch(
  () => view.value,
  () => {
    loadItems()
  },
)
useMeta({
  title: toLabel(view.value),
})

onServerPrefetch(() => {
  return requestListData({ type: view.value })
})

onMounted(async () => {
  loadItems(page.value)

  // watch the current list for realtime updates
  unwatchList.value = await watchList(view.value, async (ids: string[]) => {
    setList({ type: view.value, ids })
    await ensureActiveItems()
    displayedItems.value = getActiveItems()
  })
})

onBeforeUnmount(() => {
  if (unwatchList.value) unwatchList.value()
})
</script>

<style lang="less">
.news-view {
  padding-top: 45px;
}

.news-list-nav,
.news-list {
  background-color: #fff;
  border-radius: 2px;
}

.scrolled .news-list-nav {
  box-shadow: 0 1px 3px rgba(40, 40, 40, 0.1);
}

.news-list-nav {
  padding: 15px 30px;
  position: fixed;
  text-align: center;
  top: 55px;
  left: 0;
  right: 0;
  z-index: 998;

  a {
    margin: 0 1em;
  }

  .disabled {
    color: #ccc;
  }

  .font-semibold {
    font-weight: 700;
  }
}

.news-list {
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.slide-left-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-to,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.item-move,
.item-enter-active,
.item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}
</style>
