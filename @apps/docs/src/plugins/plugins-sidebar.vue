<template>
  <div class="plugins-sidebar">
    <div class="sidebar-inner">
      <section class="plugins-featured">
        <header class="section-header">
          <h1 class="title">Popular</h1>
        </header>
        <section-plugins :text="false" />
      </section>

      <section class="plugins-featured">
        <header class="section-header">
          <h1 class="title">New</h1>
        </header>
        <section-plugins :text="false" />
      </section>

      <section class="plugins-featured">
        <header class="section-header">
          <h1 class="title">Recently Updated</h1>
        </header>
        <section-plugins :text="false" />
      </section>

      <!-- <h2>Sidebar Header</h2>
      <ul class="menu-root">
        <li>
          <factor-link path="/">Dynamic List Item Will Go Here</factor-link>
        </li>
        <li>
          <factor-link path="/">Dynamic List Item Will Go Here</factor-link>
        </li>
        <li>
          <factor-link
path="/">Really Really Really Really Loooooong Dynamic List Item Will Go
            Here</factor-link>
        </li>
      </ul>-->
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "section-plugins": () => import("./section-plugins")
  }
}
</script>

<style lang="less">
// Plugins Sidebar
.plugins-sidebar {
  padding: 0;
}
</style>
