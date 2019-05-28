<template>
  <div class="items-wrap" :class="theme ? theme : 'dark'">
    <div class="item">
      <icon-svg :theme="theme" icon="docs" />
      <h2 class="title">Docs</h2>
      <p
        class="content"
      >Learn how to use Factor CMS and build things with its cutting-edge build system and JS framework.</p>
      <factor-link path="https://factor.fiction.com/docs" target="_blank">
        View
        <factor-icon icon="arrow-right" />
      </factor-link>
    </div>
    <div class="item">
      <icon-svg :theme="theme" icon="themes" />
      <h2 class="title">Themes</h2>
      <p
        class="content"
      >Build things faster with Factor themes. Component-based themes designed or reviewed-by the Factor team.</p>
      <factor-link path="https://factor.fiction.com/themes" target="_blank">
        View
        <factor-icon icon="arrow-right" />
      </factor-link>
    </div>
    <div class="item">
      <icon-svg :theme="theme" icon="stacks" />
      <h2 class="title">Stacks</h2>
      <p
        class="content"
      >Stacks are like themes but for service APIs. No more days and months learning new APIs to get things working.</p>
      <factor-link path="https://factor.fiction.com/stacks" target="_blank">
        Learn More
        <factor-icon icon="arrow-right" />
      </factor-link>
    </div>
    <div class="item">
      <icon-svg :theme="theme" icon="plugins" />
      <h2 class="title">Plugins</h2>
      <p
        class="content"
      >Factor plugins add functionality to your app. Just add to package dependencies and the rest takes care of itself..</p>
      <factor-link path="https://factor.fiction.com/plugins" target="_blank">
        View
        <factor-icon icon="arrow-right" />
      </factor-link>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    "icon-svg": () => import("./icon-svg")
  },
  props: {
    theme: { type: String, default: "" }
  }
}
</script>


<style lang="less">
.items-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1.5em;
  @media (max-width: 767px) {
    display: block;
  }

  &.light .item {
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.3);
    a {
      color: inherit;
    }
  }
  &.dark .item {
    box-shadow: 0 0 0 1px rgba(0, 43, 93, 0.1);
  }
  .item {
    display: block;
    color: inherit;
    padding: 2em;
    margin-bottom: 1.5em;

    border-radius: 4px;

    transition: all 0.2s ease-in-out;
    a {
      font-weight: 600;
    }

    .icon {
      height: 50px;
      margin-bottom: 1em;
      display: flex;
      align-items: flex-end;
    }
    .title {
      font-size: 1.6em;
      font-weight: 800;
      margin-bottom: 0.5em;
    }
    .content {
      line-height: 1.5;
      margin-bottom: 0.8em;
    }
  }
}
</style>