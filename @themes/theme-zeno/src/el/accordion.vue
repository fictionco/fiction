<template>
  <div>
    <div>
      <a
        href="#"
        class="p-4 block no-underline flex justify-between"
        @click.prevent="active = !active"
      >
        <strong>{{ title }}</strong>
        <span v-show="!active" class="down-Arrow">
          <factor-icon icon="plus" />
        </span>
        <span v-show="active" class="up-Arrow">
          <factor-icon icon="minus" />
        </span>
      </a>
    </div>
    <div v-show="active" class="p-2">
      <slot />
    </div>
  </div>
</template>


<script>
import { setting } from "@factor/tools"
export default {
  props: {
    title: { type: String, default: "" }
  },
  data() {
    return {
      loading: true,
      active: false
    }
  },
  methods: { setting }
}
</script>