<template>
  <i class="fa" :class="`fa-${icon}`" />
</template>

<script>
export default {
  props: {
    icon: { type: String, default: "" }
  },
  mounted() {
    this.addExternalScripts()
  },
  methods: {
    // Add dynamically since webpack tried to include as a module. Is there a better way?
    addExternalScripts() {
      const els = document.querySelector("#ficons")
      if (!els) {
        var link = document.createElement("link")
        link.href =
          "https://cdn.jsdelivr.net/npm/ficons@1.1.52/dist/ficons/font.css"
        link.type = "text/css"
        link.rel = "stylesheet"
        link.id = "ficons"
        document.querySelectorAll("head")[0].append(link)
      }
    }
  }
}
</script>

