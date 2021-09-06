<template>
  <li v-if="comment" class="comment">
    <div class="by">
      <router-link :to="'/user/' + comment?.by">{{ comment?.by }}</router-link>
      {{ timeAgo(comment?.time) }} ago
    </div>
    <div v-formatted-text="comment?.text" class="text" />
    <div
      v-if="comment?.kids && comment?.kids.length > 0"
      class="toggle"
      :class="{ open }"
    >
      <a @click="open = !open">{{
        open ? "[-]" : "[+] " + pluralize(comment?.kids.length) + " collapsed"
      }}</a>
    </div>
    <ul v-show="open" class="comment-children">
      <comment v-for="kid in comment?.kids" :id="kid" :key="kid" />
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { timeAgo, stored } from "@factor/api"
import { DataItem } from "../api/types"

const pluralize = (n: number) => n + (n === 1 ? " reply" : " replies")

const props = defineProps({ id: { type: [String, Number], default: "" } })
const open = ref(true)
const comment = computed<DataItem | undefined>(() => stored(props.id))
</script>

<style lang="less">
.comment-children {
  .comment-children {
    margin-left: 1.5em;
  }
}

.comment {
  border-top: 1px solid #eee;
  position: relative;

  .by,
  .text,
  .toggle {
    font-size: 0.9em;
    margin: 1em 0;
  }

  .by {
    color: #828282;

    a {
      color: #828282;
      text-decoration: underline;
    }
  }

  .text {
    overflow-wrap: break-word;

    a:hover {
      color: #ff6600;
    }

    pre {
      white-space: pre-wrap;
    }
  }

  .toggle {
    background-color: #fffbf2;
    padding: 0.3em 0.5em;
    border-radius: 4px;

    a {
      color: #828282;
      cursor: pointer;
    }

    &.open {
      padding: 0;
      background-color: transparent;
      margin-bottom: -0.5em;
    }
  }
}
</style>
