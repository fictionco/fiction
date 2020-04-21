<template>
  <div class="wrap">
    <factor-input-editor autosave-id="ui" />
  </div>
</template>

<script lang="ts">
import { factorInputEditor } from "@factor/ui"

export default {
  components: { factorInputEditor },
}
</script>
